/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Add this line to force static HTML export
    reactStrictMode: true,
    swcMinify: true,
    images: {  // Keep your existing images configuration
        domains: ['lh3.googleusercontent.com', 'insta-recipe-assets.s3.us-east-1.amazonaws.com'],
    },
};

module.exports = nextConfig;