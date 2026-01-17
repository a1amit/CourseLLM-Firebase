import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Exclude Genkit and its dependencies from webpack bundling
  // These packages use Node.js-specific features (Express, OpenTelemetry)
  // that don't work with Next.js's bundler
  serverExternalPackages: [
    'genkit',
    '@genkit-ai/core',
    '@genkit-ai/ai',
    '@genkit-ai/googleai',
    '@genkit-ai/firebase',
    'express',
    '@opentelemetry/api',
    '@opentelemetry/instrumentation',
    '@opentelemetry/sdk-trace-base',
    '@opentelemetry/sdk-trace-node',
    'import-in-the-middle',
    'require-in-the-middle',
  ],
};

export default nextConfig;
