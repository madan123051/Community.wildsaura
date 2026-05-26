/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
  async headers() {
    return [
      {
        // Allow embedding as iframe from wildsaura domains
        source: '/embed/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://wildsaura.com',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://wildsaura.com https://drishya.wildsaura.com https://market.wildsaura.com",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
