/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [],
  },
  images: {
    domains: [],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };
    
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // Ignore warnings for optional dependencies
    config.ignoreWarnings = [
      { module: /pino-pretty/ },
      { module: /encoding/ },
    ];
    
    return config;
  },
}

module.exports = nextConfig