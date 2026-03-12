# Деплой на удалённый сервер

Пошаговая настройка env, Docker и Nginx для работы проекта на сервере.

## Требования

- Сервер с Ubuntu 20.04+ (или другой Linux с Docker и Nginx)
- Домен, направленный на IP сервера (A-запись)
- Порты 80 и 443 открыты

---

## 1. Подготовка сервера

```bash
# Обновление и базовые пакеты
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl

# Docker и Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Выйдите и зайдите снова, чтобы применить группу docker
```

---

## 2. Клонирование проекта

```bash
cd /var/www  # или другая директория
sudo mkdir -p /var/www && sudo chown $USER:$USER /var/www
git clone <URL_ВАШЕГО_РЕПОЗИТОРИЯ> tayga-development-website
cd tayga-development-website
```

---

## 3. Переменные окружения

### Backend (`backend/.env`)

Создайте файл из шаблона и заполните своими значениями:

```bash
cp deploy/backend.env.example backend/.env
nano backend/.env
```

**Обязательно замените:**

| Переменная | Описание |
|------------|----------|
| `APP_KEYS` | 4 ключа через запятую: `openssl rand -base64 32` (4 раза) |
| `API_TOKEN_SALT` | `openssl rand -base64 32` |
| `ADMIN_JWT_SECRET` | `openssl rand -base64 32` |
| `TRANSFER_TOKEN_SALT` | `openssl rand -base64 32` |
| `JWT_SECRET` | `openssl rand -base64 32` |
| `ENCRYPTION_KEY` | `openssl rand -base64 32` |

Для SQLite оставьте `DATABASE_CLIENT=sqlite` и `DATABASE_FILENAME=.tmp/data.db`.

#### Почтовые уведомления (mail.ru)
Чтобы заявки с формы приходили на почту, добавьте в `backend/.env`:

```env
SMTP_HOST=smtp.mail.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=ваш_ящик@mail.ru
SMTP_PASS=пароль_или_app_password
MAIL_FROM=ваш_ящик@mail.ru
MAIL_REPLY_TO=ваш_ящик@mail.ru
MAIL_TO=куда_получать_заявки@mail.ru
```

Если включена 2FA в Mail.ru — используйте **пароль приложения**.

### Frontend (`frontend/.env.production`)

Создайте файл из шаблона и подставьте **ваш домен** (без слэша в конце):

```bash
cp deploy/frontend.env.production.example frontend/.env.production
nano frontend/.env.production
```

Пример для домена `tayga-dev.ru`:

```env
NEXT_PUBLIC_STRAPI_API_URL=https://tayga-dev.ru
NEXT_PUBLIC_STRAPI_MEDIA_URL=https://tayga-dev.ru
```

**Важно:** используется один домен: и сайт, и API (nginx проксирует `/api` и `/uploads` на Strapi).

---

## 4. Данные Strapi (если переносите с другого сервера)

- Скопируйте базу: `backend/.tmp/data.db` или `backend/data/data.db` в ту же структуру на сервере.
- Скопируйте загрузки: `backend/public/uploads/` на сервер.

```bash
# На сервере создайте директории
mkdir -p backend/.tmp backend/public/uploads backend/data
# Затем залейте data.db в backend/.tmp/ и файлы в backend/public/uploads/
```

---

## 5. Запуск Docker

```bash
docker compose up -d --build
```

Проверка:

```bash
docker compose ps
curl -s http://127.0.0.1:3000 | head -5
curl -s http://127.0.0.1:1337/_health
```

Сайт и API пока доступны только по localhost (порты 3000 и 1337).

---

## 6. Nginx

### Установка Nginx (если ещё не установлен)

```bash
sudo apt install -y nginx
```

### Конфигурация сайта

Скопируйте конфиг и замените `YOUR_DOMAIN` на ваш домен:

```bash
sudo cp deploy/nginx-tayga.conf /etc/nginx/sites-available/tayga
sudo sed -i 's/YOUR_DOMAIN/ваш-домен.ru/g' /etc/nginx/sites-available/tayga
sudo ln -sf /etc/nginx/sites-available/tayga /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Пример для домена `tayga-dev.ru`:

```bash
sudo sed -i 's/YOUR_DOMAIN/tayga-dev.ru/g' /etc/nginx/sites-available/tayga
```

После этого сайт должен открываться по `http://ваш-домен.ru`.

---

## 7. SSL (HTTPS) с Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

Certbot сам добавит SSL в конфиг Nginx. Затем включите редирект HTTP → HTTPS в конфиге:

```bash
sudo nano /etc/nginx/sites-available/tayga
```

Раскомментируйте блок в начале файла (редирект с 80 на 443) и закомментируйте `listen 80` в основном блоке, затем раскомментируйте блок с `listen 443 ssl` и путями к сертификатам. Либо выполните:

```bash
sudo certbot --nginx -d ваш-домен.ru
```

и при необходимости вручную поправьте конфиг по комментариям в `deploy/nginx-tayga.conf`.

Проверка продления:

```bash
sudo certbot renew --dry-run
```

---

## 8. Next.js: домен для изображений (если используете Strapi uploads)

Если в Strapi загружаются изображения и они отдаются с вашего домена, добавьте этот домен в `frontend/next.config.js` в `images.remotePatterns`:

```js
{
  protocol: 'https',
  hostname: 'ваш-домен.ru',
  pathname: '/uploads/**',
},
```

После изменения конфига пересоберите фронтенд:

```bash
docker compose up -d --build frontend
```

---

## 9. Итоговая проверка

| Что | URL |
|-----|-----|
| Сайт | https://ваш-домен.ru |
| Strapi Admin | https://ваш-домен.ru/admin |
| API | https://ваш-домен.ru/api/... |
| Медиа | https://ваш-домен.ru/uploads/... |

---

## Полезные команды

```bash
# Логи
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend

# Перезапуск после смены .env
docker compose down && docker compose up -d --build

# Остановка
docker compose down
```

---

## Частые проблемы

**Сайт открывается, но нет данных / ошибки API**  
- Проверьте `frontend/.env.production`: `NEXT_PUBLIC_STRAPI_API_URL` и `NEXT_PUBLIC_STRAPI_MEDIA_URL` должны быть `https://ваш-домен.ru` (без слэша в конце).
- После смены `.env.production` пересоберите: `docker compose up -d --build frontend`.

**Изображения не грузятся (403/404)**  
- Добавьте домен в `frontend/next.config.js` → `images.remotePatterns` (см. п. 8) и пересоберите frontend.

**502 Bad Gateway**  
- Убедитесь, что контейнеры запущены: `docker compose ps`.
- Проверьте, что Nginx проксирует на `127.0.0.1:3000` и `127.0.0.1:1337`.

**Strapi Admin не открывается**  
- Зайдите по `https://ваш-домен.ru/admin` (тот же домен, что и сайт).

---

## Локальный запуск через Docker (без Nginx)

Если запускаете `docker compose up` на своей машине (без домена и Nginx):

- В `frontend/.env.production` укажите:
  ```env
  NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
  NEXT_PUBLIC_STRAPI_MEDIA_URL=http://localhost:1337
  ```
- Сайт: http://localhost:3000, Strapi Admin: http://localhost:1337/admin
