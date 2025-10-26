<?php
/**
 * Plugin Constants
 *
 * Defines essential constants used throughout the Pluximo Form Blocks plugin.
 *
 * @package PluximoFormBlock
 */

// Exit if version constant is not defined.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Plugin Information.
if ( ! defined( 'PLUXIMO_FORM_BLOCK_VERSION' ) ) {
	define( 'PLUXIMO_FORM_BLOCK_VERSION', '1.0.0' );
}

if ( ! defined( 'PLUXIMO_FORM_BLOCK_PLUGIN_DIR' ) ) {
	define( 'PLUXIMO_FORM_BLOCK_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
}

if ( ! defined( 'PLUXIMO_FORM_BLOCK_PLUGIN_URL' ) ) {
	define( 'PLUXIMO_FORM_BLOCK_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}

if ( ! defined( 'PLUXIMO_FORM_BLOCK_BUILD_DIR' ) ) {
	define( 'PLUXIMO_FORM_BLOCK_BUILD_DIR', __DIR__ . '/build' );
}

if ( ! defined( 'PLUXIMO_FORM_BLOCK_BLOCKS_MANIFEST' ) ) {
	define( 'PLUXIMO_FORM_BLOCK_BLOCKS_MANIFEST', PLUXIMO_FORM_BLOCK_BUILD_DIR . '/blocks-manifest.php' );
}

// REST API.
if ( ! defined( 'PLUXIMO_FORM_BLOCK_REST_NAMESPACE' ) ) {
	define( 'PLUXIMO_FORM_BLOCK_REST_NAMESPACE', 'pluximo-form-blocks/v1' );
}

// Database.
if ( ! defined( 'PLUXIMO_FORM_BLOCK_POST_TYPE' ) ) {
	define( 'PLUXIMO_FORM_BLOCK_POST_TYPE', 'form_entry' );
}

// Security.
if ( ! defined( 'PLUXIMO_FORM_BLOCK_NONCE_ACTION' ) ) {
	define( 'PLUXIMO_FORM_BLOCK_NONCE_ACTION', 'pluximo_form_block_submit' );
}

if ( ! defined( 'PLUXIMO_FORM_BLOCK_NONCE_NAME' ) ) {
	define( 'PLUXIMO_FORM_BLOCK_NONCE_NAME', 'pluximo_form_block_nonce' );
}

// Throttling.
if ( ! defined( 'PLUXIMO_FORM_BLOCK_MAX_SUBMISSIONS_PER_HOUR' ) ) {
	define( 'PLUXIMO_FORM_BLOCK_MAX_SUBMISSIONS_PER_HOUR', 10 );
}

if ( ! defined( 'PLUXIMO_FORM_BLOCK_THROTTLE_TIME_WINDOW' ) ) {
	define( 'PLUXIMO_FORM_BLOCK_THROTTLE_TIME_WINDOW', HOUR_IN_SECONDS );
}

// Enhanced throttling to prevent false positives.
if ( ! defined( 'PLUXIMO_FORM_BLOCK_SHARED_IP_MULTIPLIER' ) ) {
	define( 'PLUXIMO_FORM_BLOCK_SHARED_IP_MULTIPLIER', 3 );
}

if ( ! defined( 'PLUXIMO_FORM_BLOCK_ENABLE_SMART_THROTTLING' ) ) {
	define( 'PLUXIMO_FORM_BLOCK_ENABLE_SMART_THROTTLING', true );
}
