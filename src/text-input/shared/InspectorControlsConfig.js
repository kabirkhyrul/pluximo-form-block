/**
 * Shared Inspector Controls configuration for text input
 * Eliminates control duplication and provides consistency
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { generateFieldId } from './field-utils';

export const TextInputInspectorControls = ( { attributes, setAttributes } ) => {
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

	return (
		<InspectorControls>
			<PanelBody
				title={ __( 'Field Settings', 'pluximo-form-block' ) }
				initialOpen={ true }
			>
				<TextControl
					label={ __( 'Label', 'pluximo-form-block' ) }
					value={ label }
					onChange={ ( value ) => {
						const newFieldId = generateFieldId( value );
						setAttributes( {
							label: value,
							fieldId: newFieldId,
						} );
					} }
				/>
				<TextControl
					label={ __( 'Placeholder', 'pluximo-form-block' ) }
					value={ placeholder }
					onChange={ ( value ) =>
						setAttributes( { placeholder: value } )
					}
				/>
				<SelectControl
					label={ __( 'Input Type', 'pluximo-form-block' ) }
					value={ inputType }
					options={ [
						{ label: 'Text', value: 'text' },
						{ label: 'Email', value: 'email' },
						{ label: 'Password', value: 'password' },
						{ label: 'URL', value: 'url' },
						{ label: 'Tel', value: 'tel' },
					] }
					onChange={ ( value ) =>
						setAttributes( { inputType: value } )
					}
				/>
				<TextControl
					label={ __( 'Help Text', 'pluximo-form-block' ) }
					value={ helpText }
					onChange={ ( value ) =>
						setAttributes( { helpText: value } )
					}
				/>
				<ToggleControl
					label={ __( 'Required', 'pluximo-form-block' ) }
					checked={ required }
					onChange={ ( value ) =>
						setAttributes( { required: value } )
					}
				/>
				<TextControl
					label={ __( 'Field ID', 'pluximo-form-block' ) }
					value={ fieldId }
					onChange={ ( value ) =>
						setAttributes( { fieldId: value } )
					}
					help={ __(
						'Unique identifier for this field',
						'pluximo-form-block'
					) }
				/>
			</PanelBody>
			<PanelBody
				title={ __( 'Validation', 'pluximo-form-block' ) }
				initialOpen={ false }
			>
				<RangeControl
					label={ __( 'Minimum Length', 'pluximo-form-block' ) }
					value={ minLength }
					onChange={ ( value ) =>
						setAttributes( { minLength: value } )
					}
					min={ 0 }
					max={ 255 }
					help={ __(
						'Minimum number of characters required',
						'pluximo-form-block'
					) }
				/>
				<RangeControl
					label={ __( 'Maximum Length', 'pluximo-form-block' ) }
					value={ maxLength }
					onChange={ ( value ) =>
						setAttributes( { maxLength: value } )
					}
					min={ 1 }
					max={ 1000 }
					help={ __(
						'Maximum number of characters allowed',
						'pluximo-form-block'
					) }
				/>
				<TextControl
					label={ __( 'Pattern (RegEx)', 'pluximo-form-block' ) }
					value={ pattern }
					onChange={ ( value ) =>
						setAttributes( { pattern: value } )
					}
					help={ __(
						'Regular expression pattern for validation',
						'pluximo-form-block'
					) }
				/>
				<TextControl
					label={ __( 'Valid Message', 'pluximo-form-block' ) }
					value={ validMessage }
					onChange={ ( value ) =>
						setAttributes( { validMessage: value } )
					}
					help={ __(
						'Message to show when input is valid',
						'pluximo-form-block'
					) }
				/>
				<TextControl
					label={ __( 'Invalid Message', 'pluximo-form-block' ) }
					value={ invalidMessage }
					onChange={ ( value ) =>
						setAttributes( { invalidMessage: value } )
					}
					help={ __(
						'Message to show when input is invalid',
						'pluximo-form-block'
					) }
				/>
			</PanelBody>
		</InspectorControls>
	);
};
