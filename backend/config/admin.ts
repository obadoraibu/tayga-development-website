export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    sessions: {
      accessTokenLifespan: 1800,
      maxRefreshTokenLifespan: 2592000,
      maxSessionLifespan: 2592000,
      idleRefreshTokenLifespan: 604800,
      idleSessionLifespan: 3600,
    },
    cookie: {
      secure: env.bool('ADMIN_COOKIE_SECURE', false),
      path: '/',
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
