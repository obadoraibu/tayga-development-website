# Быстрое исправление проблемы с Hero секцией

## Шаг 1: Проверьте Strapi

1. Откройте http://localhost:1337/admin
2. Перейдите в **Content Manager** → **Hero Section**
3. **ВАЖНО:** Убедитесь, что статус = **Published** (опубликовано)
4. Если статус = **Draft**, нажмите **"Save & Publish"**

## Шаг 2: Очистите кэш Next.js

```bash
cd frontend
rm -rf .next
```

## Шаг 3: Перезапустите dev-сервер

```bash
npm run dev
```

## Шаг 4: Проверьте API напрямую

Откройте в браузере:
```
http://localhost:1337/api/hero?populate[background_image]=*
```

Должен вернуться JSON. Проверьте:
- Есть ли поле `data`?
- Есть ли `data.attributes`?
- Заполнены ли поля `title`, `subtitle` и т.д.?

## Шаг 5: Проверьте консоль

1. Откройте сайт в браузере
2. Нажмите F12 (DevTools)
3. Перейдите на вкладку **Console**
4. Обновите страницу (F5)
5. Ищите сообщения:
   - "Raw Hero API response:" - показывает что пришло из Strapi
   - "Hero data extracted:" - показывает извлеченные данные
   - "Mapping Hero - title:" - показывает какой title используется

## Шаг 6: Проверьте терминал

В терминале где запущен `npm run dev` должны быть сообщения:
- "Hero from API:" - данные из API
- "Mapped Hero data:" - данные после маппинга

## Если все еще не работает:

1. **Проверьте переменные окружения:**
   ```bash
   cd frontend
   cat .env.local
   ```
   
   Должно быть:
   ```
   NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
   NEXT_PUBLIC_STRAPI_MEDIA_URL=http://localhost:1337
   ```

2. **Проверьте, что Strapi запущен:**
   ```bash
   curl http://localhost:1337/api/hero
   ```

3. **Попробуйте создать новую запись в Strapi:**
   - Удалите старую запись Hero Section
   - Создайте новую
   - Заполните все поля
   - Сохраните и опубликуйте

## Отладка в коде

Если нужно увидеть что именно приходит из Strapi, откройте:
- `frontend/src/lib/api.ts` - функция `getHero()`
- `frontend/src/lib/strapiHelpers.ts` - функция `mapStrapiHero()`

Там есть `console.log` которые покажут все данные.




