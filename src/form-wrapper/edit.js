import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { FormStructure } from './shared/FormStructure';
import { FormWrapperInspectorControls } from './shared/InspectorControlsConfig';
import {
	DEFAULT_CONTACT_FORM_TEMPLATE,
	FORM_BLOCK_CONFIG,
} from './shared/form-config';
import './style.scss';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();

	return (
		<>
			<FormWrapperInspectorControls
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
			<div { ...blockProps }>
				<FormStructure isEditor={ true } attributes={ attributes }>
					<InnerBlocks
						{ ...FORM_BLOCK_CONFIG }
						template={ DEFAULT_CONTACT_FORM_TEMPLATE }
						renderAppender={ () => (
							<InnerBlocks.ButtonBlockAppender className="mt-4 form-wrapper-submit" />
						) }
					/>
				</FormStructure>
			</div>
		</>
	);
}
