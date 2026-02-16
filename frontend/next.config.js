/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Для Docker оптимизации
  eslint: {
    // Игнорируем предупреждения ESLint при сборке (только ошибки)
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Игнорируем ошибки TypeScript при сборке (не рекомендуется, но если нужно)
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '1337',
        pathname: '/uploads/**',
      },
      // Для продакшена: добавьте домен, с которого отдаются медиа (тот же, что и сайт):
      // { protocol: 'https', hostname: 'ваш-домен.ru', pathname: '/uploads/**' },
    ],
  },
}

module.exports = nextConfig

