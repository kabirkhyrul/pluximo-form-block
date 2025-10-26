/**
 * Form submission handler for Pluximo Form Blocks
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

document.addEventListener( 'DOMContentLoaded', function () {
	const formWrappers = document.querySelectorAll( '.fbb' );

	formWrappers.forEach( function ( wrapper ) {
		const form = wrapper.querySelector( 'form' );
		const submitButton = wrapper.querySelector( '.form-wrapper-submit' );

		if ( ! form || ! submitButton ) {
			return;
		}

		// Initialize form validation state
		updateFormValidation( form, submitButton );

		// Listen for validation changes from text-input blocks
		form.addEventListener( 'textInputValidationChange', function () {
			updateFormValidation( form, submitButton );
		} );

		// Listen for validation changes from textarea blocks
		form.addEventListener( 'textareaValidationChange', function () {
			updateFormValidation( form, submitButton );
		} );

		// Add validation on blur for all text-input fields to show user-friendly messages
		const textInputs = form.querySelectorAll( '.text-input-field' );
		textInputs.forEach( function ( input ) {
			input.addEventListener( 'blur', function () {
				validateInputWithMessages( input );
				updateFormValidation( form, submitButton );
			} );
		} );

		// Also listen for direct input changes on non-text-input fields (if any exist)
		const inputs = form.querySelectorAll( 'input' );
		inputs.forEach( function ( input ) {
			if ( ! input.classList.contains( 'text-input-field' ) ) {
				input.addEventListener( 'input', function () {
					updateFormValidation( form, submitButton );
				} );
				input.addEventListener( 'blur', function () {
					updateFormValidation( form, submitButton );
				} );
			}
		} );

		// Add form submission handler
		submitButton.addEventListener( 'click', function ( e ) {
			e.preventDefault();
			if ( ! submitButton.disabled ) {
				handleFormSubmission( form, submitButton );
			}
		} );

		// Also handle form submission via Enter key
		form.addEventListener( 'submit', function ( e ) {
			e.preventDefault();
			if ( ! submitButton.disabled ) {
				handleFormSubmission( form, submitButton );
			}
		} );
	} );

	/**
	 * Update form validation state and submit button
	 * @param {HTMLElement} form
	 * @param {HTMLElement} submitButton
	 */
	function updateFormValidation( form, submitButton ) {
		const isFormValid = checkFormValidity( form );

		if ( isFormValid ) {
			// Enable submit button
			submitButton.disabled = false;
			submitButton.style.opacity = '1';
			submitButton.style.cursor = 'pointer';
			submitButton.removeAttribute( 'title' );
		} else {
			// Disable submit button
			submitButton.disabled = true;
			submitButton.style.opacity = '0.6';
			submitButton.style.cursor = 'not-allowed';
			submitButton.setAttribute(
				'title',
				'Please fill out all required fields correctly'
			);
		}
	}

	/**
	 * Handle form submission
	 * @param {HTMLElement} form
	 * @param {HTMLElement} submitButton
	 */
	function handleFormSubmission( form, submitButton ) {
		// Validate form
		const validationResult = validateForm( form );
		if ( ! validationResult.isValid ) {
			showValidationErrors( form, validationResult.errors );
			return;
		}

		// Prevent double submission
		if ( submitButton.dataset.submitting === 'true' ) {
			return;
		}
		submitButton.dataset.submitting = 'true';

		// Collect form data
		const formData = collectFormData( form );

		// Show loading state
		setLoadingState( submitButton, true );
		clearValidationErrors( form );

		// Get form attributes for custom messages
		const formWrapper = form.closest( '.fbb' );
		const successMessage = getFormAttribute(
			formWrapper,
			'success-message'
		);
		const errorMessage = getFormAttribute( formWrapper, 'error-message' );

		// Submit form
		submitForm(
			formData,
			form.id || 'form-wrapper',
			successMessage,
			errorMessage
		)
			.then( function ( response ) {
				if ( response.success ) {
					showSuccessMessage(
						form,
						response.message || 'Form submitted successfully!'
					);
					form.reset();
					// Re-validate form after reset to ensure submit button state is correct
					updateFormValidation( form, submitButton );
				} else {
					// Handle server-side validation errors
					if (
						response.errors &&
						typeof response.errors === 'object'
					) {
						// Show individual field errors
						showServerValidationErrors( form, response.errors );
					} else {
						// Show general error message
						showErrorMessage(
							form,
							response.message ||
								'Form submission failed. Please try again.'
						);
					}
					// Re-validate form to disable submit button if there are errors
					updateFormValidation( form, submitButton );
				}
			} )
			.catch( function () {
				// Error logged internally - no console output for production
				showErrorMessage(
					form,
					'An error occurred. Please try again.'
				);
				// Re-validate form to ensure proper button state
				updateFormValidation( form, submitButton );
			} )
			.finally( function () {
				setLoadingState( submitButton, false );
				submitButton.dataset.submitting = 'false';
			} );
	}

	/**
	 * Collect form data from all form inputs
	 * @param {HTMLElement} form
	 */
	function collectFormData( form ) {
		const data = {};
		const formElements = form.querySelectorAll(
			'input[type="text"], input[type="email"], input[type="password"], input[type="url"], input[type="tel"], textarea'
		);

		formElements.forEach( function ( element ) {
			const fieldId = element.id || element.name;
			if ( fieldId ) {
				data[ fieldId ] = element.value.trim();
			}
		} );

		return data;
	}

	/**
	 * Check form validity by validating each input based on its type
	 * @param {HTMLElement} form
	 */
	function checkFormValidity( form ) {
		// Check if there are any visible error messages from text-input or textarea validation
		const errorMessages = form.querySelectorAll(
			'.text-input-error, .textarea-error'
		);
		if ( errorMessages.length > 0 ) {
			return false;
		}

		// Check if any inputs have error styling (red border indicates validation failure)
		const errorInputs = form.querySelectorAll( '.border-red-500' );
		if ( errorInputs.length > 0 ) {
			return false;
		}

		// Validate each input and textarea based on its type and validation rules
		const formElements = form.querySelectorAll(
			'input[type="text"], input[type="email"], input[type="password"], input[type="url"], input[type="tel"], textarea'
		);
		for ( const element of formElements ) {
			if ( ! validateInputByType( element ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Validate individual input based on its type and attributes
	 * @param {HTMLInputElement} input
	 */
	function validateInputByType( input ) {
		const value = ( input.value || '' ).trim();

		// Check required
		if ( input.required && ! value ) {
			return false;
		}

		// Skip other validations if field is empty and not required
		if ( ! value && ! input.required ) {
			return true;
		}

		// Check minimum length
		const minLength = input.getAttribute( 'minLength' );
		if ( minLength && value.length < parseInt( minLength ) ) {
			return false;
		}

		// Check maximum length
		const maxLength = input.getAttribute( 'maxLength' );
		if ( maxLength && value.length > parseInt( maxLength ) ) {
			return false;
		}

		// Check pattern
		const pattern = input.getAttribute( 'pattern' );
		if ( pattern && value ) {
			const regex = new RegExp( pattern );
			if ( ! regex.test( value ) ) {
				return false;
			}
		}

		// Type-specific validation
		switch ( input.type ) {
			case 'email':
				return isValidEmail( value );
			case 'url':
				return isValidUrl( value );
			case 'tel':
				return isValidTel( value );
			default:
				return true;
		}
	}

	/**
	 * Validate input and show user-friendly error messages on blur
	 * @param {HTMLInputElement} input
	 */
	function validateInputWithMessages( input ) {
		const value = ( input.value || '' ).trim();

		// Clear any existing errors first
		clearInputErrors( input );

		// If empty and not required, reset field to neutral state
		if ( ! value && ! input.required ) {
			resetInputField( input );
			return true;
		}

		const customInvalidMessage = input.getAttribute(
			'data-invalid-message'
		);

		// Check required
		if ( input.required && ! value ) {
			showInputError(
				input,
				customInvalidMessage || getErrorMessage( 'required' )
			);
			return false;
		}

		// Skip other validations if field is empty
		if ( ! value ) {
			return true;
		}

		// Check minimum length
		const minLength = input.getAttribute( 'minLength' );
		if ( minLength && value.length < parseInt( minLength ) ) {
			showInputError(
				input,
				customInvalidMessage ||
					getErrorMessage( 'minLength', minLength )
			);
			return false;
		}

		// Check maximum length
		const maxLength = input.getAttribute( 'maxLength' );
		if ( maxLength && value.length > parseInt( maxLength ) ) {
			showInputError(
				input,
				customInvalidMessage ||
					getErrorMessage( 'maxLength', maxLength )
			);
			return false;
		}

		// Check pattern
		const pattern = input.getAttribute( 'pattern' );
		if ( pattern && value ) {
			const regex = new RegExp( pattern );
			if ( ! regex.test( value ) ) {
				showInputError(
					input,
					customInvalidMessage || getErrorMessage( 'pattern' )
				);
				return false;
			}
		}

		// Type-specific validation with user-friendly messages
		switch ( input.type ) {
			case 'email':
				if ( ! isValidEmail( value ) ) {
					showInputError(
						input,
						customInvalidMessage || getErrorMessage( 'email' )
					);
					return false;
				}
				break;
			case 'url':
				if ( ! isValidUrl( value ) ) {
					showInputError(
						input,
						customInvalidMessage || getErrorMessage( 'url' )
					);
					return false;
				}
				break;
			case 'tel':
				if ( ! isValidTel( value ) ) {
					showInputError(
						input,
						customInvalidMessage || getErrorMessage( 'tel' )
					);
					return false;
				}
				break;
		}

		// All validations passed - show success if there's a custom valid message
		const customValidMessage = input.getAttribute( 'data-valid-message' );
		if ( customValidMessage ) {
			showInputSuccess( input, customValidMessage );
		} else {
			resetInputField( input );
		}

		return true;
	}

	/**
	 * Basic form validation (text-input blocks handle their own validation)
	 * @param {Element} form - The form element
	 */
	function validateForm( form ) {
		// Let text-input blocks handle their own validation
		// Just check if form has any validation errors already visible
		const existingErrors = form.querySelectorAll( '.field-error' );
		return {
			isValid: existingErrors.length === 0,
			errors: {},
		};
	}

	/**
	 * Submit form data to REST API endpoint
	 * @param {Object} formData
	 * @param {string} formId
	 * @param {string} successMessage
	 * @param {string} errorMessage
	 */
	function submitForm( formData, formId, successMessage, errorMessage ) {
		const apiUrl = window.pluximoFormsAjax
			? window.pluximoFormsAjax.apiUrl
			: ( window.wpApiSettings?.root || '/wp-json/' ) +
			  'pluximo-form-blocks/v1/submit';
		const nonce = window.pluximoFormsAjax
			? window.pluximoFormsAjax.nonce
			: '';

		// Require valid nonce for security
		if ( ! nonce ) {
			throw new Error( 'Security validation failed' );
		}

		const requestBody = {
			form_data: formData,
			form_id: formId,
		};

		// Add custom messages if provided
		if ( successMessage ) {
			requestBody.success_message = successMessage;
		}
		if ( errorMessage ) {
			requestBody.error_message = errorMessage;
		}

		return fetch( apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': nonce,
			},
			body: JSON.stringify( requestBody ),
		} ).then( function ( response ) {
			if ( ! response.ok ) {
				throw new Error( `HTTP error! status: ${ response.status }` );
			}
			return response.json();
		} );
	}

	/**
	 * Show validation errors
	 * @param {HTMLElement} form
	 * @param {Object}      errors
	 */
	function showValidationErrors( form, errors ) {
		Object.keys( errors ).forEach( function ( fieldId ) {
			const input = form.querySelector(
				`#${ fieldId }, [name="${ fieldId }"]`
			);
			if ( input ) {
				showFieldError( input, errors[ fieldId ] );
			}
		} );
	}

	/**
	 * Show server-side validation errors
	 * @param {HTMLElement} form
	 * @param {Object}      errors
	 */
	function showServerValidationErrors( form, errors ) {
		Object.keys( errors ).forEach( function ( fieldId ) {
			const input = form.querySelector(
				`#${ fieldId }, [name="${ fieldId }"]`
			);
			if ( input ) {
				const errorMessage = Array.isArray( errors[ fieldId ] )
					? errors[ fieldId ][ 0 ]
					: errors[ fieldId ];
				showFieldError( input, errorMessage );
			}
		} );

		// Trigger custom event to notify form wrapper of validation change
		const event = new CustomEvent( 'textInputValidationChange', {
			bubbles: true,
		} );
		form.dispatchEvent( event );
	}

	/**
	 * Show field error
	 * @param {HTMLInputElement} input
	 * @param {string}           message
	 */
	function showFieldError( input, message ) {
		// For text-input fields, use their error display system
		if ( input.classList.contains( 'text-input-field' ) ) {
			// Remove existing errors first
			const existingErrors =
				input.parentNode.parentNode.querySelectorAll(
					'.text-input-error'
				);
			existingErrors.forEach( function ( error ) {
				error.remove();
			} );

			// Add error styling consistent with text-input validation
			input.classList.add(
				'border-red-500',
				'focus:border-red-500',
				'focus:ring-red-500'
			);
			input.classList.remove(
				'border-gray-200',
				'focus:border-blue-500',
				'focus:ring-blue-500',
				'border-teal-500'
			);

			// Create and show error message using text-input error format
			const errorElement = document.createElement( 'p' );
			errorElement.className = 'text-input-error';
			errorElement.textContent = message;
			input.parentNode.parentNode.appendChild( errorElement );
		} else {
			// For other inputs, use the generic field error system
			const existingError =
				input.parentNode.querySelector( '.field-error' );
			if ( existingError ) {
				existingError.remove();
			}

			// Add error class to input
			input.classList.add( 'error' );

			// Create and show error message
			const errorElement = document.createElement( 'p' );
			errorElement.className = 'field-error';
			errorElement.textContent = message;
			input.parentNode.appendChild( errorElement );
		}
	}

	/**
	 * Clear validation errors
	 * @param {HTMLElement} form
	 */
	function clearValidationErrors( form ) {
		// Remove error classes
		const errorInputs = form.querySelectorAll( '.error' );
		errorInputs.forEach( function ( input ) {
			input.classList.remove( 'error' );
		} );

		// Remove error messages
		const errorMessages = form.querySelectorAll( '.field-error' );
		errorMessages.forEach( function ( error ) {
			error.remove();
		} );

		// Remove form messages
		const formMessages = form.querySelectorAll( '.form-message' );
		formMessages.forEach( function ( message ) {
			message.remove();
		} );
	}

	/**
	 * Show success message
	 * @param {HTMLElement} form
	 * @param {string}      message
	 */
	function showSuccessMessage( form, message ) {
		const wrapper = form.closest( '.fbb' );
		const successElement = wrapper.querySelector( '#success-message' );
		const successText = wrapper.querySelector( '#success-text' );
		const errorElement = wrapper.querySelector( '#error-message' );

		if ( successElement && successText ) {
			successText.textContent = message;
			successElement.classList.remove( 'hidden' );
		}

		// Hide error message if visible
		if ( errorElement ) {
			errorElement.classList.add( 'hidden' );
		}

		// Auto-hide success message after 5 seconds
		setTimeout( function () {
			if ( successElement ) {
				successElement.classList.add( 'hidden' );
			}
		}, 5000 );
	}

	/**
	 * Show error message
	 * @param {HTMLElement} form
	 * @param {string}      message
	 */
	function showErrorMessage( form, message ) {
		const wrapper = form.closest( '.fbb' );
		const errorElement = wrapper.querySelector( '#error-message' );
		const errorText = wrapper.querySelector( '#error-text' );
		const successElement = wrapper.querySelector( '#success-message' );

		if ( errorElement && errorText ) {
			errorText.textContent = message;
			errorElement.classList.remove( 'hidden' );
		}

		// Hide success message if visible
		if ( successElement ) {
			successElement.classList.add( 'hidden' );
		}
	}

	/**
	 * Set loading state for submit button
	 * @param {HTMLElement} submitButton
	 * @param {boolean}     isLoading
	 */
	function setLoadingState( submitButton, isLoading ) {
		const form = submitButton.closest( 'form' );
		const loaderButton = form.querySelector( '.form-wrapper-loader' );

		if ( isLoading ) {
			// Hide submit button and show loader button
			if ( submitButton ) {
				submitButton.classList.add( 'hidden' );
			}
			if ( loaderButton ) {
				loaderButton.classList.remove( 'hidden' );
				loaderButton.disabled = true;
			}
		} else {
			// Show submit button and hide loader button
			if ( submitButton ) {
				submitButton.classList.remove( 'hidden' );
			}
			if ( loaderButton ) {
				loaderButton.classList.add( 'hidden' );
				loaderButton.disabled = false;
			}
		}
	}

	/**
	 * Validate email format
	 * @param {string} email
	 */
	function isValidEmail( email ) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test( email );
	}

	/**
	 * Validate URL format
	 * @param {string} url
	 */
	function isValidUrl( url ) {
		try {
			new URL( url );
			return true;
		} catch ( e ) {
			return false;
		}
	}

	/**
	 * Validate telephone number format (basic validation)
	 * @param {string} tel
	 */
	function isValidTel( tel ) {
		// Basic tel validation - allow numbers, spaces, dashes, parentheses, plus sign
		const telRegex = /^[\+]?[0-9\s\-\(\)]+$/;
		return telRegex.test( tel ) && tel.replace( /[^\d]/g, '' ).length >= 7;
	}

	/**
	 * Get user-friendly error message based on validation type
	 * @param {string} type
	 * @param {string} value
	 */
	function getErrorMessage( type, value ) {
		// Use localized messages from PHP wp_localize_script
		const messages = window.pluximoFormsAjax?.messages || {};

		switch ( type ) {
			case 'required':
				return messages.required || 'This field is required.';
			case 'minLength':
				return (
					messages.minLength || 'Please enter at least %d characters.'
				).replace( '%d', value );
			case 'maxLength':
				return (
					messages.maxLength ||
					'Please enter no more than %d characters.'
				).replace( '%d', value );
			case 'pattern':
				return messages.pattern || 'Please enter a valid value.';
			case 'email':
				return (
					messages.email ||
					'Please enter a valid email address (e.g., user@example.com).'
				);
			case 'url':
				return (
					messages.url ||
					'Please enter a valid URL (e.g., https://example.com).'
				);
			case 'tel':
				return (
					messages.tel ||
					'Please enter a valid phone number (e.g., +1-234-567-8900).'
				);
			default:
				return messages.default || 'Please enter a valid value.';
		}
	}

	/**
	 * Show error message for input field
	 * @param {HTMLInputElement} input
	 * @param {string}           message
	 */
	function showInputError( input, message ) {
		// Remove existing errors first
		clearInputErrors( input );

		// Add error styling
		input.classList.add(
			'border-red-500',
			'focus:border-red-500',
			'focus:ring-red-500'
		);
		input.classList.remove(
			'border-gray-200',
			'focus:border-blue-500',
			'focus:ring-blue-500',
			'border-teal-500'
		);

		// Create and show error message
		const errorElement = document.createElement( 'p' );
		errorElement.className = 'text-input-error';
		errorElement.textContent = message;
		input.parentNode.parentNode.appendChild( errorElement );

		// Trigger validation update
		const form = input.closest( 'form' );
		if ( form ) {
			const event = new CustomEvent( 'textInputValidationChange', {
				bubbles: true,
			} );
			form.dispatchEvent( event );
		}
	}

	/**
	 * Show success message for input field
	 * @param {HTMLInputElement} input
	 * @param {string}           message
	 */
	function showInputSuccess( input, message ) {
		// Remove existing errors first
		clearInputErrors( input );

		// Add success styling
		input.classList.add(
			'border-teal-500',
			'focus:border-teal-500',
			'focus:ring-teal-500'
		);
		input.classList.remove(
			'border-gray-200',
			'focus:border-blue-500',
			'focus:ring-blue-500',
			'border-red-500'
		);

		// Create and show success message
		const successElement = document.createElement( 'p' );
		successElement.className = 'text-input-success';
		successElement.textContent = message;
		input.parentNode.parentNode.appendChild( successElement );

		// Trigger validation update
		const form = input.closest( 'form' );
		if ( form ) {
			const event = new CustomEvent( 'textInputValidationChange', {
				bubbles: true,
			} );
			form.dispatchEvent( event );
		}
	}

	/**
	 * Reset input field to neutral state
	 * @param {HTMLInputElement} input
	 */
	function resetInputField( input ) {
		// Remove existing messages
		clearInputErrors( input );

		// Reset styling to neutral
		input.classList.remove(
			'border-red-500',
			'focus:border-red-500',
			'focus:ring-red-500',
			'border-teal-500',
			'focus:border-teal-500',
			'focus:ring-teal-500'
		);
		input.classList.add(
			'border-gray-200',
			'focus:border-blue-500',
			'focus:ring-blue-500'
		);

		// Trigger validation update
		const form = input.closest( 'form' );
		if ( form ) {
			const event = new CustomEvent( 'textInputValidationChange', {
				bubbles: true,
			} );
			form.dispatchEvent( event );
		}
	}

	/**
	 * Clear input errors and success messages
	 * @param {HTMLInputElement} input
	 */
	function clearInputErrors( input ) {
		// Remove error messages
		const errorMessages =
			input.parentNode.parentNode.querySelectorAll( '.text-input-error' );
		errorMessages.forEach( function ( error ) {
			error.remove();
		} );

		// Remove success messages
		const successMessages = input.parentNode.parentNode.querySelectorAll(
			'.text-input-success'
		);
		successMessages.forEach( function ( success ) {
			success.remove();
		} );
	}

	/**
	 * Get form attribute value from wrapper element
	 * @param {HTMLElement} formWrapper
	 * @param {string}      attributeName
	 */
	function getFormAttribute( formWrapper, attributeName ) {
		if ( ! formWrapper ) {
			return null;
		}
		return formWrapper.getAttribute( 'data-' + attributeName ) || null;
	}
} );
