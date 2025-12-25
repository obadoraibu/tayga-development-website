# Taiga Development Website

Современный сайт строительной компании на Next.js + Tailwind CSS + Strapi CMS.

## Технологии

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (анимации)
- **Lucide React** (иконки)
- **Strapi CMS** (управление контентом)

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env.local` в корне проекта:
```env
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_MEDIA_URL=http://localhost:1337
```

3. Запустите dev-сервер:
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Интеграция со Strapi

Подробные инструкции по настройке Strapi CMS и интеграции с фронтендом находятся в файле [STRAPI_INTEGRATION.md](./STRAPI_INTEGRATION.md).

### Быстрый старт:

1. Установите Strapi (в папке выше):
```bash
cd ..
npx create-strapi-app@latest tayga-backend
```

2. Создайте Content Types в Strapi: `Project`, `Apartment`, `News`
3. Настройте права доступа (Public -> find, findOne)
4. Заполните данные в Strapi
5. Запустите Strapi: `npm run develop` (в папке tayga-backend)
6. Запустите фронтенд: `npm run dev` (в папке frontend)

## Структура проекта

```
src/
  app/          # App Router страницы
  components/   # React компоненты
  lib/          # Утилиты (api.ts, strapiMapper.ts)
```

## Цветовая палитра

- `taiga-dark`: #143828 (темный лесной)
- `taiga-base`: #1F523D (базовый зеленый)
- `taiga-light`: #E6F0EB (светлый фон)
- `taiga-accent`: #D4F238 (лаймовый акцент)
- `taiga-gray`: #F3F4F6 (подложки)

## Шрифты

- **Inter** — для основного текста
- **Montserrat** — для заголовков

## Деплой

### Frontend (Vercel)
1. Залейте код на GitHub
2. Подключите репозиторий в Vercel
3. Добавьте переменные окружения:
   - `NEXT_PUBLIC_STRAPI_API_URL`
   - `NEXT_PUBLIC_STRAPI_MEDIA_URL`
4. Deploy

### Backend (Strapi)
См. инструкции в [STRAPI_INTEGRATION.md](./STRAPI_INTEGRATION.md)

