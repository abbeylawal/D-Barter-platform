/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        // domains: ["subdomain", "infura-ipfs.io"]
        domains: ['gateway.pinata.cloud'],
    },
};

export default nextConfig;
