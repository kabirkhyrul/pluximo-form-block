<?php
/**
 * Plugin Name:       Pluximo Form Blocks
 * Description:       A dynamic form builder block for the WordPress block editor with advanced field types and validation capabilities. Create beautiful, functional forms using the Gutenberg block editor.
 * Version:           1.0.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Pluximo
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       pluximo-form-block
 *
 * @package PluximoFormBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
require_once plugin_dir_path( __FILE__ ) . 'constants.php';
require_once PLUXIMO_FORM_BLOCK_PLUGIN_DIR . 'autoloader.php';

// Initialize plugin.
add_action( 'plugins_loaded', 'pluximo_form_block_init_plugin' );


// Plugin activation and deactivation hooks.
register_activation_hook( __FILE__, 'pluximo_form_block_activate' );
register_deactivation_hook( __FILE__, 'pluximo_form_block_deactivate' );

/**
 * Initialize the plugin.
 */
function pluximo_form_block_init_plugin() {
	// Check WordPress version compatibility.
	if ( version_compare( get_bloginfo( 'version' ), '6.7', '<' ) ) {
		add_action( 'admin_notices', 'pluximo_form_block_version_notice' );
		return;
	}

	// Initialize post type and handlers.
	if ( class_exists( 'Pluximo_Form_Block_Post_Type' ) ) {
		new Pluximo_Form_Block_Post_Type();
	}
	if ( class_exists( 'Pluximo_Form_Block_Handler' ) ) {
		new Pluximo_Form_Block_Handler();
	}
}

/**
 * Display admin notice for WordPress version compatibility.
 */
function pluximo_form_block_version_notice() {
	$class   = 'notice notice-error';
	$message = sprintf(
		/* translators: %s: minimum required WordPress version */
		__( 'Pluximo Form Blocks requires WordPress %s or higher.', 'pluximo-form-block' ),
		'6.7'
	);
	printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $message ) );
}


/**
 * Plugin activation callback.
 */
function pluximo_form_block_activate() {
	// Ensure classes are loaded and post type is registered.
	if ( class_exists( 'Pluximo_Form_Block_Post_Type' ) ) {
		Pluximo_Form_Block_Post_Type::register();
	}
	flush_rewrite_rules();
}

/**
 * Plugin deactivation callback.
 */
function pluximo_form_block_deactivate() {
	flush_rewrite_rules();
}

/**
 * Registers the block using a `blocks-manifest.php` file, which improves the performance of block type registration.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function pluximo_form_block_init() {
	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
	 * based on the registered block metadata.
	 * Added in WordPress 6.8 to simplify the block metadata registration process added in WordPress 6.7.
	 *
	 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
	 */
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( PLUXIMO_FORM_BLOCK_BUILD_DIR, PLUXIMO_FORM_BLOCK_BLOCKS_MANIFEST );
		return;
	}

	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` file.
	 * Added to WordPress 6.7 to improve the performance of block type registration.
	 *
	 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
	 */
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( PLUXIMO_FORM_BLOCK_BUILD_DIR, PLUXIMO_FORM_BLOCK_BLOCKS_MANIFEST );
	}
	/**
	 * Registers the block type(s) in the `blocks-manifest.php` file.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	if ( ! file_exists( PLUXIMO_FORM_BLOCK_BLOCKS_MANIFEST ) ) {
		return;
	}

	$manifest_data = require PLUXIMO_FORM_BLOCK_BLOCKS_MANIFEST;
	if ( ! is_array( $manifest_data ) || empty( $manifest_data ) ) {
		return;
	}

	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( PLUXIMO_FORM_BLOCK_BUILD_DIR . "/{$block_type}" );
	}
}
add_action( 'init', 'pluximo_form_block_init' );
