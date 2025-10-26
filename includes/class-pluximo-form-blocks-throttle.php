<?php
/**
 * Form Submission Throttling for Pluximo Form Blocks
 *
 * Handles rate limiting of form submissions per IP address.
 *
 * @package PluximoFormBlock
 */

// Exit if version constant is not defined.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Pluximo_Form_Block_Throttle
 *
 * Provides IP-based rate limiting for form submissions.
 */
class Pluximo_Form_Blocks_Throttle {

	/**
	 * Transient key prefix for throttling data.
	 */
	const TRANSIENT_PREFIX = 'pluximo_form_block_throttle_';

	/**
	 * Check if IP address has exceeded the submission limit.
	 *
	 * @param string $ip_address The IP address to check.
	 * @return bool True if throttled (exceeded limit), false if allowed.
	 */
	public function is_throttled( $ip_address ) {
		// Allow disabling throttling entirely via filter.
		if ( ! apply_filters( 'pluximo_form_block_enable_throttling', PLUXIMO_FORM_BLOCK_ENABLE_SMART_THROTTLING ) ) {
			return false;
		}

		// Skip throttling for private/local IPs to avoid false positives in development.
		if ( $this->is_private_ip( $ip_address ) ) {
			return false;
		}

		// Allow whitelisting specific IPs via filter.
		$whitelisted_ips = apply_filters( 'pluximo_form_block_throttle_whitelist', array() );
		if ( in_array( $ip_address, $whitelisted_ips, true ) ) {
			return false;
		}

		$max_submissions = $this->get_max_submissions_per_hour();

		// Get current submission count for this IP.
		$current_count = $this->get_submission_count( $ip_address );

		// For shared IPs (detected heuristically), use more lenient limits.
		$adjusted_limit = $this->get_adjusted_limit_for_ip( $ip_address, $max_submissions );

		return $current_count >= $adjusted_limit;
	}

	/**
	 * Record a submission for an IP address.
	 *
	 * @param string $ip_address The IP address to record.
	 * @return bool True on success, false on failure.
	 */
	public function record_submission( $ip_address ) {
		$transient_key = $this->get_transient_key( $ip_address );
		$time_window   = $this->get_time_window();

		// Get current submissions array.
		$submissions = get_transient( $transient_key );
		if ( false === $submissions || ! is_array( $submissions ) ) {
			$submissions = array();
		}

		// Add current timestamp.
		$submissions[] = time();

		// Clean old submissions outside the time window.
		$submissions = $this->clean_old_submissions( $submissions );

		// Store updated submissions with expiration.
		return set_transient( $transient_key, $submissions, $time_window );
	}

	/**
	 * Get current submission count for an IP address.
	 *
	 * @param string $ip_address The IP address to check.
	 * @return int Number of submissions within the time window.
	 */
	public function get_submission_count( $ip_address ) {
		$transient_key = $this->get_transient_key( $ip_address );
		$submissions   = get_transient( $transient_key );

		if ( false === $submissions || ! is_array( $submissions ) ) {
			return 0;
		}

		// Clean and count submissions within time window.
		$submissions = $this->clean_old_submissions( $submissions );

		// Update transient with cleaned data.
		set_transient( $transient_key, $submissions, $this->get_time_window() );

		return count( $submissions );
	}

	/**
	 * Get remaining submissions allowed for an IP address.
	 *
	 * @param string $ip_address The IP address to check.
	 * @return int Number of submissions remaining.
	 */
	public function get_remaining_submissions( $ip_address ) {
		$max_submissions = $this->get_max_submissions_per_hour();
		$current_count   = $this->get_submission_count( $ip_address );

		return max( 0, $max_submissions - $current_count );
	}

	/**
	 * Get time until next submission is allowed.
	 *
	 * @param string $ip_address The IP address to check.
	 * @return int Time in seconds until next submission allowed, 0 if allowed now.
	 */
	public function get_time_until_next_allowed( $ip_address ) {
		if ( ! $this->is_throttled( $ip_address ) ) {
			return 0;
		}

		$transient_key = $this->get_transient_key( $ip_address );
		$submissions   = get_transient( $transient_key );

		if ( false === $submissions || ! is_array( $submissions ) ) {
			return 0;
		}

		// Find the oldest submission that's still within the time window.
		$time_window  = $this->get_time_window();
		$current_time = time();
		$oldest_valid = $current_time - $time_window;

		// Get submissions within time window.
		$valid_submissions = array_filter(
			$submissions,
			function ( $timestamp ) use ( $oldest_valid ) {
				return $timestamp > $oldest_valid;
			}
		);

		if ( empty( $valid_submissions ) ) {
			return 0;
		}

		// Sort to get the oldest submission.
		sort( $valid_submissions );
		$oldest_submission = $valid_submissions[0];

		// Calculate when this oldest submission will expire.
		$expires_at = $oldest_submission + $time_window;

		return max( 0, $expires_at - $current_time );
	}

	/**
	 * Clear all throttling data for an IP address.
	 *
	 * @param string $ip_address The IP address to clear.
	 * @return bool True on success, false on failure.
	 */
	public function clear_throttle_data( $ip_address ) {
		$transient_key = $this->get_transient_key( $ip_address );
		return delete_transient( $transient_key );
	}

	/**
	 * Get the maximum number of submissions allowed per hour.
	 *
	 * @return int Maximum submissions per hour.
	 */
	private function get_max_submissions_per_hour() {
		return apply_filters( 'pluximo_form_block_max_submissions_per_hour', PLUXIMO_FORM_BLOCK_MAX_SUBMISSIONS_PER_HOUR );
	}

