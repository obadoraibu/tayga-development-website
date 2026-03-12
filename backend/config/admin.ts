export default ({ env }) => ({
  // Явный путь админки — запросы идут на /admin/..., а не на /content-manager (404 у Next.js)
  url: '/admin',
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    // Сессия: убираем предупреждение и задаём сроки явно (в секундах)
    sessions: {
      accessTokenLifespan: 1800,
      maxRefreshTokenLifespan: 2592000,   // 30 дней
      maxSessionLifespan: 2592000,
      idleRefreshTokenLifespan: 604800,    // 7 дней
      idleSessionLifespan: 3600,
    },
    // По HTTP (без HTTPS) браузер не сохраняет secure cookie — админка не работает после входа.
    // false = админка по http://IP:1337/admin работает. Когда будет HTTPS — задайте ADMIN_COOKIE_SECURE=true в .env
    cookie: {
      secure: env.bool('ADMIN_COOKIE_SECURE', false),
    },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
