# Настройка коллекции Lead в Strapi

## Проблема: Lead не отображается в Permissions

Если коллекция Lead не появляется в настройках прав доступа, выполните следующие шаги:

## Решение

### Шаг 1: Перезапустите Strapi

**Важно:** После создания новой коллекции Strapi нужно полностью перезапустить.

1. Остановите Strapi (Ctrl+C в терминале)
2. Запустите заново:
   ```bash
   cd backend
   npm run develop
   ```

### Шаг 2: Проверьте структуру файлов

Убедитесь, что все файлы созданы:

```
backend/src/api/lead/
  ├── content-types/
  │   └── lead/
  │       ├── schema.json
  │       └── lifecycles.ts
  ├── controllers/
  │   └── lead.ts
  ├── routes/
  │   └── lead.ts
  └── services/
      └── lead.ts
```

### Шаг 3: Проверьте в админ-панели

1. Откройте Strapi Admin: `http://localhost:1337/admin`
2. Перейдите: **Settings** → **Users & Permissions** → **Roles** → **Public**
3. Теперь должна появиться коллекция **Lead**

### Шаг 4: Настройте права доступа

1. В разделе **Lead** включите:
   - ✅ **create** (создание заявок) - **ОБЯЗАТЕЛЬНО**
   - ✅ **find** (просмотр заявок) - опционально, для админов
   - ✅ **findOne** (просмотр одной заявки) - опционально

2. Нажмите **Save**

### Шаг 5: Проверьте работу

После настройки прав попробуйте отправить форму на сайте. Заявка должна:
1. Сохраниться в Strapi (Content Manager → Leads)
2. Отправиться в Bitrix24 (если настроен)
3. Отправиться в M2Lab (если настроен)

## Альтернативный способ (если не помогло)

Если коллекция все еще не появляется, создайте её через Content-Type Builder:

1. Откройте Strapi Admin
2. Перейдите: **Content-Type Builder**
3. Нажмите **Create new collection type**
4. Название: **Lead**
5. Добавьте поля:
   - `name` (Text → Short text) - Required
   - `phone` (Text → Short text) - Required
   - `message` (Text → Long text) - Optional
   - `source` (Text → Short text) - Optional
6. Сохраните
7. Перезапустите Strapi

**Внимание:** Если создаете через Content-Type Builder, файл `lifecycles.ts` нужно будет добавить вручную в папку `content-types/lead/`.

## Проверка через API

Проверьте, что API работает:

```bash
curl -X POST http://localhost:1337/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Test",
      "phone": "+79991234567",
      "source": "Test"
    }
  }'
```

Если получите ответ с данными созданной заявки - все работает!

