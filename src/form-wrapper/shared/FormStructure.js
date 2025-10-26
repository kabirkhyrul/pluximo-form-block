/**
 * Shared FormStructure component
 * Eliminates HTML duplication between edit.js and save.js
 */
import { __ } from '@wordpress/i18n';
import { Send, Loader } from 'lucide-react';

export const FormStructure = ( {
	children,
	isEditor = false,
	attributes = {},
} ) => {
	const {
		formId = '',
		successMessage = 'Form submitted successfully.',
		errorMessage = "We couldn't submit your form. Please try again or contact support.",
	} = attributes;
	const SubmitButton = () => (
		<button
			type="submit"
			className="form-wrapper-submit"
			aria-describedby="form-submit-description"
		>
			<Send className="form-wrapper-icon" aria-hidden="true" />
			{ __( 'Send', 'pluximo-form-blocks' ) }
			<span id="form-submit-description" className="sr-only">
				{ __( 'Submit the form', 'pluximo-form-blocks' ) }
			</span>
		</button>
	);

	const LoaderButton = () => (
		<button
			type="button"
			className={ `form-wrapper-loader ${ ! isEditor ? 'hidden' : '' }` }
			disabled
			aria-live="assertive"
			aria-label={ __( 'Form is being submitted', 'pluximo-form-blocks' ) }
		>
			<Loader
				className="form-wrapper-icon animate-spin"
				aria-hidden="true"
			/>
			{ __( 'Sending…', 'pluximo-form-blocks' ) }
		</button>
	);

	const FormNotices = () => (
		<div className="form-wrapper-notice">
			<div
				className={ `p-4 mt-2 text-sm text-teal-800 bg-teal-100 border border-teal-200 rounded-lg dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500 ${
					! isEditor ? 'hidden' : ''
				}` }
				role="status"
				aria-live="polite"
				aria-labelledby="fbb-soft-color-success-label"
				id="success-message"
			>
				<span id="fbb-soft-color-success-label" className="font-bold">
					{ __( 'Success!', 'pluximo-form-blocks' ) }
				</span>{ ' ' }
				<span id="success-text">{ successMessage }</span>
			</div>
			<div
				className={ `p-4 mt-2 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg dark:bg-red-800/10 dark:border-red-900 dark:text-red-500 ${
					! isEditor ? 'hidden' : ''
				}` }
				role="alert"
				aria-live="assertive"
				aria-labelledby="fbb-soft-color-danger-label"
				id="error-message"
			>
				<span id="fbb-soft-color-danger-label" className="font-bold">
					{ __( 'Error!', 'pluximo-form-blocks' ) }
				</span>{ ' ' }
				<span id="error-text">{ errorMessage }</span>
			</div>
		</div>
	);

	return (
		<section
			className="fbb"
			data-success-message={ successMessage }
			data-error-message={ errorMessage }
			aria-label={ __( 'Contact Form', 'pluximo-form-blocks' ) }
		>
			<div className="form-wrapper-container">
				<div className="form-wrapper-inner">
					<form
						id={ formId || undefined }
						method="POST"
						noValidate
						aria-live="polite"
					>
						<fieldset className="form-fieldset">
							<legend className="sr-only">
								{ __( 'Form Fields', 'pluximo-form-blocks' ) }
							</legend>
							<div className="form-wrapper-grid">
								{ children }
								<SubmitButton />
								<LoaderButton />
							</div>
						</fieldset>
					</form>
					<FormNotices />
				</div>
			</div>
		</section>
	);
};
