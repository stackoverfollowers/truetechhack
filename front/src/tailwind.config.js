/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx}',
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',

		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				primary: 'rgb(var(--primary-color), <alpha-value>)',
				'accents-1': 'rgb(var(--accents-1), <alpha-value>)',
				'accents-2': 'rgb(var(--accents-2), <alpha-value>)',
				'accents-3': 'rgb(var(--accents-3), <alpha-value>)',
				'accents-4': 'rgb(var(--accents-4), <alpha-value>)',
				'accents-5': 'rgb(var(--accents-5), <alpha-value>)',
				'accents-6': 'rgb(var(--accents-6), <alpha-value>)',
				'accents-7': 'rgb(var(--accents-7), <alpha-value>)',
				'accents-8': 'rgb(var(--accents-8), <alpha-value>)',
				'accents-9': 'rgb(var(--accents-9), <alpha-value>)',
				'accents-10': 'rgb(var(--accents-10), <alpha-value>)',
				error: 'rgb(var(--error-color), <alpha-value>)',
			},
		},
	},
	plugins: [],
};
