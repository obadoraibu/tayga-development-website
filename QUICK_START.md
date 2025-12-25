# Быстрый старт с Docker

## Шаг 1: Миграция базы данных

```bash
# Создайте директорию для данных
mkdir -p backend/data

# Скопируйте текущую БД
cp backend/.tmp/data.db backend/data/data.db

# Проверьте, что файл скопирован
ls -lh backend/data/data.db
```

## Шаг 2: Настройка переменных окружения

### Backend
Создайте `backend/.env`:

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt-here
ADMIN_JWT_SECRET=your-admin-jwt-secret-here
TRANSFER_TOKEN_SALT=your-transfer-token-salt-here
JWT_SECRET=your-jwt-secret-here
DATABASE_CLIENT=better-sqlite3
DATABASE_FILENAME=.tmp/data.db
```

**Генерация секретов:**
```bash
openssl rand -base64 32  # выполните 5 раз для каждого ключа
```

### Frontend
Создайте `frontend/.env.production`:

```env
NEXT_PUBLIC_STRAPI_API_URL=http://backend:1337
```

## Шаг 3: Запуск

```bash
# Сборка и запуск
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

## Шаг 4: Первый запуск

1. Откройте http://localhost:1337/admin
2. Создайте администратора
3. Настройте права доступа

## Готово! 🎉

- Frontend: http://localhost:3000
- Backend: http://localhost:1337
- Admin: http://localhost:1337/admin

Подробные инструкции в `DOCKER_SETUP.md` и `DATABASE_MIGRATION.md`


