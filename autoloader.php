<?php
/**
 * Autoloader for Pluximo Form Blocks Plugin Classes
 *
 * Automatically loads plugin classes based on naming conventions.
 *
 * @package PluximoFormBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Autoloader function for Pluximo Form Blocks classes.
 *
 * @param string $class_name The name of the class to load.
 */
function pluximo_form_block_autoload( $class_name ) {
	// Only autoload our plugin classes.
	if ( strpos( $class_name, 'Pluximo_Form_Block_' ) !== 0 ) {
		return;
	}

	// Convert class name to file name
	// Pluximo_Form_Block_Post_Type -> class-pluximo-form-blocks-post-type.php.
	$class_file = str_replace( 'Pluximo_Form_Block_', '', $class_name );
	$class_file = str_replace( '_', '-', $class_file );
	$class_file = strtolower( $class_file );
	$file_name  = 'class-pluximo-form-blocks-' . $class_file . '.php';

	// Define possible paths where classes might be located.
	$possible_paths = array(
		PLUXIMO_FORM_BLOCK_PLUGIN_DIR . 'includes/' . $file_name,
		PLUXIMO_FORM_BLOCK_PLUGIN_DIR . 'includes/admin/' . $file_name,
		PLUXIMO_FORM_BLOCK_PLUGIN_DIR . 'includes/frontend/' . $file_name,
		PLUXIMO_FORM_BLOCK_PLUGIN_DIR . 'includes/api/' . $file_name,
	);

	// Try to load the class file from possible paths.
	foreach ( $possible_paths as $file_path ) {
		if ( file_exists( $file_path ) ) {
			require_once $file_path;
			return;
		}
	}
}

/**
 * Register the autoloader.
 */
function pluximo_form_block_register_autoloader() {
	spl_autoload_register( 'pluximo_form_block_autoload' );
}

// Register the autoloader when this file is included.
pluximo_form_block_register_autoloader();
