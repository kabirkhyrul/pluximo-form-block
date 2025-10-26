<?php
/**
 * Custom Post Type for Form Entries.
 *
 * @package PluximoFormBlock
 */

// Exit if version constant is not defined.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Pluximo_Form_Block_Post_Type
 *
 * Handles the custom post type registration for form entries.
 */
class Pluximo_Form_Blocks_Post_Type {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_post_type' ) );
		add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
		add_action( 'manage_' . PLUXIMO_FORM_BLOCK_POST_TYPE . '_posts_columns', array( $this, 'add_columns' ) );
		add_action( 'manage_' . PLUXIMO_FORM_BLOCK_POST_TYPE . '_posts_custom_column', array( $this, 'populate_columns' ), 10, 2 );
		add_filter( 'manage_edit-' . PLUXIMO_FORM_BLOCK_POST_TYPE . '_sortable_columns', array( $this, 'sortable_columns' ) );
	}

	/**
	 * Static method to register post type (for activation hook)
	 */
	public static function register() {
		$instance = new self();
		$instance->register_post_type();
	}

	/**
	 * Register form entry post type
	 */
	public function register_post_type() {
		$args = array(
			'label'              => __( 'Form Entries', 'pluximo-form-blocks' ),
			'labels'             => array(
				'name'                  => __( 'Form Entries', 'pluximo-form-blocks' ),
				'singular_name'         => __( 'Form Entry', 'pluximo-form-blocks' ),
				'add_new'               => __( 'Add New Entry', 'pluximo-form-blocks' ),
				'add_new_item'          => __( 'Add New Form Entry', 'pluximo-form-blocks' ),
				'edit_item'             => __( 'Edit Form Entry', 'pluximo-form-blocks' ),
				'new_item'              => __( 'New Form Entry', 'pluximo-form-blocks' ),
				'view_item'             => __( 'View Form Entry', 'pluximo-form-blocks' ),
				'view_items'            => __( 'View Form Entries', 'pluximo-form-blocks' ),
				'search_items'          => __( 'Search Form Entries', 'pluximo-form-blocks' ),
				'not_found'             => __( 'No form entries found', 'pluximo-form-blocks' ),
				'not_found_in_trash'    => __( 'No form entries found in trash', 'pluximo-form-blocks' ),
				'all_items'             => __( 'All Form Entries', 'pluximo-form-blocks' ),
				'archives'              => __( 'Form Entry Archives', 'pluximo-form-blocks' ),
				'attributes'            => __( 'Form Entry Attributes', 'pluximo-form-blocks' ),
				'insert_into_item'      => __( 'Insert into form entry', 'pluximo-form-blocks' ),
				'uploaded_to_this_item' => __( 'Uploaded to this form entry', 'pluximo-form-blocks' ),
				'filter_items_list'     => __( 'Filter form entries list', 'pluximo-form-blocks' ),
				'items_list_navigation' => __( 'Form entries list navigation', 'pluximo-form-blocks' ),
				'items_list'            => __( 'Form entries list', 'pluximo-form-blocks' ),
			),
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'show_in_nav_menus'  => false,
			'show_in_admin_bar'  => false,
			'query_var'          => false,
			'rewrite'            => false,
			'capability_type'    => 'post',
			'capabilities'       => array(
				'create_posts' => 'do_not_allow',
			),
			'map_meta_cap'       => true,
			'has_archive'        => false,
			'hierarchical'       => false,
			'menu_position'      => 25,
			'menu_icon'          => 'dashicons-feedback',
			'supports'           => array( 'title' ),
			'show_in_rest'       => false,
		);

		register_post_type( PLUXIMO_FORM_BLOCK_POST_TYPE, $args );
	}

	/**
	 * Add meta boxes for form entry details
	 */
	public function add_meta_boxes() {
		add_meta_box(
			'form_entry_details',
			__( 'Form Entry Details', 'pluximo-form-blocks' ),
			array( $this, 'render_meta_box' ),
			PLUXIMO_FORM_BLOCK_POST_TYPE,
			'normal',
			'high'
		);
	}

	/**
	 * Render the form entry meta box
	 *
	 * @param WP_Post $post The post object.
	 */
	public function render_meta_box( $post ) {
		// Add nonce for security.
		wp_nonce_field( 'form_entry_meta_box', 'form_entry_meta_nonce' );

		$form_id    = get_post_meta( $post->ID, '_form_id', true );
		$form_data  = get_post_meta( $post->ID, '_form_data', true );
		$ip_address = get_post_meta( $post->ID, '_ip_address', true );
		$user_agent = get_post_meta( $post->ID, '_user_agent', true );
		$referer    = get_post_meta( $post->ID, '_referer', true );

		$output   = array();
		$output[] = '<table class="form-table">';

		// Form ID.
		if ( $form_id ) {
			$output[] = '<tr>';
			$output[] = '<th scope="row">' . esc_html__( 'Form ID', 'pluximo-form-blocks' ) . '</th>';
			$output[] = '<td>' . esc_html( $form_id ) . '</td>';
			$output[] = '</tr>';
		}

		// Form Data.
		if ( $form_data && is_array( $form_data ) ) {
			$output[] = '<tr>';
			$output[] = '<th scope="row">' . esc_html__( 'Form Data', 'pluximo-form-blocks' ) . '</th>';
			$output[] = '<td>';
			$output[] = '<table class="widefat striped">';
			foreach ( $form_data as $field => $value ) {
				$output[] = '<tr>';
				$output[] = '<td><strong>' . esc_html( $this->format_field_name( $field ) ) . ':</strong></td>';
				$output[] = '<td>' . esc_html( $this->format_field_value( $value ) ) . '</td>';
				$output[] = '</tr>';
			}
			$output[] = '</table>';
			$output[] = '</td>';
			$output[] = '</tr>';
		}

		// IP Address.
		if ( $ip_address ) {
			$output[] = '<tr>';
			$output[] = '<th scope="row">' . esc_html__( 'IP Address', 'pluximo-form-blocks' ) . '</th>';
			$output[] = '<td>' . esc_html( $ip_address ) . '</td>';
			$output[] = '</tr>';
		}

		// User Agent.
		if ( $user_agent ) {
			$output[] = '<tr>';
			$output[] = '<th scope="row">' . esc_html__( 'User Agent', 'pluximo-form-blocks' ) . '</th>';
			$output[] = '<td><span title="' . esc_attr( $user_agent ) . '">' . esc_html( $this->truncate_text( $user_agent, 100 ) ) . '</span></td>';
			$output[] = '</tr>';
		}

		// Referer.
		if ( $referer ) {
			$output[] = '<tr>';
			$output[] = '<th scope="row">' . esc_html__( 'Referer', 'pluximo-form-blocks' ) . '</th>';
			$output[] = '<td><a href="' . esc_url( $referer ) . '" target="_blank" rel="noopener noreferrer">' . esc_html( $referer ) . '</a></td>';
			$output[] = '</tr>';
		}

		$output[] = '</table>';

		// Output all at once for better performance.
		echo implode( "\n", $output ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Add custom columns to form entries list
	 *
	 * @param array $columns The existing columns array.
	 *
	 * @return array Modified columns array.
	 */
	public function add_columns( $columns ) {
		$new_columns                = array();
		$new_columns['cb']          = $columns['cb'];
		$new_columns['title']       = $columns['title'];
		$new_columns['form_id']     = __( 'Form ID', 'pluximo-form-blocks' );
		$new_columns['form_fields'] = __( 'Fields', 'pluximo-form-blocks' );
		$new_columns['ip_address']  = __( 'IP Address', 'pluximo-form-blocks' );
		$new_columns['date']        = $columns['date'];

		return $new_columns;
	}

	/**
	 * Populate custom columns
	 *
	 * @param string $column  The column name.
	 * @param int    $post_id The post ID.
	 */
	public function populate_columns( $column, $post_id ) {
		switch ( $column ) {
			case 'form_id':
				$form_id = get_post_meta( $post_id, '_form_id', true );
				echo $form_id ? esc_html( $form_id ) : '—';
				break;

			case 'form_fields':
				$form_data = get_post_meta( $post_id, '_form_data', true );
				if ( $form_data && is_array( $form_data ) ) {
					$field_count = count( $form_data );
					$field_names = array_keys( $form_data );
					/* translators: %d: number of fields */
					$field_text = _n( '%d field', '%d fields', $field_count, 'pluximo-form-blocks' );
					printf(
						esc_html( $field_text ),
						esc_html( number_format_i18n( $field_count ) )
					);
					if ( $field_count <= 3 ) {
						echo '<br><small>' . esc_html( implode( ', ', $field_names ) ) . '</small>';
					}
				} else {
					echo '—';
				}
				break;

			case 'ip_address':
				$ip_address = get_post_meta( $post_id, '_ip_address', true );
				echo $ip_address ? esc_html( $ip_address ) : '—';
				break;
		}
	}

	/**
	 * Make columns sortable
	 *
	 * @param array $columns The existing sortable columns array.
	 *
	 * @return array Modified sortable columns array.
	 */
	public function sortable_columns( $columns ) {
		$columns['form_id']    = 'form_id';
		$columns['ip_address'] = 'ip_address';
		return $columns;
	}

	/**
	 * Format field name for display
	 *
	 * @param string $field_name The raw field name.
	 * @return string Formatted field name.
	 */
	private function format_field_name( $field_name ) {
		// Convert snake_case and kebab-case to Title Case.
		$formatted = str_replace( array( '_', '-' ), ' ', $field_name );
		return ucwords( $formatted );
	}

	/**
	 * Format field value for display
	 *
	 * @param mixed $value The field value.
	 * @return string Formatted field value.
	 */
	private function format_field_value( $value ) {
		if ( is_array( $value ) ) {
			return implode( ', ', array_map( 'esc_html', $value ) );
		}

		$value = (string) $value;

		// Truncate long values.
		if ( strlen( $value ) > 200 ) {
			return $this->truncate_text( $value, 200 );
		}

		return $value;
	}

	/**
	 * Truncate text with ellipsis
	 *
	 * @param string $text   The text to truncate.
	 * @param int    $length Maximum length.
	 * @return string Truncated text.
	 */
	private function truncate_text( $text, $length ) {
		if ( strlen( $text ) <= $length ) {
			return $text;
		}

		return substr( $text, 0, $length ) . '...';
	}
}
