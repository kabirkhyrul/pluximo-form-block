/**
 * Shared Inspector Controls configuration for form wrapper
 * Provides consistent form settings interface
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';

export const FormWrapperInspectorControls = ( {
	attributes,
	setAttributes,
} ) => {
	const { formId, successMessage, errorMessage } = attributes;

	return (
		<InspectorControls>
			<PanelBody
				title={ __( 'Form Settings', 'pluximo-form-blocks' ) }
				initialOpen={ true }
			>
				<TextControl
					label={ __( 'Form ID', 'pluximo-form-blocks' ) }
					value={ formId }
					onChange={ ( value ) => setAttributes( { formId: value } ) }
					help={ __(
						'Unique identifier for this form (optional)',
						'pluximo-form-blocks'
					) }
					placeholder={ __(
						'e.g., contact-form',
						'pluximo-form-blocks'
					) }
				/>
			</PanelBody>
			<PanelBody
				title={ __( 'Form Messages', 'pluximo-form-blocks' ) }
				initialOpen={ false }
			>
				<TextareaControl
					label={ __( 'Success Message', 'pluximo-form-blocks' ) }
					value={ successMessage }
					onChange={ ( value ) =>
						setAttributes( { successMessage: value } )
					}
					help={ __(
						'Message displayed when form is successfully submitted',
						'pluximo-form-blocks'
					) }
					rows={ 3 }
				/>
				<TextareaControl
					label={ __( 'Error Message', 'pluximo-form-blocks' ) }
					value={ errorMessage }
					onChange={ ( value ) =>
						setAttributes( { errorMessage: value } )
					}
					help={ __(
						'Message displayed when form submission fails',
						'pluximo-form-blocks'
					) }
					rows={ 3 }
				/>
			</PanelBody>
		</InspectorControls>
	);
};
