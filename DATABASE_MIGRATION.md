# Миграция базы данных SQLite

## Метод 1: Прямое копирование файла БД (Рекомендуется)

Это самый простой способ для SQLite.

### Шаг 1: Найдите файл базы данных

```bash
# Файл БД обычно находится здесь:
ls -la backend/.tmp/data.db
```

### Шаг 2: Создайте директорию для данных

```bash
mkdir -p backend/data
```

### Шаг 3: Скопируйте файл БД

```bash
# Скопируйте БД в директорию data
cp backend/.tmp/data.db backend/data/data.db

# Проверьте размер файла (должен быть > 0)
ls -lh backend/data/data.db
```

### Шаг 4: Обновите docker-compose.yml

Убедитесь, что volume для data настроен (уже есть в docker-compose.yml):

```yaml
volumes:
  - ./backend/data:/app/data
```

### Шаг 5: При первом запуске Docker

Если вы хотите использовать существующую БД:

```bash
# Остановите контейнеры (если запущены)
docker-compose down

# Скопируйте БД в .tmp (Docker создаст volume)
cp backend/data/data.db backend/.tmp/data.db

# Запустите контейнеры
docker-compose up -d
```

## Метод 2: Экспорт/Импорт через SQL

Если нужно перенести данные в другую БД (например, PostgreSQL):

### Шаг 1: Экспорт данных

```bash
cd backend

# Экспорт всей БД
sqlite3 .tmp/data.db ".dump" > data_export.sql

# Или экспорт только данных (без схемы)
sqlite3 .tmp/data.db ".mode insert" ".output data_insert.sql" ".dump"
```

### Шаг 2: Импорт в новую БД

Для PostgreSQL:

```bash
# Установите pgloader или используйте вручную
# Конвертация SQLite в PostgreSQL
pgloader sqlite://backend/.tmp/data.db postgresql://user:pass@localhost/strapi
```

Или вручную через psql:

```bash
# Создайте БД
createdb strapi

# Импортируйте (может потребоваться ручная правка SQL)
psql -d strapi -f data_export.sql
```

## Метод 3: Использование Strapi CLI (для миграции контента)

### Экспорт контента через Strapi

```bash
cd backend

# Экспорт всех данных
npm run strapi export -- --no-encrypt --file export.tar.gz
```

### Импорт контента

```bash
# На новом сервере
npm run strapi import -- --file export.tar.gz
```

## Проверка миграции

### Проверка данных в SQLite

```bash
# Подключитесь к БД
sqlite3 backend/.tmp/data.db

# Проверьте таблицы
.tables

# Проверьте количество записей
SELECT COUNT(*) FROM leads;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM apartments;
# и т.д.

# Выйдите
.quit
```

### Проверка через Strapi Admin

1. Откройте http://localhost:1337/admin
2. Проверьте все коллекции:
   - Projects
   - Apartments
   - News
   - Leads
   - и т.д.

## Бэкап перед миграцией

**ВАЖНО:** Всегда создавайте бэкап перед миграцией!

```bash
# Создайте директорию для бэкапов
mkdir -p backups

# Скопируйте БД
cp backend/.tmp/data.db backups/data_backup_$(date +%Y%m%d_%H%M%S).db

# Или создайте архив
tar -czf backups/strapi_backup_$(date +%Y%m%d_%H%M%S).tar.gz \
  backend/.tmp/data.db \
  backend/public/uploads
```

## Восстановление из бэкапа

```bash
# Остановите Strapi
docker-compose stop backend

# Восстановите БД
cp backups/data_backup_YYYYMMDD_HHMMSS.db backend/.tmp/data.db

# Запустите снова
docker-compose start backend
```

## Миграция медиафайлов

Медиафайлы (изображения) хранятся в `backend/public/uploads`:

```bash
# Скопируйте все загруженные файлы
cp -r backend/public/uploads/* /path/to/new/location/

# Или создайте архив
tar -czf uploads_backup.tar.gz backend/public/uploads/
```

## Автоматический бэкап (cron)

Создайте скрипт `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Бэкап БД
cp backend/.tmp/data.db $BACKUP_DIR/data_$DATE.db

# Бэкап uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz backend/public/uploads/

# Удалить старые бэкапы (старше 7 дней)
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

Добавьте в crontab:

```bash
# Ежедневный бэкап в 2:00
0 2 * * * /path/to/backup.sh
```

## Troubleshooting

### Проблема: БД повреждена

```bash
# Проверьте целостность
sqlite3 backend/.tmp/data.db "PRAGMA integrity_check;"

# Восстановите из бэкапа
```

### Проблема: Размер БД слишком большой

```bash
# Оптимизация БД
sqlite3 backend/.tmp/data.db "VACUUM;"

# Создайте новый файл
sqlite3 backend/.tmp/data.db "VACUUM INTO optimized.db;"
mv optimized.db backend/.tmp/data.db
```

### Проблема: Права доступа

```bash
# Исправьте права
chmod 644 backend/.tmp/data.db
chown $USER:$USER backend/.tmp/data.db
```

