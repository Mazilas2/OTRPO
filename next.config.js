/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5329/api/:path*',
      },
    ]
  },
  images: {
    domains: ['raw.githubusercontent.com', 'img.pokemondb.net'], // Add the domains you want to allow here
  },
}

module.exports = nextConfig
