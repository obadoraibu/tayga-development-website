export default ({ env }) => ({
  // Отключаем cloud-плагин: его виджет тянет контент извне и даёт "Couldn't load widget content"
  'strapi-cloud': {
    enabled: false,
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.mail.ru'),
        port: env.int('SMTP_PORT', 465),
        secure: env.bool('SMTP_SECURE', true),
        auth: {
          user: env('SMTP_USER'),
          pass: env('SMTP_PASS'),
        },
      },
      settings: {
        defaultFrom: env('MAIL_FROM', env('SMTP_USER')),
        defaultReplyTo: env('MAIL_REPLY_TO', env('SMTP_USER')),
      },
    },
  },
});
