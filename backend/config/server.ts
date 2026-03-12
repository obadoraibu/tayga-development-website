export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Публичный URL (за доменом/nginx). Нужен, чтобы админка собиралась с правильным base path (/admin).
  // На сервере задайте PUBLIC_URL=https://taiga-development.ru
  url: env('PUBLIC_URL', ''),
  // Доверять X-Forwarded-Proto/Host при работе за nginx
  proxy: { koa: true },
  app: {
    keys: env.array('APP_KEYS'),
  },
});
