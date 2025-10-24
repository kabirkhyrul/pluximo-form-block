/**
 * Client-side validation for text input fields
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

import { setupTextInputValidation } from './shared/validation.js';

setupTextInputValidation( '.text-input-field' );
