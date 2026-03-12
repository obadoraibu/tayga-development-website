# Файлы для деплоя на сервер

- **backend.env.example** — шаблон для `backend/.env` (секреты, БД).
- **frontend.env.production.example** — шаблон для `frontend/.env.production` (домен API и медиа).
- **nginx-tayga.conf** — конфиг Nginx (прокси на frontend:3000 и backend:1337).

Подробная инструкция: **[SERVER_DEPLOY.md](../SERVER_DEPLOY.md)** в корне проекта.

## Быстро

1. Скопировать и заполнить env-файлы (см. SERVER_DEPLOY.md).
2. Запустить: `docker compose up -d --build`.
3. Подключить Nginx (скопировать конфиг, заменить YOUR_DOMAIN, включить сайт).
4. При необходимости: SSL через `certbot --nginx -d ваш-домен.ru`.
