<?php
/**
 * Form Handler for Pluximo Form Blocks
 *
 * Handles form submission endpoints and processing.
 *
 * @package PluximoFormBlock
 */

// Exit if version constant is not defined.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}



/**
 * Class Pluximo_Form_Block_Handler
 *
 * Handles form submission endpoints and processing for the Pluximo Form Blocks.
 */
class Pluximo_Form_Blocks_Handler {

	/**
	 * Form validator instance.
	 *
	 * @var Pluximo_Form_Blocks_Validator
	 */
	private $validator;

	/**
	 * Form throttle instance.
	 *
	 * @var Pluximo_Form_Blocks_Throttle
	 */
	private $throttle;

	/**
	 * Constructor. Hooks into REST API init and enqueue scripts actions.
	 */
	public function __construct() {
		$this->validator = new Pluximo_Form_Blocks_Validator();
		$this->throttle  = new Pluximo_Form_Blocks_Throttle();
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_form_scripts' ) );
	}

	/**
	 * Register REST API routes for form submission
	 */
	public function register_routes() {
		register_rest_route(
			PLUXIMO_FORM_BLOCK_REST_NAMESPACE,
			'/submit',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'handle_form_submission' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
				'args'                => array(
					'form_data'       => array(
						'required'    => true,
						'type'        => 'object',
						'description' => 'Form field data',
					),
					'form_id'         => array(
						'required'    => false,
						'type'        => 'string',
						'description' => 'Form identifier',
					),
					'success_message' => array(
						'required'    => false,
						'type'        => 'string',
						'description' => 'Custom success message',
					),
					'error_message'   => array(
						'required'    => false,
						'type'        => 'string',
						'description' => 'Custom error message',
					),
				),
			)
		);
	}

	/**
	 * Handle form submission.
	 *
	 * @param WP_REST_Request $request The REST request object.
	 * @return WP_REST_Response The response object.
	 */
	public function handle_form_submission( WP_REST_Request $request ) {
		$form_data       = $request->get_param( 'form_data' );
		$form_id         = $request->get_param( 'form_id' );
		$success_message = $request->get_param( 'success_message' );
		$error_message   = $request->get_param( 'error_message' );

		// Check throttling first.
		$client_ip = $this->get_client_ip();
		if ( $this->throttle->is_throttled( $client_ip ) ) {
			$remaining_time = $this->throttle->get_time_until_next_allowed( $client_ip );
			$minutes        = ceil( $remaining_time / 60 );

			return new WP_REST_Response(
				array(
					'success'        => false,
					'message'        => sprintf(
						/* translators: %d: number of minutes until next submission allowed */
						__( 'Too many submissions. Please wait %d minutes before submitting again.', 'pluximo-form-blocks' ),
						$minutes
					),
					'throttled'      => true,
					'retry_after'    => $remaining_time,
					'remaining_time' => $minutes,
				),
				429
			);
		}

		// Server-side validation - NEVER trust client-side validation alone.
		$validation_result = $this->validator->validate_form_submission( $form_data );

		if ( is_wp_error( $validation_result ) ) {
			return new WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'Please correct the errors below.', 'pluximo-form-blocks' ),
					'errors'  => $validation_result->get_error_data(),
				),
				400
			);
		}

		// Sanitize form data after validation passes.
		$sanitized_data = $this->sanitize_form_data( $form_data );

		// Process the form submission.
		$result = $this->process_form_submission( $sanitized_data, $form_id );

		if ( $result['success'] ) {
			// Record successful submission for throttling.
			$this->throttle->record_submission( $client_ip );

			return new WP_REST_Response(
				array(
					'success' => true,
					'message' => $success_message ?? __( 'Form submitted successfully.', 'pluximo-form-blocks' ),
					'data'    => $result['data'],
				),
				200
			);
		} else {
			return new WP_REST_Response(
				array(
					'success' => false,
					'message' => $error_message ?? __( 'Form submission failed. Please try again.', 'pluximo-form-blocks' ),
					'error'   => $result['error'],
				),
				500
			);
		}
	}

	/**
	 * Verify nonce for security
	 *
	 * @param WP_REST_Request $request The REST request object.
	 *
	 * @return bool True if nonce is valid, false otherwise.
	 */
	public function verify_nonce( $request ) {
		$nonce = $request->get_header( 'X-WP-Nonce' );
		return wp_verify_nonce( $nonce, 'wp_rest' );
	}

	/**
	 * Sanitize form data
	 *
	 * @param array $form_data The form data to sanitize.
	 *
	 * @return array The sanitized form data.
	 */
	private function sanitize_form_data( $form_data ) {
		$sanitized = array();

		foreach ( $form_data as $field_id => $value ) {
			$field_id = sanitize_key( $field_id );

			// Determine sanitization method based on field type or content.
			$sanitized[ $field_id ] = $this->sanitize_field_value( $value, $field_id );
		}

		return $sanitized;
	}

	/**
	 * Sanitize individual field value based on its type
	 *
	 * @param string $value    The field value.
	 * @param string $field_id The field identifier.
	 * @return string Sanitized value.
	 */
	private function sanitize_field_value( $value, $field_id ) {
		// Handle textarea fields differently.
		if ( strpos( $field_id, 'textarea' ) !== false || strpos( $field_id, 'message' ) !== false ) {
			return sanitize_textarea_field( $value );
		}

		// Email fields.
		if ( strpos( $field_id, 'email' ) !== false && is_email( $value ) ) {
			return sanitize_email( $value );
		}

		// URL fields.
		if ( ( strpos( $field_id, 'url' ) !== false || strpos( $field_id, 'website' ) !== false ) && filter_var( $value, FILTER_VALIDATE_URL ) ) {
			return esc_url_raw( $value );
		}

		// Default text sanitization.
		return sanitize_text_field( $value );
	}


	/**
	 * Process the form submission
	 *
	 * @param array  $form_data The sanitized form data.
	 * @param string $form_id   The form identifier.
	 *
	 * @return array Success/error array.
	 */
	private function process_form_submission( $form_data, $form_id ) {
		try {
			// Hook for pre-processing.
			do_action( 'pluximo_form_block_before_submission', $form_data, $form_id );

			// Save to database (optional).
			$submission_id = $this->save_submission( $form_data, $form_id );

			// Send email notification (optional).
			$email_result = $this->send_notification_email( $form_data, $form_id );

			// Hook for custom processing.
			do_action( 'pluximo_form_block_after_submission', $form_data, $form_id, $submission_id );

			return array(
				'success' => true,
				'data'    => array(
					'submission_id' => $submission_id,
					'form_id'       => $form_id,
					'email_sent'    => $email_result,
				),
			);
		} catch ( Exception $e ) {
			$this->log_error( 'Form submission processing failed', $e, array( 'form_id' => $form_id ) );

			return array(
				'success' => false,
				'error'   => __( 'An error occurred while processing your submission.', 'pluximo-form-blocks' ),
			);
		}
	}

	/**
	 * Save form submission as custom post
	 *
	 * @param array  $form_data The sanitized form data.
	 * @param string $form_id   The form identifier.
	 *
	 * @return int The post ID.
	 *
	 * @throws Exception If saving fails.
	 */
	private function save_submission( $form_data, $form_id ) {
		// Create a title from the form data.
		$title_parts = array();
		foreach ( $form_data as $field => $value ) {
			if ( in_array( $field, array( 'name', 'email', 'subject' ), true ) ) {
				$title_parts[] = $value;
			}
		}
		$title = ! empty( $title_parts ) ? implode( ' - ', $title_parts ) : 'Form Submission';

		// Create the post.
		$post_data = array(
			'post_title'   => sanitize_text_field( $title ),
			'post_type'    => 'form_entry',
			'post_status'  => 'publish',
			'post_content' => '', // We'll store data in meta.
		);

		$post_id = wp_insert_post( $post_data );

		if ( is_wp_error( $post_id ) || ! $post_id ) {
			throw new Exception( 'Failed to save form submission' );
		}

		// Save form data as post meta.
		update_post_meta( $post_id, '_form_id', sanitize_text_field( $form_id ) );
		update_post_meta( $post_id, '_form_data', $form_data );
		update_post_meta( $post_id, '_ip_address', $this->get_client_ip() );
		$user_agent = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';
		$referer    = isset( $_SERVER['HTTP_REFERER'] ) ? esc_url_raw( wp_unslash( $_SERVER['HTTP_REFERER'] ) ) : '';

		update_post_meta( $post_id, '_user_agent', $user_agent );
		update_post_meta( $post_id, '_referer', $referer );

		return $post_id;
	}

	/**
	 * Send notification email
	 *
	 * @param array  $form_data The sanitized form data.
	 * @param string $form_id   The form identifier.
	 * @return bool True if email sent successfully, false otherwise.
	 */
	private function send_notification_email( $form_data, $form_id ) {
		// Allow disabling email notifications.
		if ( ! apply_filters( 'pluximo_form_block_send_email_notifications', true, $form_data, $form_id ) ) {
			return true;
		}

		$admin_email = get_option( 'admin_email' );
		$site_name   = get_bloginfo( 'name' );

		$subject = apply_filters(
			'pluximo_form_block_email_subject',
			sprintf( '[%s] New Form Submission', wp_strip_all_tags( $site_name ) ),
			$form_data,
			$form_id
		);

		$message = $this->build_email_message( $form_data, $form_id );
		$message = apply_filters( 'pluximo_form_block_email_message', $message, $form_data, $form_id );

		$headers = apply_filters(
			'pluximo_form_block_email_headers',
			array( 'Content-Type: text/plain; charset=UTF-8' ),
			$form_data,
			$form_id
		);

		$to = apply_filters( 'pluximo_form_block_email_recipients', $admin_email, $form_data, $form_id );

		$mail_sent = wp_mail( $to, $subject, $message, $headers );
		if ( ! $mail_sent ) {
			$this->log_error(
				'Failed to send notification email',
				new Exception( 'wp_mail returned false' ),
				array(
					'recipients' => $to,
					'form_id'    => $form_id,
				)
			);
		}

		return $mail_sent;
	}

	/**
	 * Build email message content
	 *
	 * @param array  $form_data The sanitized form data.
	 * @param string $form_id   The form identifier.
	 * @return string The email message.
	 */
	private function build_email_message( $form_data, $form_id ) {
		$message_parts   = array();
		$message_parts[] = "New form submission received:\n";

		foreach ( $form_data as $field => $value ) {
			// Format field name nicely.
			$formatted_field = ucwords( str_replace( array( '_', '-' ), ' ', $field ) );
			$safe_field      = wp_strip_all_tags( $formatted_field );
			$safe_value      = wp_strip_all_tags( $value );
			$message_parts[] = sprintf( '%s: %s', $safe_field, $safe_value );
		}

		$message_parts[] = '';
		$message_parts[] = 'Form ID: ' . wp_strip_all_tags( $form_id );
		$message_parts[] = 'Submitted at: ' . current_time( 'mysql' );
		$message_parts[] = 'IP Address: ' . $this->get_client_ip();

		return implode( "\n", $message_parts );
	}

	/**
	 * Get client IP address with improved security
	 *
	 * @return string The client IP address.
	 */
	private function get_client_ip() {
		// Primary: Always start with REMOTE_ADDR (most secure).
		$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '0.0.0.0';

		// Get trusted proxies from filter - only check forwarded headers if IP is trusted.
		$trusted_proxies = apply_filters( 'pluximo_form_block_trusted_proxies', array() );

		if ( ! empty( $trusted_proxies ) && in_array( $ip, $trusted_proxies, true ) ) {
			// Check forwarded headers in order of preference.
			$forwarded_headers = array(
				'HTTP_CF_CONNECTING_IP',     // CloudFlare.
				'HTTP_X_FORWARDED_FOR',      // Standard proxy header.
				'HTTP_X_REAL_IP',            // Nginx proxy.
				'HTTP_CLIENT_IP',            // Other proxy servers.
			);

			foreach ( $forwarded_headers as $header ) {
				if ( ! empty( $_SERVER[ $header ] ) ) {
					$forwarded_ip = sanitize_text_field( wp_unslash( $_SERVER[ $header ] ) );
					// Handle comma-separated IPs (take first one).
					$forwarded_ip = explode( ',', $forwarded_ip )[0];
					$forwarded_ip = trim( $forwarded_ip );

					// Validate forwarded IP and ensure it's not private/reserved.
					if ( filter_var( $forwarded_ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE ) ) {
						$ip = $forwarded_ip;
						break;
					}
				}
			}
		}

		// Handle IPv6 loopback.
		if ( '::1' === $ip ) {
			$ip = '127.0.0.1';
		}

		// Final validation - if invalid, fallback to 0.0.0.0.
		if ( ! filter_var( $ip, FILTER_VALIDATE_IP ) ) {
			$ip = '0.0.0.0';
		}

		// Apply filter for custom IP detection if needed.
		return apply_filters( 'pluximo_form_block_client_ip', $ip );
	}

	/**
	 * Log errors with context
	 *
	 * @param string    $message The error message.
	 * @param Exception $e       The exception object.
	 * @param array     $context Additional context data.
	 */
	private function log_error( $message, $e, $context = array() ) {
		$log_message = sprintf(
			'Form Builder Error: %s | Exception: %s | File: %s:%d',
			$message,
			$e->getMessage(),
			$e->getFile(),
			$e->getLine()
		);

		if ( ! empty( $context ) ) {
			$log_message .= ' | Context: ' . wp_json_encode( $context );
		}

		error_log( $log_message ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
	}

	/**
	 * Enqueue form scripts
	 */
	public function enqueue_form_scripts() {
		if ( has_block( 'pluximo-form-blocks/wrapper' ) ) {
			wp_localize_script(
				'pluximo-form-blocks-wrapper-view-script',
				'pluximoFormsAjax',
				array(
					'apiUrl'   => rest_url( PLUXIMO_FORM_BLOCK_REST_NAMESPACE . '/submit' ),
					'nonce'    => wp_create_nonce( 'wp_rest' ),
					'messages' => array(
						'required'  => __( 'This field is required.', 'pluximo-form-blocks' ),
						/* translators: %d: minimum number of characters required */
						'minLength' => __( 'Please enter at least %d characters.', 'pluximo-form-blocks' ),
						/* translators: %d: maximum number of characters allowed */
						'maxLength' => __( 'Please enter no more than %d characters.', 'pluximo-form-blocks' ),
						'pattern'   => __( 'Please enter a valid value.', 'pluximo-form-blocks' ),
						'email'     => __( 'Please enter a valid email address (e.g., user@example.com).', 'pluximo-form-blocks' ),
						'url'       => __( 'Please enter a valid URL (e.g., https://example.com).', 'pluximo-form-blocks' ),
						'tel'       => __( 'Please enter a valid phone number (e.g., +1-234-567-8900).', 'pluximo-form-blocks' ),
						'default'   => __( 'Please enter a valid value.', 'pluximo-form-blocks' ),
					),
				)
			);
		}
	}
}
