import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { FormStructure } from './shared/FormStructure';

export default function save( { attributes } ) {
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<FormStructure isEditor={ false } attributes={ attributes }>
				<InnerBlocks.Content />
			</FormStructure>
		</div>
	);
}
