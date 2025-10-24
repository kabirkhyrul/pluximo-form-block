/**
 * Client-side validation for textarea fields
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

import { setupTextareaValidation } from './shared/validation.js';

setupTextareaValidation( '.textarea-field' );
