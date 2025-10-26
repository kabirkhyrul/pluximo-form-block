<?php
/**
 * Field Type Validator for Pluximo Form Blocks.
 *
 * Handles type-specific validation logic.
 *
 * @package PluximoFormBlock
 * @since   1.0.0
 */

// Exit if version constant is not defined.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Pluximo_Form_Block_Field_Type_Validator
 *
 * Handles validation for specific field types like email, URL, telephone, etc.
 */
class Pluximo_Form_Blocks_Field_Type_Validator {

	/**
	 * Validate field based on type.
	 *
	 * @param string $value  The field value.
	 * @param array  $config The field configuration.
	 * @return string|null Error message if invalid, null if valid.
	 */
	public function validate_field_type( $value, $config ) {
		$type = $config['type'] ?? 'text';

		switch ( $type ) {
			case 'email':
				return $this->validate_email_field( $value );

			case 'url':
				return $this->validate_url_field( $value );

			case 'tel':
				return $this->validate_tel_field( $value );

			case 'textarea':
				return $this->validate_textarea_field( $value );

			case 'text':
			default:
				return null; // Text fields have no special validation.
		}
	}

	/**
	 * Validate email field.
	 *
	 * @param string $value The email value.
	 * @return string|null Error message if invalid, null if valid.
	 */
	private function validate_email_field( $value ) {
		if ( ! is_email( $value ) ) {
			return __( 'Please enter a valid email address.', 'pluximo-form-blocks' );
		}

		// Additional email security check.
		if ( strlen( $value ) > 254 ) { // RFC 5321 limit.
			return __( 'Email address is too long.', 'pluximo-form-blocks' );
		}

		return null;
	}

	/**
	 * Validate URL field.
	 *
	 * @param string $value The URL value.
	 * @return string|null Error message if invalid, null if valid.
	 */
	private function validate_url_field( $value ) {
		if ( ! filter_var( $value, FILTER_VALIDATE_URL ) ) {
			return __( 'Please enter a valid URL.', 'pluximo-form-blocks' );
		}

		// Security check for URL length.
		if ( strlen( $value ) > 2048 ) {
			return __( 'URL is too long.', 'pluximo-form-blocks' );
		}

		// Basic protocol check.
		$allowed_protocols = apply_filters( 'pluximo_form_block_allowed_url_protocols', array( 'http', 'https' ) );
		$protocol          = wp_parse_url( $value, PHP_URL_SCHEME );

		if ( $protocol && ! in_array( $protocol, $allowed_protocols, true ) ) {
			return __( 'URL protocol not allowed.', 'pluximo-form-blocks' );
		}

		return null;
	}

	/**
	 * Validate telephone field.
	 *
	 * @param string $value The telephone value.
	 * @return string|null Error message if invalid, null if valid.
	 */
	private function validate_tel_field( $value ) {
		// Remove common formatting characters.
		$clean_number = preg_replace( '/[^\d+]/', '', $value );

		// Basic phone validation.
		if ( ! preg_match( '/^[\+]?[0-9\s\-\(\)]+$/', $value ) ) {
			return __( 'Please enter a valid phone number.', 'pluximo-form-blocks' );
		}

		// Check minimum digits.
		if ( strlen( $clean_number ) < 7 ) {
			return __( 'Phone number is too short.', 'pluximo-form-blocks' );
		}

		// Check maximum length.
		if ( strlen( $value ) > 20 ) {
			return __( 'Phone number is too long.', 'pluximo-form-blocks' );
		}

		return null;
	}

	/**
	 * Validate textarea field.
	 *
	 * @param string $value The textarea value.
	 * @return string|null Error message if invalid, null if valid.
	 */
	private function validate_textarea_field( $value ) {
		// Textarea fields can contain line breaks, but check for excessive content.
		$line_count = substr_count( $value, "\n" ) + 1;
		$max_lines  = apply_filters( 'pluximo_form_block_textarea_max_lines', 100 );

		if ( $line_count > $max_lines ) {
			return sprintf(
				/* translators: %d: maximum number of lines allowed */
				__( 'Too many lines. Maximum %d lines allowed.', 'pluximo-form-blocks' ),
				$max_lines
			);
		}

		return null;
	}
}
