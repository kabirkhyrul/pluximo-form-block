/**
 * Shared utility functions for textarea fields
 */

/**
 * Generate a slug from label for field ID
 * @param {string} label
 */
export function generateFieldId( label ) {
	if ( ! label ) {
		return '';
	}
	return label
		.toLowerCase()
		.replace( /[^a-z0-9\s]/gi, '' )
		.trim()
		.replace( /\s+/g, '-' )
		.replace( /-+/g, '-' )
		.replace( /^-|-$/g, '' );
}

/**
 * Get autocomplete attribute based on input type and label
 * @param {string} inputType
 * @param {string} label
 */
export function getAutocompleteAttribute( inputType, label ) {
	const lowerLabel = label.toLowerCase();

	if (
		lowerLabel.includes( 'comment' ) ||
		lowerLabel.includes( 'message' ) ||
		lowerLabel.includes( 'description' )
	) {
		return 'off';
	}
	if ( lowerLabel.includes( 'address' ) ) {
		return 'street-address';
	}
	if ( lowerLabel.includes( 'bio' ) || lowerLabel.includes( 'about' ) ) {
		return 'off';
	}

	return 'off';
}
