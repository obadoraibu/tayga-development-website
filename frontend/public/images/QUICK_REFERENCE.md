# Быстрая шпаргалка по замене изображений

## Где что менять

### 1. Hero (Главный экран)
**Файл:** `src/components/sections/Hero.tsx`  
**Строка:** `src="https://images.unsplash.com/..."`  
**Заменить на:** `src="/images/hero/main-hero.jpg"`

### 2. Проекты (mockData)
**Файл:** `src/lib/mockData.ts`  
**Найти:** `image: "https://images.unsplash.com/..."`  
**Заменить на:** `image: "/images/projects/[название-проекта]-cover.jpg"`

### 3. Галерея проекта
**Файл:** `src/components/sections/ProjectGallery.tsx`  
**Найти:** `const images = [...]`  
**Заменить на:**
```tsx
const images = [
  "/images/gallery/facade-1.jpg",
  "/images/gallery/hall-1.jpg",
  "/images/gallery/courtyard-1.jpg",
  "/images/gallery/interior-1.jpg",
];
```

### 4. Планировки квартир
**Файл:** `src/lib/mockData.ts`  
**Найти:** `image: "/plans/..."`  
**Заменить на:** `image: "/images/apartments/[тип]-plan.jpg"`

### 5. Новости
**Файл:** `src/components/sections/NewsSection.tsx`  
**Найти:** `image: "https://images.unsplash.com/..."`  
**Заменить на:** `image: "/images/news/news-[номер].jpg"`

## Формат путей

Все пути должны начинаться с `/images/` (Next.js автоматически берет из `public/`)

✅ Правильно: `/images/hero/main-hero.jpg`  
❌ Неправильно: `./images/hero/main-hero.jpg`  
❌ Неправильно: `public/images/hero/main-hero.jpg`





