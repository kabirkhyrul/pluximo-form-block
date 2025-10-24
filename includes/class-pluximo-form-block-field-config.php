<?php
/**
 * Field Configuration for Pluximo Form Blocks.
 *
 * Handles field configuration detection and management.
 *
 * @package PluximoFormBlock
 * @since   1.0.0
 */

// Exit if version constant is not defined.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Pluximo_Form_Block_Field_Config
 *
 * Manages field configuration based on field IDs and patterns.
 */
class Pluximo_Form_Block_Field_Config {

	/**
	 * Get field configuration for validation.
	 *
	 * In a real implementation, this would fetch actual field config from form definition.
	 * For now, we extract basic info from the field ID and apply defaults.
	 *
	 * @param string $field_id The field identifier.
	 * @return array Field configuration array.
	 */
	public function get_field_config( $field_id ) {
		// Default configuration.
		$config = array(
			'type'           => 'text',
			'required'       => false,
			'minLength'      => null,
			'maxLength'      => null,
			'pattern'        => null,
			'invalidMessage' => null,
		);

		// Use a more efficient mapping approach.
		$type_mapping = apply_filters(
			'pluximo_form_block_field_type_mapping',
			array(
				'email'    => array( 'email' ),
				'url'      => array( 'url', 'website', 'link' ),
				'tel'      => array( 'phone', 'tel', 'telephone' ),
				'textarea' => array( 'textarea', 'message', 'comment', 'description' ),
			)
		);

		// Detect type from field ID.
		foreach ( $type_mapping as $type => $keywords ) {
			foreach ( $keywords as $keyword ) {
				if ( strpos( $field_id, $keyword ) !== false ) {
					$config['type'] = $type;
					break 2;
				}
			}
		}

		// Set required fields based on patterns.
		$required_patterns = apply_filters( 'pluximo_form_block_required_field_patterns', array( 'email', 'name' ) );
		foreach ( $required_patterns as $pattern ) {
			if ( strpos( $field_id, $pattern ) !== false ) {
				$config['required'] = true;
				break;
			}
		}

		// Apply filters to allow complete customization.
		return apply_filters( 'pluximo_form_block_field_config', $config, $field_id );
	}
}
