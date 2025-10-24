/**
 * Shared utility functions for text input fields
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
	const lowerType = inputType.toLowerCase();

	const autocompleteMap = {
		email: 'email',
		password: 'current-password',
		tel: 'tel',
		url: 'url',
	};

	if ( autocompleteMap[ lowerType ] ) {
		return autocompleteMap[ lowerType ];
	}

	const lowerLabel = label.toLowerCase();

	if ( lowerLabel.includes( 'email' ) ) {
		return 'email';
	}
	if ( lowerLabel.includes( 'phone' ) || lowerLabel.includes( 'tel' ) ) {
		return 'tel';
	}
	if ( lowerLabel.includes( 'url' ) || lowerLabel.includes( 'website' ) ) {
		return 'url';
	}
	if ( lowerLabel.includes( 'name' ) ) {
		if ( lowerLabel.includes( 'first' ) ) {
			return 'given-name';
		}
		if ( lowerLabel.includes( 'last' ) ) {
			return 'family-name';
		}
		return 'name';
	}
	if (
		lowerLabel.includes( 'company' ) ||
		lowerLabel.includes( 'organization' )
	) {
		return 'organization';
	}
	if ( lowerLabel.includes( 'address' ) ) {
		return 'street-address';
	}
	if ( lowerLabel.includes( 'city' ) ) {
		return 'address-level2';
	}
	if ( lowerLabel.includes( 'state' ) || lowerLabel.includes( 'province' ) ) {
		return 'address-level1';
	}
	if ( lowerLabel.includes( 'zip' ) || lowerLabel.includes( 'postal' ) ) {
		return 'postal-code';
	}
	if ( lowerLabel.includes( 'country' ) ) {
		return 'country-name';
	}

	return 'off';
}
