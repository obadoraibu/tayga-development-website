export const projectsData = [
  {
    slug: "kedrovy-park",
    title: "ЖК «Ты и Я»",
    description: "Жилой комплекс комфорт-класса в окружении векового леса.",
    image: "/images/projects/youandme1.PNG",
    deadline: "IV кв. 2024",
    address: "ул. Лесная, 45",
    apartments: [
      // Генерируем несколько квартир для теста
      { id: 101, number: "45", price: 4500000, rooms: 1, area: 36.5, floor: 4, section: 1, status: "available", image: "/images/apartments/apartment1.png" },
      { id: 102, number: "12", price: 3200000, rooms: 0, area: 24.0, floor: 2, section: 1, status: "booked", image: "/images/apartments/apartment1.png" },
      { id: 103, number: "88", price: 8900000, rooms: 3, area: 85.2, floor: 8, section: 2, status: "available", image: "/images/apartments/apartment1.png" },
      { id: 104, number: "34", price: 5600000, rooms: 2, area: 54.0, floor: 3, section: 1, status: "sold", image: "/images/apartments/apartment1.png" },
      { id: 105, number: "35", price: 5750000, rooms: 2, area: 55.1, floor: 3, section: 1, status: "available", image: "/images/apartments/apartment1.png" },
    ]
  },
  {
    slug: "hvoya",
    title: "ЖК «Гринпарк»",
    description: "Современная архитектура и панорамные виды.",
    image: "https://2che.ru/wp-content/uploads/2023/08/dji_0358-1-scaled-1-1024x576.jpg",
    deadline: "II кв. 2025",
    address: "р-н Зеленая Долина",
    apartments: [
      { id: 201, number: "5", price: 4100000, rooms: 1, area: 38.0, floor: 1, section: 1, status: "available", image: "/plans/1k.png" },
    ]
  },
  {
    slug: "hvoya",
    title: "ЖК «Хвоя»",
    description: "Современная архитектура и панорамные виды.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000",
    deadline: "II кв. 2025",
    address: "р-н Зеленая Долина",
    apartments: [
      { id: 201, number: "5", price: 4100000, rooms: 1, area: 38.0, floor: 1, section: 1, status: "available", image: "/plans/1k.png" },
    ]
  }
];

// Типы данных
export type Apartment = typeof projectsData[0]['apartments'][0];
export type Project = typeof projectsData[0];

