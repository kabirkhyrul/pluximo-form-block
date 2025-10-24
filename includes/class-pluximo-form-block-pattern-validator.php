<?php
/**
 * Pattern Validator for Pluximo Form Blocks.
 *
 * Handles regex pattern validation with security measures.
 *
 * @package PluximoFormBlock
 * @since   1.0.0
 */

// Exit if version constant is not defined.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Pluximo_Form_Block_Pattern_Validator
 *
 * Handles regex pattern validation with security safeguards.
 */
class Pluximo_Form_Block_Pattern_Validator {

	/**
	 * Validate field pattern constraints.
	 *
	 * @param string $value  The field value.
	 * @param array  $config The field configuration.
	 * @return string|null Error message if invalid, null if valid.
	 */
	public function validate_field_pattern( $value, $config ) {
		if ( empty( $config['pattern'] ) ) {
			return null;
		}

		$pattern = $this->sanitize_regex_pattern( $config['pattern'] );
		if ( ! $pattern ) {
			return __( 'Invalid validation pattern.', 'pluximo-form-block' );
		}

		// Validate against pattern with error handling.
		if ( ! $this->is_pattern_match( $value, $pattern ) ) {
			return $config['invalidMessage'] ?? __( 'Please enter a valid value.', 'pluximo-form-block' );
		}

		return null;
	}

	/**
	 * Sanitize regex pattern for security
	 *
	 * @param string $pattern The regex pattern to sanitize.
	 * @return string|false Sanitized pattern or false if invalid.
	 */
	private function sanitize_regex_pattern( $pattern ) {
		// Ensure pattern is safe and validate.
		if ( strlen( $pattern ) > 200 ) {
			return false;
		}

		// Check for potentially dangerous regex patterns.
		$dangerous_patterns = array( '(?:', '(?=', '(?!', '(?<=', '(?<!', '\\x', '\\u', '\\p' );
		foreach ( $dangerous_patterns as $dangerous ) {
			if ( strpos( $pattern, $dangerous ) !== false ) {
				return false;
			}
		}

		// Escape special characters that could cause issues.
		$pattern = str_replace( array( '/\\/', '~' ), array( '\\/', '\\~' ), $pattern );

		return $pattern;
	}

	/**
	 * Check if value matches pattern safely
	 *
	 * @param string $value   The value to check.
	 * @param string $pattern The regex pattern.
	 * @return bool True if matches, false otherwise.
	 */
	private function is_pattern_match( $value, $pattern ) {
		// Use a different delimiter to avoid issues with forward slashes.
		$result = preg_match( '~' . $pattern . '~u', $value );

		// Check for regex errors.
		if ( false === $result ) {
			return false;
		}

		return 1 === $result;
	}
}
