import { useBlockProps } from '@wordpress/block-editor';
import { FieldStructure } from './shared/FieldStructure';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @param {Object} root0
 * @param {Object} root0.attributes
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<FieldStructure
				attributes={ attributes }
				isEditor={ false }
				showValidationIcons={ false }
			/>
		</div>
	);
}
