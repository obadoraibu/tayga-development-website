#!/bin/sh
set -e

# Если БД существует в data/, но не в .tmp/, скопируем её
if [ -f "/app/data/data.db" ] && [ ! -f "/app/.tmp/data.db" ]; then
  echo "Copying database from /app/data/data.db to /app/.tmp/data.db"
  cp /app/data/data.db /app/.tmp/data.db
  chown strapi:nodejs /app/.tmp/data.db || true
fi

# Убеждаемся, что переменная DATABASE_CLIENT установлена
if [ -z "$DATABASE_CLIENT" ]; then
  export DATABASE_CLIENT=sqlite
fi

# Запускаем Strapi
exec "$@"

