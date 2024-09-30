/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['www.artic.edu', 'nrs.harvard.edu'],
    
    },
    reactStrictMode: false,
    experimental: {
      missingSuspenseWithCSRBailout: false,
    },
  };
  
  export default nextConfig;
  