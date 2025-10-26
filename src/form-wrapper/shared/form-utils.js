/**
 * Shared utility functions for form wrapper
 */

/**
 * Generate a slug from form ID to ensure it's valid for HTML id attribute
 * @param {string} formId
 * @return {string} Sanitized form ID in dash-case format
 */
export function sanitizeFormId( formId ) {
	if ( ! formId ) {
		return '';
	}
	return formId
		.toLowerCase()
		.replace( /[^a-z0-9\s]/gi, '' )
		.trim()
		.replace( /\s+/g, '-' )
		.replace( /-+/g, '-' )
		.replace( /^-|-$/g, '' );
}
