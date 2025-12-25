# Пример обновления mockData.ts

Вот как должен выглядеть обновленный файл `src/lib/mockData.ts` с локальными путями:

```typescript
export const projectsData = [
  {
    slug: "kedrovy-park",
    title: "ЖК «Кедровый Парк»",
    description: "Жилой комплекс комфорт-класса в окружении векового леса.",
    // ЗАМЕНИТЬ: было "https://images.unsplash.com/..."
    image: "/images/projects/kedrovy-park-cover.jpg",
    deadline: "IV кв. 2024",
    address: "ул. Лесная, 45",
    apartments: [
      // ЗАМЕНИТЬ: было "/plans/1k.png"
      { id: 101, number: "45", price: 4500000, rooms: 1, area: 36.5, floor: 4, section: 1, status: "available", image: "/images/apartments/1k-plan.jpg" },
      { id: 102, number: "12", price: 3200000, rooms: 0, area: 24.0, floor: 2, section: 1, status: "booked", image: "/images/apartments/studio-plan.jpg" },
      { id: 103, number: "88", price: 8900000, rooms: 3, area: 85.2, floor: 8, section: 2, status: "available", image: "/images/apartments/3k-plan.jpg" },
      { id: 104, number: "34", price: 5600000, rooms: 2, area: 54.0, floor: 3, section: 1, status: "sold", image: "/images/apartments/2k-plan.jpg" },
      { id: 105, number: "35", price: 5750000, rooms: 2, area: 55.1, floor: 3, section: 1, status: "available", image: "/images/apartments/2k-plan.jpg" },
    ]
  },
  {
    slug: "hvoya",
    title: "ЖК «Хвоя»",
    description: "Современная архитектура и панорамные виды.",
    // ЗАМЕНИТЬ: было "https://images.unsplash.com/..."
    image: "/images/projects/hvoya-cover.jpg",
    deadline: "II кв. 2025",
    address: "р-н Зеленая Долина",
    apartments: [
      { id: 201, number: "5", price: 4100000, rooms: 1, area: 38.0, floor: 1, section: 1, status: "available", image: "/images/apartments/1k-plan.jpg" },
    ]
  }
];
```

## Необходимые файлы

После обновления кода добавьте следующие файлы:

### Проекты:
- `public/images/projects/kedrovy-park-cover.jpg`
- `public/images/projects/hvoya-cover.jpg`

### Планировки:
- `public/images/apartments/studio-plan.jpg` (студия)
- `public/images/apartments/1k-plan.jpg` (1-комнатная)
- `public/images/apartments/2k-plan.jpg` (2-комнатная)
- `public/images/apartments/3k-plan.jpg` (3-комнатная)




