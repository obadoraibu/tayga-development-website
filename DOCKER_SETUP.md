# Docker Setup для Tayga Development Website

## Быстрый старт

### 1. Подготовка переменных окружения

#### Backend (.env)
Создайте файл `backend/.env`:

```env
# Strapi
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt-here
ADMIN_JWT_SECRET=your-admin-jwt-secret-here
TRANSFER_TOKEN_SALT=your-transfer-token-salt-here
JWT_SECRET=your-jwt-secret-here

# Database (SQLite)
DATABASE_CLIENT=better-sqlite3
DATABASE_FILENAME=.tmp/data.db

# Bitrix24 (опционально)
BITRIX_WEBHOOK_URL=https://ваша_компания.bitrix24.ru/rest/1/ваш_код/crm.lead.add.json

# M2Lab (опционально)
M2LAB_API_URL=https://api.m2lab.ru/v1/leads
M2LAB_API_KEY=ваш_ключ_m2lab
```

**Важно:** Сгенерируйте секретные ключи:
```bash
openssl rand -base64 32  # для каждого ключа
```

#### Frontend (.env.production)
Создайте файл `frontend/.env.production`:

```env
NEXT_PUBLIC_STRAPI_API_URL=http://backend:1337
# Или для продакшена:
# NEXT_PUBLIC_STRAPI_API_URL=https://api.yourdomain.com
```

### 2. Миграция базы данных

#### Шаг 1: Экспорт данных из текущей БД

SQLite база данных находится в `backend/.tmp/data.db`. Просто скопируйте файл:

```bash
# Создайте директорию для данных
mkdir -p backend/data

# Скопируйте БД
cp backend/.tmp/data.db backend/data/data.db
```

**Альтернативный способ (если нужно экспортировать данные):**

```bash
cd backend
sqlite3 .tmp/data.db ".dump" > data_export.sql
```

#### Шаг 2: Копирование медиафайлов

```bash
# Убедитесь, что папка uploads существует
mkdir -p backend/public/uploads

# Если у вас есть загруженные файлы, скопируйте их
# cp -r backend/public/uploads/* backend/public/uploads/
```

### 3. Запуск через Docker

```bash
# Сборка и запуск
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down

# Остановка с удалением volumes (ОСТОРОЖНО: удалит данные!)
docker-compose down -v
```

### 4. Первый запуск

После первого запуска:

1. Откройте Strapi Admin: `http://localhost:1337/admin`
2. Создайте администратора
3. Настройте права доступа:
   - Settings → Users & Permissions → Roles → Public
   - Включите необходимые права для всех коллекций

### 5. Проверка работы

- Frontend: http://localhost:3000
- Backend API: http://localhost:1337/api
- Strapi Admin: http://localhost:1337/admin

## Структура volumes

Docker создает следующие volumes для сохранения данных:

- `./backend/.tmp` - временные файлы и БД SQLite
- `./backend/public/uploads` - загруженные медиафайлы
- `./backend/data` - резервная копия БД (опционально)

## Обновление

```bash
# Остановить контейнеры
docker-compose down

# Обновить код (git pull)

# Пересобрать и запустить
docker-compose up -d --build
```

## Бэкап базы данных

```bash
# Создать бэкап БД
docker exec tayga-backend sqlite3 /app/.tmp/data.db ".backup /app/data/backup_$(date +%Y%m%d_%H%M%S).db"

# Или скопировать файл БД
docker cp tayga-backend:/app/.tmp/data.db ./backups/data_$(date +%Y%m%d_%H%M%S).db
```

## Восстановление из бэкапа

```bash
# Остановить контейнер
docker-compose stop backend

# Скопировать бэкап
cp ./backups/data_YYYYMMDD_HHMMSS.db backend/.tmp/data.db

# Запустить снова
docker-compose start backend
```

## Troubleshooting

### Проблема: Порт уже занят

Измените порты в `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # frontend
  - "1338:1337"  # backend
```

### Проблема: Права доступа

```bash
# Исправить права на volumes
sudo chown -R $USER:$USER backend/.tmp backend/public/uploads backend/data
```

### Проблема: Контейнер не запускается

Проверьте логи:
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Проблема: База данных не работает

Убедитесь, что файл БД скопирован:
```bash
ls -la backend/.tmp/data.db
ls -la backend/data/data.db
```

## Production настройки

Для продакшена:

1. Используйте PostgreSQL вместо SQLite:
   - Обновите `backend/.env` с настройками PostgreSQL
   - Добавьте PostgreSQL сервис в `docker-compose.yml`

2. Настройте reverse proxy (nginx):
   - Создайте nginx конфигурацию
   - Настройте SSL сертификаты

3. Используйте секреты Docker:
   ```bash
   docker secret create strapi_app_keys ./secrets/app_keys.txt
   ```

4. Настройте мониторинг и логирование

## Пример docker-compose.prod.yml

```yaml
version: '3.8'

services:
  backend:
    # ... те же настройки
    environment:
      - NODE_ENV=production
      - DATABASE_CLIENT=postgres
      - DATABASE_HOST=postgres
      - DATABASE_PORT=5432
      - DATABASE_NAME=strapi
      - DATABASE_USERNAME=strapi
      - DATABASE_PASSWORD=${DATABASE_PASSWORD}
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=strapi
      - POSTGRES_USER=strapi
      - POSTGRES_PASSWORD=${DATABASE_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

