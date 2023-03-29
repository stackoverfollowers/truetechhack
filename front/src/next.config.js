/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		SERVER_URL: 'http://back:3001',
	},
	images: {
		domains: ['tailwindui.com'],
	},
};

module.exports = nextConfig;
