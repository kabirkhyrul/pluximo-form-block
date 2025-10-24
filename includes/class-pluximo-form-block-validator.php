<?php
/**
 * Form Validation Class for Pluximo Form Blocks.
 *
 * Handles comprehensive server-side validation of form submissions.
 * This class ensures all form data is properly validated before processing.
 *
 * @package PluximoFormBlock
 * @since   1.0.0
 */

// Exit if version constant is not defined.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Pluximo_Form_Block_Validator
 *
 * Provides comprehensive server-side validation for form submissions.
 * Never trust client-side validation - always validate on the server.
 */
class Pluximo_Form_Block_Validator {

	/**
	 * Field type validator instance.
	 *
	 * @var Pluximo_Form_Block_Field_Type_Validator
	 */
	private $type_validator;

	/**
	 * Pattern validator instance.
	 *
	 * @var Pluximo_Form_Block_Pattern_Validator
	 */
	private $pattern_validator;

	/**
	 * Field configuration manager.
	 *
	 * @var Pluximo_Form_Block_Field_Config
	 */
	private $field_config;

	/**
	 * Maximum number of fields allowed per form submission.
	 *
	 * @var int
	 */
	private $max_fields = 50;

	/**
	 * Maximum length for any single field value.
	 *
	 * @var int
	 */
	private $max_field_length = 10000;

	/**
	 * Constructor.
	 *
	 * Sets up validation limits with filter hooks for customization.
	 */
	public function __construct() {
		$this->max_fields       = apply_filters( 'pluximo_form_block_max_fields', $this->max_fields );
		$this->max_field_length = apply_filters( 'pluximo_form_block_max_field_length', $this->max_field_length );

		// Initialize helper classes.
		$this->type_validator    = new Pluximo_Form_Block_Field_Type_Validator();
		$this->pattern_validator = new Pluximo_Form_Block_Pattern_Validator();
		$this->field_config      = new Pluximo_Form_Block_Field_Config();
	}

	/**
	 * Validate complete form submission.
	 *
	 * @param array $form_data The form data to validate.
	 * @return true|WP_Error True if valid, WP_Error with field errors if invalid.
	 */
	public function validate_form_submission( $form_data ) {
		// Validate form data structure.
		$structure_validation = $this->validate_form_structure( $form_data );
		if ( is_wp_error( $structure_validation ) ) {
			return $structure_validation;
		}

		// Validate individual fields.
		$field_errors = $this->validate_form_fields( $form_data );
		if ( ! empty( $field_errors ) ) {
			return new WP_Error(
				'validation_failed',
				__( 'Form validation failed.', 'pluximo-form-block' ),
				$field_errors
			);
		}

		// Allow custom validation via filter.
		$custom_validation = apply_filters( 'pluximo_form_block_custom_validation', true, $form_data );
		if ( is_wp_error( $custom_validation ) ) {
			return $custom_validation;
		}

		return true;
	}

	/**
	 * Validate form data structure and limits.
	 *
	 * @param array $form_data The form data to validate.
	 * @return true|WP_Error True if valid, WP_Error if invalid.
	 */
	private function validate_form_structure( $form_data ) {
		// Check if form data is array.
		if ( ! is_array( $form_data ) ) {
			return new WP_Error(
				'invalid_form_data',
				__( 'Form data must be an array.', 'pluximo-form-block' )
			);
		}

		// Check if form data is not empty.
		if ( empty( $form_data ) ) {
			return new WP_Error(
				'empty_form_data',
				__( 'Form data cannot be empty.', 'pluximo-form-block' )
			);
		}

		// Check field count limit to prevent DoS attacks.
		if ( count( $form_data ) > $this->max_fields ) {
			return new WP_Error(
				'too_many_fields',
				sprintf(
					/* translators: %d: maximum number of fields allowed */
					__( 'Too many form fields. Maximum %d fields allowed.', 'pluximo-form-block' ),
					$this->max_fields
				)
			);
		}

		return true;
	}

