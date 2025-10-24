/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{js,jsx,ts,tsx,php}',
		'./build/**/*.{js,jsx,ts,tsx,php}',
	],
	theme: {
		extend: {
			colors: {
				'wp-blue': '#007cba',
				'wp-blue-dark': '#005a87',
				'wp-gray': '#646970',
				'wp-gray-light': '#ddd',
				'wp-red': '#d63638',
			},
		},
	},
	plugins: [],
};
