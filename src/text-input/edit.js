import { useBlockProps } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import './style.scss';
import { FieldStructure } from './shared/FieldStructure';
import { TextInputInspectorControls } from './shared/InspectorControlsConfig';
import { generateFieldId } from './shared/field-utils';

export default function Edit( { attributes, setAttributes } ) {
	const { label, fieldId } = attributes;

	useEffect( () => {
		if ( ! fieldId && label ) {
			const generatedId = generateFieldId( label );
			if ( generatedId ) {
				setAttributes( { fieldId: generatedId } );
			}
		}
	}, [ fieldId, label, setAttributes ] );

	const blockProps = useBlockProps();

	return (
		<>
			<TextInputInspectorControls
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
			<div { ...blockProps }>
				<FieldStructure
					attributes={ attributes }
					isEditor={ true }
					showValidationIcons={ true }
				/>
			</div>
		</>
	);
}