	/**
	 * Validate all form fields.
	 *
	 * @param array $form_data The form data to validate.
	 * @return array Array of field errors, empty if all fields are valid.
	 */
	private function validate_form_fields( $form_data ) {
		$errors = array();

		foreach ( $form_data as $field_id => $value ) {
			// Validate field ID.
			if ( ! $this->is_valid_field_id( $field_id ) ) {
				$errors[ $field_id ] = __( 'Invalid field identifier.', 'pluximo-form-block' );
				continue;
			}

			// Validate field value.
			$field_error = $this->validate_field( $field_id, $value );
			if ( $field_error ) {
				$errors[ $field_id ] = $field_error;
			}
		}

		return $errors;
	}

	/**
	 * Validate field identifier.
	 *
	 * @param mixed $field_id The field ID to validate.
	 * @return bool True if valid, false otherwise.
	 */
	private function is_valid_field_id( $field_id ) {
		return is_string( $field_id ) &&
				strlen( $field_id ) > 0 &&
				strlen( $field_id ) <= 255 &&
				preg_match( '/^[a-zA-Z0-9_-]+$/', $field_id );
	}

	/**
	 * Validate individual field value.
	 *
	 * @param string $field_id The field identifier.
	 * @param mixed  $value    The field value.
	 * @return string|null Error message if invalid, null if valid.
	 */
	private function validate_field( $field_id, $value ) {
		// Value must be string.
		if ( ! is_string( $value ) ) {
			return __( 'Field value must be text.', 'pluximo-form-block' );
		}

		// Check maximum length to prevent memory attacks.
		if ( strlen( $value ) > $this->max_field_length ) {
			return sprintf(
				/* translators: %d: maximum allowed length */
				__( 'Field value too long. Maximum %d characters allowed.', 'pluximo-form-block' ),
				$this->max_field_length
			);
		}

		// Get field configuration.
		$config = $this->field_config->get_field_config( $field_id );

		// Validate based on field rules.
		return $this->validate_field_rules( $value, $config );
	}

	/**
	 * Validate field value against field rules.
	 *
	 * @param string $value  The field value.
	 * @param array  $config The field configuration.
	 * @return string|null Error message if invalid, null if valid.
	 */
	private function validate_field_rules( $value, $config ) {
		$value = trim( $value );

		// Required field validation.
		if ( ! empty( $config['required'] ) && empty( $value ) ) {
			return __( 'This field is required.', 'pluximo-form-block' );
		}

		// Skip other validations if field is empty and not required.
		if ( empty( $value ) ) {
			return null;
		}

		// Length validation.
		$length_error = $this->validate_field_length( $value, $config );
		if ( $length_error ) {
			return $length_error;
		}

		// Pattern validation.
		$pattern_error = $this->pattern_validator->validate_field_pattern( $value, $config );
		if ( $pattern_error ) {
			return $pattern_error;
		}

		// Type-specific validation.
		return $this->type_validator->validate_field_type( $value, $config );
	}

	/**
	 * Validate field length constraints.
	 *
	 * @param string $value  The field value.
	 * @param array  $config The field configuration.
	 * @return string|null Error message if invalid, null if valid.
	 */
	private function validate_field_length( $value, $config ) {
		$length = strlen( $value );

		if ( isset( $config['minLength'] ) && $length < intval( $config['minLength'] ) ) {
			return sprintf(
				/* translators: %d: minimum length required */
				__( 'Please enter at least %d characters.', 'pluximo-form-block' ),
				intval( $config['minLength'] )
			);
		}

		if ( isset( $config['maxLength'] ) && $length > intval( $config['maxLength'] ) ) {
			return sprintf(
				/* translators: %d: maximum length allowed */
				__( 'Please enter no more than %d characters.', 'pluximo-form-block' ),
				intval( $config['maxLength'] )
			);
		}

		return null;
	}
}
