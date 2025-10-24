/**
 * Shared form configuration
 * Single source of truth for form template and settings
 */

export const DEFAULT_CONTACT_FORM_TEMPLATE = [
	[
		'pluximo-form-block/text-input',
		{
			label: 'Name',
			placeholder: 'Your full name',
			required: true,
			inputType: 'text',
		},
	],
	[
		'pluximo-form-block/text-input',
		{
			label: 'Email',
			placeholder: 'your@email.com',
			required: true,
			inputType: 'email',
		},
	],
	[
		'pluximo-form-block/text-input',
		{
			label: 'Subject',
			placeholder: 'Message subject',
			required: true,
			inputType: 'text',
		},
	],
	[
		'pluximo-form-block/textarea',
		{
			label: 'Message',
			placeholder: 'Your message here...',
			required: true,
			inputType: 'text',
			minLength: 10,
		},
	],
];

export const FORM_BLOCK_CONFIG = {
	allowedBlocks: [
		'pluximo-form-block/text-input',
		'pluximo-form-block/textarea',
	],
	templateLock: false,
};

// Alternative templates for future use
export const TEMPLATES = {
	contact: DEFAULT_CONTACT_FORM_TEMPLATE,
	newsletter: [
		[
			'pluximo-form-block/text-input',
			{
				label: 'Email',
				placeholder: 'Enter your email',
				required: true,
				inputType: 'email',
			},
		],
	],
	feedback: [
		[
			'pluximo-form-block/text-input',
			{
				label: 'Name',
				placeholder: 'Your name',
				required: false,
				inputType: 'text',
			},
		],
		[
			'pluximo-form-block/text-input',
			{
				label: 'Feedback',
				placeholder: 'Share your thoughts...',
				required: true,
				inputType: 'text',
				minLength: 5,
			},
		],
	],
};
