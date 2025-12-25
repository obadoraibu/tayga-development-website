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
      // Сюда позже добавим домен продакшн сервера, например:
      // { protocol: 'https', hostname: 'api.tayga-dev.ru', pathname: '/uploads/**' }
    ],
  },
}

module.exports = nextConfig

