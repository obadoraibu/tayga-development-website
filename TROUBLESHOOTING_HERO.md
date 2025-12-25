# Решение проблемы с Hero секцией

## Пошаговая диагностика

### 1. Проверьте терминал где запущен `npm run dev`

После обновления страницы должны появиться сообщения:
```
[SERVER] Hero from API: {...}
[SERVER] Mapped Hero data: {...}
[SERVER] Final heroData before render: {...}
```

**Если видите ошибки:**
- `Error fetching Strapi data:` - Strapi недоступен или неправильный URL
- `Hero data is null` - данные не приходят из Strapi

### 2. Проверьте Strapi напрямую

Откройте в браузере:
```
http://localhost:1337/api/hero?populate[background_image]=*
```

**Ожидаемый ответ:**
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Ваш заголовок",
      "subtitle": "Ваш подзаголовок",
      ...
    }
  }
}
```

**Если видите `{"data": null}`:**
- Запись не создана в Strapi
- Запись не опубликована (статус = Draft)

**Если видите ошибку 403:**
- Не настроены права доступа
- Settings → Users & Permissions → Roles → Public → Hero → find ✓

### 3. Проверьте консоль браузера (F12)

Должны быть сообщения:
- `Hero component received data: {...}`
- `Hero component using data: {...}`

**Если `data: null`:**
- Данные не приходят с сервера
- Проверьте терминал на ошибки

### 4. Быстрое решение

```bash
# 1. Остановите dev-сервер (Ctrl+C)
cd frontend
rm -rf .next
npm run dev

# 2. В Strapi Admin:
# - Откройте Hero Section
# - Убедитесь что статус = Published
# - Если Draft → Save & Publish

# 3. Обновите страницу сайта (Ctrl+Shift+R)
```

### 5. Если ничего не помогает

Проверьте что Strapi запущен:
```bash
cd backend
npm run develop
```

Проверьте переменные окружения:
```bash
cd frontend
cat .env.local
```

Должно быть:
```
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_MEDIA_URL=http://localhost:1337
```

## Структура данных Strapi Single Type

Для single type структура ответа:
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "...",
      "subtitle": "...",
      "background_image": {
        "data": {
          "attributes": {
            "url": "/uploads/..."
          }
        }
      }
    }
  }
}
```

Код автоматически извлекает `data.attributes` и маппит поля.




