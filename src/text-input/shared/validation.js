/**
 * Shared validation logic for text input fields
 * Centralized validation functions to avoid duplication
 */

/**
 * Client-side validation setup for text input fields
 * @param {string} selector - CSS selector for input fields
 */
export function setupTextInputValidation( selector = '.text-input-field' ) {
	document.addEventListener( 'DOMContentLoaded', function () {
		const textInputs = document.querySelectorAll( selector );

		textInputs.forEach( function ( input ) {
			const validationHandler = new TextInputValidationHandler( input );
			validationHandler.init();
		} );
	} );
}

/**
 * Text Input Validation Handler Class
 * Handles all validation logic for a single text input field
 */
export class TextInputValidationHandler {
	constructor( input ) {
		this.input = input;
		this.validMessage = input.getAttribute( 'data-valid-message' );
		this.invalidMessage = input.getAttribute( 'data-invalid-message' );
		this.errorElement = null;
		this.successElement = null;
	}

	init() {
		this.input.addEventListener( 'blur', () => this.validateInput() );
		this.input.addEventListener( 'input', () => {
			if ( this.errorElement ) {
				this.validateInput();
			}
		} );

		const form = this.input.closest( 'form' );
		if ( form ) {
			form.addEventListener( 'submit', ( e ) => {
				if ( ! this.validateInput() ) {
					e.preventDefault();
					this.input.focus();
				}
			} );
		}
	}

	showError( message ) {
		this.hideError();
		this.hideSuccess();
		this.errorElement = document.createElement( 'p' );
		this.errorElement.className = 'text-input-error';
		this.errorElement.textContent = message;
		this.input.parentNode.parentNode.appendChild( this.errorElement );
		this.input.classList.add(
			'border-red-500',
			'focus:border-red-500',
			'focus:ring-red-500'
		);
		this.input.classList.remove(
			'border-gray-200',
			'focus:border-blue-500',
			'focus:ring-blue-500',
			'border-teal-500'
		);
		this.triggerFormValidationUpdate();
	}

	showSuccess( message ) {
		this.hideError();
		this.hideSuccess();
		if ( message ) {
			this.successElement = document.createElement( 'p' );
			this.successElement.className = 'text-input-success';
			this.successElement.textContent = message;
			this.input.parentNode.parentNode.appendChild( this.successElement );
		}
		this.input.classList.add(
			'border-teal-500',
			'focus:border-teal-500',
			'focus:ring-teal-500'
		);
		this.input.classList.remove(
			'border-gray-200',
			'focus:border-blue-500',
			'focus:ring-blue-500',
			'border-red-500'
		);
		this.triggerFormValidationUpdate();
	}

	hideError() {
		if ( this.errorElement ) {
			this.errorElement.remove();
			this.errorElement = null;
		}
	}

	hideSuccess() {
		if ( this.successElement ) {
			this.successElement.remove();
			this.successElement = null;
		}
	}

	resetField() {
		this.hideError();
		this.hideSuccess();
		this.input.classList.remove(
			'border-red-500',
			'focus:border-red-500',
			'focus:ring-red-500',
			'border-teal-500',
			'focus:border-teal-500',
			'focus:ring-teal-500'
		);
		this.input.classList.add(
			'border-gray-200',
			'focus:border-blue-500',
			'focus:ring-blue-500'
		);
		this.triggerFormValidationUpdate();
	}

	triggerFormValidationUpdate() {
		const form = this.input.closest( 'form' );
		if ( form ) {
			const event = new CustomEvent( 'textInputValidationChange', {
				bubbles: true,
			} );
			form.dispatchEvent( event );
		}
	}

	validateInput() {
		const value = this.input.value;

		if ( ! value.trim() && ! this.input.required ) {
			this.resetField();
			return true;
		}

		if ( this.input.required && ! value.trim() ) {
			this.showError( this.invalidMessage || 'This field is required.' );
			return false;
		}

		const minLength = this.input.getAttribute( 'minLength' );
		if ( minLength && value.length < parseInt( minLength ) ) {
			this.showError(
				this.invalidMessage ||
					`Minimum length is ${ minLength } characters.`
			);
			return false;
		}

		const maxLength = this.input.getAttribute( 'maxLength' );
		if ( maxLength && value.length > parseInt( maxLength ) ) {
			this.showError(
				this.invalidMessage ||
					`Maximum length is ${ maxLength } characters.`
			);
			return false;
		}

		const pattern = this.input.getAttribute( 'pattern' );
		if ( pattern && value && ! new RegExp( pattern ).test( value ) ) {
			this.showError(
				this.invalidMessage || 'Please enter a valid value.'
			);
			return false;
		}

		if ( value.trim() ) {
			this.showSuccess( this.validMessage );
		} else {
			this.resetField();
		}
		return true;
	}
}
