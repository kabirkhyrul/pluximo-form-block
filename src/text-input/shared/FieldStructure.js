/**
 * Shared FieldStructure component
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
		inputType,
		helpText,
		required,
		fieldId,
		minLength,
		maxLength,
		pattern,
		validMessage,
		invalidMessage,
	} = attributes;

	const actualFieldId =
		fieldId || generateFieldId( label ) || 'text-input-field';
	const autocompleteValue = getAutocompleteAttribute( inputType, label );

	const ValidationIcons = () => (
		<>
			{ invalidMessage && showValidationIcons && (
				<div className="text-input-icon" aria-hidden="true">
					<AlertCircle size={ 16 } className="text-red-500" />
				</div>
			) }
			{ validMessage && showValidationIcons && (
				<div className="text-input-icon" aria-hidden="true">
					<Check size={ 16 } className="text-teal-500" />
				</div>
			) }
		</>
	);

	const ValidationMessages = () => (
		<>
			{ invalidMessage && isEditor && (
				<p className="text-input-error" role="alert" aria-live="polite">
					{ invalidMessage }
				</p>
			) }
			{ validMessage && isEditor && (
				<p
					className="text-input-success"
					role="status"
					aria-live="polite"
				>
					{ validMessage }
				</p>
			) }
		</>
	);

	const inputProps = {
		type: inputType,
		id: actualFieldId,
		name: actualFieldId,
		className: 'text-input-field',
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
		<div className="text-input-container">
			<div className="text-input-field-wrapper">
				<label htmlFor={ actualFieldId } className="text-input-label">
					{ label }
					{ required && (
						<span
							className="text-input-required"
							aria-label={ __(
								'required',
								'pluximo-form-blocks'
							) }
						>
							*
						</span>
					) }
				</label>
				<div className="text-input-relative">
					<input
						{ ...inputProps }
						aria-invalid={ invalidMessage ? 'true' : 'false' }
						aria-required={ required ? 'true' : 'false' }
					/>
					{ isEditor ? (
						<ValidationIcons />
					) : (
						<div
							className="text-input-icon validation-icon"
							style={ { display: 'none' } }
							aria-hidden="true"
						></div>
					) }
				</div>
				{ helpText && (
					<p
						className="text-input-help"
						id={ actualFieldId + '-help' }
					>
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
