# Директория изображений

Эта директория содержит все изображения для сайта. Структура организована по типам контента.

## Структура директорий

```
public/images/
├── hero/              # Изображения для Hero секции (главный экран)
├── projects/          # Обложки проектов (ЖК)
├── apartments/        # Планировки квартир
├── news/              # Изображения для новостей
└── gallery/           # Галерея проекта (рендеры, фото фасадов, интерьеров)
```

## Как заменить заглушки на реальные фото

### 1. Hero секция (Главный экран)

**Файл:** `src/components/sections/Hero.tsx`

**Текущий код:**
```tsx
<img 
  src="https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop" 
  alt="Фон"
  className="w-full h-full object-cover"
  loading="eager"
/>
```

**Замените на:**
```tsx
<img 
  src="/images/hero/main-hero.jpg" 
  alt="Гармония природы и города"
  className="w-full h-full object-cover"
  loading="eager"
/>
```

**Добавьте файл:** `public/images/hero/main-hero.jpg`

---

### 2. Карточки проектов

**Файл:** `src/components/sections/ProjectsList.tsx`

**Текущий код:**
```tsx
const projects = projectsData.map((project) => {
  // ...
  return {
    // ...
    image: project.image, // Это URL из mockData
  };
});
```

**Или в `src/lib/mockData.ts`:**
```tsx
{
  slug: "kedrovy-park",
  image: "https://images.unsplash.com/...", // Замените на путь
  // ...
}
```

**Замените на:**
```tsx
{
  slug: "kedrovy-park",
  image: "/images/projects/kedrovy-park-cover.jpg",
  // ...
}
```

**Добавьте файлы:**
- `public/images/projects/kedrovy-park-cover.jpg`
- `public/images/projects/hvoya-cover.jpg`
- и т.д.

---

### 3. Страница проекта (Hero проекта)

**Файл:** `src/app/projects/[slug]/page.tsx`

**Текущий код:**
```tsx
<img 
  src={project.image} 
  alt={project.title} 
  className="w-full h-full object-cover"
/>
```

Уже использует `project.image`, просто обновите данные в `mockData.ts` или используйте локальные пути.

---

### 4. Галерея проекта

**Файл:** `src/components/sections/ProjectGallery.tsx`

**Текущий код:**
```tsx
const images = [
  "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000",
  // ...
];
```

**Замените на:**
```tsx
const images = [
  "/images/gallery/facade-1.jpg",      // Фасад
  "/images/gallery/hall-1.jpg",        // Холл
  "/images/gallery/courtyard-1.jpg",   // Двор
  "/images/gallery/interior-1.jpg",    // Интерьер
];
```

**Добавьте файлы в:** `public/images/gallery/`

---

### 5. Планировки квартир

**Файл:** `src/lib/mockData.ts`

**Текущий код:**
```tsx
apartments: [
  { 
    id: 101, 
    // ...
    image: "/plans/1k.png", // Замените на реальный путь
  },
]
```

**Замените на:**
```tsx
apartments: [
  { 
    id: 101, 
    // ...
    image: "/images/apartments/studio-plan.jpg",
  },
  { 
    id: 102, 
    // ...
    image: "/images/apartments/1k-plan.jpg",
  },
  // ...
]
```

**Добавьте файлы в:** `public/images/apartments/`

**Рекомендуемые названия:**
- `studio-plan.jpg` - планировка студии
- `1k-plan.jpg` - планировка 1-комнатной
- `2k-plan.jpg` - планировка 2-комнатной
- `3k-plan.jpg` - планировка 3-комнатной
- `4k-plan.jpg` - планировка 4-комнатной

---

### 6. Новости

**Файл:** `src/components/sections/NewsSection.tsx`

**Текущий код:**
```tsx
const newsData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1626178793926-22b28830aa30?q=80&w=1000",
    // ...
  },
]
```

**Замените на:**
```tsx
const newsData = [
  {
    id: 1,
    image: "/images/news/news-1.jpg",
    // ...
  },
  {
    id: 2,
    image: "/images/news/news-2.jpg",
    // ...
  },
]
```

**Добавьте файлы в:** `public/images/news/`

---

## Рекомендации по изображениям

### Размеры и форматы

1. **Hero изображения:**
   - Размер: 1920x1080px (Full HD) или больше
   - Формат: JPG (для фото) или WebP (для оптимизации)
   - Вес: до 500KB (оптимизированные)

2. **Обложки проектов:**
   - Размер: 1200x1500px (вертикальный формат)
   - Формат: JPG
   - Вес: до 300KB

3. **Планировки квартир:**
   - Размер: 800x800px (квадрат) или 1200x800px
   - Формат: PNG (для прозрачности) или JPG
   - Вес: до 200KB

4. **Галерея проекта:**
   - Размер: 1920x1080px (16:9)
   - Формат: JPG
   - Вес: до 400KB

5. **Новости:**
   - Размер: 1200x675px (16:9)
   - Формат: JPG
   - Вес: до 250KB

### Оптимизация изображений

Перед добавлением изображений рекомендуется их оптимизировать:

1. **Онлайн инструменты:**
   - [TinyPNG](https://tinypng.com/) - сжатие PNG/JPG
   - [Squoosh](https://squoosh.app/) - оптимизация с предпросмотром
   - [ImageOptim](https://imageoptim.com/) - для Mac

2. **Конвертация в WebP:**
   - WebP формат может уменьшить размер файла на 25-35%
   - Используйте [Squoosh](https://squoosh.app/) для конвертации

### Пример структуры файлов

```
public/images/
├── hero/
│   └── main-hero.jpg
├── projects/
│   ├── kedrovy-park-cover.jpg
│   └── hvoya-cover.jpg
├── apartments/
│   ├── studio-plan.jpg
│   ├── 1k-plan.jpg
│   ├── 2k-plan.jpg
│   └── 3k-plan.jpg
├── news/
│   ├── news-1.jpg
│   ├── news-2.jpg
│   └── news-3.jpg
└── gallery/
    ├── facade-1.jpg
    ├── hall-1.jpg
    ├── courtyard-1.jpg
    └── interior-1.jpg
```

## Быстрая замена всех заглушек

1. Поместите все изображения в соответствующие папки
2. Обновите пути в следующих файлах:
   - `src/lib/mockData.ts` - проекты и квартиры
   - `src/components/sections/Hero.tsx` - главный экран
   - `src/components/sections/ProjectGallery.tsx` - галерея
   - `src/components/sections/NewsSection.tsx` - новости
   - `src/app/news/page.tsx` - страница новостей

3. Перезапустите dev-сервер:
```bash
npm run dev
```

## Примечание

После интеграции со Strapi все изображения будут загружаться через CMS, и локальные файлы можно будет удалить или использовать как резервные.

