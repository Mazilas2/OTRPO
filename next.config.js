const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5332/api/:path*',
      },
    ];
  },
  images: {
    domains: ['raw.githubusercontent.com', 'img.pokemondb.net'], // Add the domains you want to allow here
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;