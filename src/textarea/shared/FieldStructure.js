/**
 * Shared FieldStructure component for textarea
 * Eliminates HTML duplication between edit.js and save.js
 */
import { __ } from '@wordpress/i18n';
import { AlertCircle, Check } from 'lucide-react';
import { generateFieldId, getAutocompleteAttribute } from './field-utils';

export const FieldStructure = ( {
	attributes,
	isEditor = false,
	showValidationIcons = false,
} ) => {
	const {
		label,
		placeholder,
		helpText,
		required,
		fieldId,
		rows,
		minLength,
		maxLength,
		pattern,
		validMessage,
		invalidMessage,
	} = attributes;

	const actualFieldId =
		fieldId || generateFieldId( label ) || 'textarea-field';
	const autocompleteValue = getAutocompleteAttribute( 'textarea', label );

	const ValidationIcons = () => (
		<>
			{ invalidMessage && showValidationIcons && (
				<div className="textarea-icon" aria-hidden="true">
					<AlertCircle size={ 16 } className="text-red-500" />
				</div>
			) }
			{ validMessage && showValidationIcons && (
				<div className="textarea-icon" aria-hidden="true">
					<Check size={ 16 } className="text-teal-500" />
				</div>
			) }
		</>
	);

	const ValidationMessages = () => (
		<>
			{ invalidMessage && isEditor && (
				<p className="textarea-error" role="alert" aria-live="polite">
					{ invalidMessage }
				</p>
			) }
			{ validMessage && isEditor && (
				<p
					className="textarea-success"
					role="status"
					aria-live="polite"
				>
					{ validMessage }
				</p>
			) }
		</>
	);

	const textareaProps = {
		id: actualFieldId,
		name: actualFieldId,
		className: 'textarea-field',
		placeholder,
		autoComplete: autocompleteValue,
		'aria-describedby':
			[
				helpText ? actualFieldId + '-help' : null,
				actualFieldId + '-error',
			]
				.filter( Boolean )
				.join( ' ' ) || undefined,
		required,
		rows: rows || 4,
		minLength: minLength > 0 ? minLength : undefined,
		maxLength: maxLength > 0 ? maxLength : undefined,
		pattern: pattern || undefined,
		...( isEditor
			? {}
			: {
					'data-valid-message': validMessage || undefined,
					'data-invalid-message': invalidMessage || undefined,
			  } ),
	};

	return (
		<div className="textarea-container">
			<div className="textarea-field-wrapper">
				<label htmlFor={ actualFieldId } className="textarea-label">
					{ label }
					{ required && (
						<span
							className="textarea-required"
							aria-label={ __(
								'required',
								'pluximo-form-blocks'
							) }
						>
							*
						</span>
					) }
				</label>
				<div className="textarea-relative">
					<textarea
						{ ...textareaProps }
						aria-invalid={ invalidMessage ? 'true' : 'false' }
						aria-required={ required ? 'true' : 'false' }
					></textarea>
					{ isEditor ? (
						<ValidationIcons />
					) : (
						<div
							className="textarea-icon validation-icon"
							style={ { display: 'none' } }
							aria-hidden="true"
						></div>
					) }
				</div>
				{ helpText && (
					<p className="textarea-help" id={ actualFieldId + '-help' }>
						{ helpText }
					</p>
				) }
				<div
					id={ actualFieldId + '-error' }
					role="alert"
					aria-live="polite"
					className="error-container"
				>
					<ValidationMessages />
				</div>
			</div>
		</div>
	);
};