	/**
	 * Get the time window in seconds (default: 1 hour).
	 *
	 * @return int Time window in seconds.
	 */
	private function get_time_window() {
		return apply_filters( 'pluximo_form_block_throttle_time_window', PLUXIMO_FORM_BLOCK_THROTTLE_TIME_WINDOW );
	}

	/**
	 * Generate transient key for IP address.
	 *
	 * @param string $ip_address The IP address.
	 * @return string Transient key.
	 */
	private function get_transient_key( $ip_address ) {
		// Hash IP for privacy and to ensure valid transient key.
		$ip_hash = hash( 'sha256', $ip_address . wp_salt() );
		return self::TRANSIENT_PREFIX . substr( $ip_hash, 0, 32 );
	}

	/**
	 * Remove submissions older than the time window.
	 *
	 * @param array $submissions Array of timestamps.
	 * @return array Cleaned array of timestamps.
	 */
	private function clean_old_submissions( $submissions ) {
		$time_window  = $this->get_time_window();
		$current_time = time();
		$cutoff_time  = $current_time - $time_window;

		return array_filter(
			$submissions,
			function ( $timestamp ) use ( $cutoff_time ) {
				return $timestamp > $cutoff_time;
			}
		);
	}

	/**
	 * Check if an IP address is private/local.
	 *
	 * @param string $ip_address The IP address to check.
	 * @return bool True if private/local IP.
	 */
	private function is_private_ip( $ip_address ) {
		// Check for private/reserved ranges to avoid false positives in development.
		return ! filter_var(
			$ip_address,
			FILTER_VALIDATE_IP,
			FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
		);
	}

	/**
	 * Get adjusted submission limit based on IP characteristics.
	 *
	 * @param string $ip_address The IP address to check.
	 * @param int    $base_limit The base submission limit.
	 * @return int Adjusted limit.
	 */
	private function get_adjusted_limit_for_ip( $ip_address, $base_limit ) {
		// Detect potential shared IPs and increase limits to reduce false positives.
		$multiplier = 1;

		// Check if this IP has unusually high legitimate traffic patterns.
		if ( $this->is_likely_shared_ip( $ip_address ) ) {
			$multiplier = apply_filters( 'pluximo_form_block_shared_ip_multiplier', 3 );
		}

		// Apply filters for custom logic.
		$adjusted_limit = apply_filters(
			'pluximo_form_block_adjusted_throttle_limit',
			$base_limit * $multiplier,
			$ip_address,
			$base_limit
		);

		return max( $base_limit, $adjusted_limit );
	}

	/**
	 * Heuristic detection of likely shared IPs.
	 *
	 * @param string $ip_address The IP address to check.
	 * @return bool True if likely a shared IP.
	 */
	private function is_likely_shared_ip( $ip_address ) {
		// Store IP usage patterns to detect shared IPs.
		$usage_key  = 'pluximo_form_block_ip_usage_' . hash( 'sha256', $ip_address . wp_salt() );
		$usage_data = get_transient( $usage_key );

		if ( false === $usage_data ) {
			$usage_data = array(
				'unique_forms' => array(),
				'user_agents'  => array(),
				'first_seen'   => time(),
			);
		}

		// Get current request info for pattern detection.
		$current_form = $this->get_current_form_context();
		$user_agent   = $this->get_user_agent_fingerprint();

		// Track unique forms and user agents from this IP.
		if ( ! in_array( $current_form, $usage_data['unique_forms'], true ) ) {
			$usage_data['unique_forms'][] = $current_form;
		}

		if ( ! in_array( $user_agent, $usage_data['user_agents'], true ) ) {
			$usage_data['user_agents'][] = $user_agent;
		}

		// Update usage data.
		set_transient( $usage_key, $usage_data, DAY_IN_SECONDS );

		// Heuristics for shared IP detection:
		// 1. Multiple different user agents from same IP.
		// 2. Multiple different forms being submitted.
		// 3. Sustained activity over time.
		$unique_agents = count( $usage_data['user_agents'] );
		$unique_forms  = count( $usage_data['unique_forms'] );
		$age_hours     = ( time() - $usage_data['first_seen'] ) / HOUR_IN_SECONDS;

		// If we see 3+ different user agents or 2+ forms over 2+ hours, likely shared.
		return ( $unique_agents >= 3 ) || ( $unique_forms >= 2 && $age_hours >= 2 );
	}

	/**
	 * Get current form context for tracking.
	 *
	 * @return string Form identifier or page context.
	 */
	private function get_current_form_context() {
		// Try to get form ID from current request.
		if ( isset( $_SERVER['HTTP_REFERER'] ) ) {
			$referer = esc_url_raw( wp_unslash( $_SERVER['HTTP_REFERER'] ) );
			$path    = wp_parse_url( $referer, PHP_URL_PATH );
			return $path ? sanitize_text_field( $path ) : 'unknown';
		}

		return 'unknown';
	}

	/**
	 * Get simplified user agent fingerprint.
	 *
	 * @return string Simplified user agent identifier.
	 */
	private function get_user_agent_fingerprint() {
		if ( ! isset( $_SERVER['HTTP_USER_AGENT'] ) ) {
			return 'unknown';
		}

		$user_agent = sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) );

		// Extract just browser and major version to avoid too much granularity.
		if ( preg_match( '/^Mozilla.*?(Chrome|Firefox|Safari|Edge)\/(\d+)/', $user_agent, $matches ) ) {
			return $matches[1] . '/' . $matches[2];
		}

		// Fallback to first 50 chars.
		return substr( $user_agent, 0, 50 );
	}
}
