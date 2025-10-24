<?php
/**
 * Uninstall script for Pluximo Form Blocks
 *
 * Cleans up plugin data when plugin is uninstalled.
 *
 * @package PluximoFormBlock
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

require_once plugin_dir_path( __FILE__ ) . 'constants.php';

/**
 * Clean up form entries and plugin data
 */
function pluximo_form_block_cleanup_data() {
	global $wpdb;

	// Delete all form entries (custom post type).
	$posts = get_posts(
		array(
			'post_type'      => PLUXIMO_FORM_BLOCK_POST_TYPE,
			'posts_per_page' => -1,
			'post_status'    => 'any',
		)
	);

	foreach ( $posts as $post ) {
		// wp_delete_post with $force_delete = true will automatically
		// delete associated post meta, but we'll be explicit for clarity.
		wp_delete_post( $post->ID, true );
	}

	// Clean up plugin options (none currently used).
	delete_option( 'pluximo_form_block_version' );

	// Clean up throttling transients (pluximo_form_block_throttle_*).
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
	$wpdb->query(
		$wpdb->prepare(
			"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
			'_transient_pluximo_form_block_throttle_%'
		)
	);

	// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
	$wpdb->query(
		$wpdb->prepare(
			"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
			'_transient_timeout_pluximo_form_block_throttle_%'
		)
	);

	// Clean up IP usage tracking transients (pluximo_form_block_ip_usage_*).
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
	$wpdb->query(
		$wpdb->prepare(
			"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
			'_transient_pluximo_form_block_ip_usage_%'
		)
	);

	// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
	$wpdb->query(
		$wpdb->prepare(
			"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
			'_transient_timeout_pluximo_form_block_ip_usage_%'
		)
	);
}

// Run cleanup.
pluximo_form_block_cleanup_data();
