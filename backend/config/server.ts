export default ({ env }) => {
  const appKeysRaw = process.env.APP_KEYS || env('APP_KEYS', '');
  const appKeys = typeof appKeysRaw === 'string'
    ? appKeysRaw.split(',').map((k) => k.trim()).filter(Boolean)
    : Array.isArray(appKeysRaw) ? appKeysRaw : [];

  const backendUrl = process.env.STRAPI_ADMIN_BACKEND_URL || env('STRAPI_ADMIN_BACKEND_URL', '');
  const url = backendUrl && /^https?:\/\//i.test(backendUrl) ? backendUrl : 'http://localhost:1337';

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    url,
    app: {
      keys: appKeys.length >= 1 ? appKeys : ['toBeModified'],
    },
  };
};
