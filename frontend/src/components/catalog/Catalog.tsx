"use client";
import { useState, useMemo } from "react";
import { Apartment } from "@/lib/mockData";
import ApartmentCard from "./ApartmentCard";
import ApartmentModal from "./ApartmentModal"; // Импортируем модалку
import { motion, AnimatePresence } from "framer-motion";

interface CatalogProps {
  apartments: Apartment[];
  projectFloors?: number | null;
}

export default function Catalog({ apartments, projectFloors }: CatalogProps) {
  // Состояние для выбранной квартиры (для модалки)
  const [activeApartment, setActiveApartment] = useState<Apartment | null>(null);

  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000000]);
  const [selectedRenovation, setSelectedRenovation] = useState<string | null>(null);

  // Словарь для отображения типов отделки
  const renovationLabels: Record<string, string> = {
    without_repair: "Черновая",
    whitebox: "White Box",
    full_repair: "Готовый ремонт"
  };

  // Логика фильтрации
  const filteredApartments = useMemo(() => {
    return apartments.filter((apt) => {
      // Фильтр по комнатам (если выбраны, то ищем совпадение, иначе показываем все)
      const roomMatch = selectedRooms.length === 0 || selectedRooms.includes(apt.rooms);
      // Фильтр по цене (упрощенный)
      const priceMatch = apt.price >= priceRange[0] && apt.price <= priceRange[1];
      // Фильтр по отделке
      const renovationMatch = selectedRenovation === null || (apt as any).renovation === selectedRenovation;
      
      return roomMatch && priceMatch && renovationMatch;
    });
  }, [apartments, selectedRooms, priceRange, selectedRenovation]);

  // Хендлер для клика по кнопкам комнат
  const toggleRoom = (room: number) => {
    setSelectedRooms(prev => 
      prev.includes(room) ? prev.filter(r => r !== room) : [...prev, room]
    );
  };

  return (
    <div className="py-10 relative"> {/* relative нужен для позиционирования, но не sticky */}
      
      {/* --- Панель фильтров (ИСПРАВЛЕНО: убрали sticky) --- */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-10 flex flex-wrap gap-8 items-center justify-between">
        
        {/* Комнатность */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-400 font-medium ml-1">Комнатность</span>
          <div className="flex bg-taiga-light p-1 rounded-xl">
            {[0, 1, 2, 3].map((room) => (
              <button
                key={room}
                onClick={() => toggleRoom(room)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  selectedRooms.includes(room)
                    ? "bg-taiga-dark text-taiga-accent shadow-md"
                    : "text-taiga-dark hover:bg-white/50"
                }`}
              >
                {room === 0 ? "Студия" : `${room}к`}
              </button>
            ))}
          </div>
        </div>

        {/* Отделка */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-400 font-medium ml-1">Отделка</span>
          <div className="flex bg-taiga-light p-1 rounded-xl">
            <button
              onClick={() => setSelectedRenovation(null)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedRenovation === null
                  ? "bg-taiga-dark text-taiga-accent shadow-md"
                  : "text-taiga-dark hover:bg-white/50"
              }`}
            >
              Любая
            </button>
            {Object.entries(renovationLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedRenovation(key)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  selectedRenovation === key
                    ? "bg-taiga-dark text-taiga-accent shadow-md"
                    : "text-taiga-dark hover:bg-white/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Простой инпут цены (для минимализма) */}
        <div className="flex flex-col gap-2">
           <span className="text-sm text-gray-400 font-medium ml-1">Макс. стоимость</span>
           <div className="flex items-center gap-2">
             <input 
               type="range" 
               min="3000000" 
               max="15000000" 
               step="100000"
               value={priceRange[1]}
               onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
               className="w-48 h-2 bg-taiga-light rounded-lg appearance-none cursor-pointer accent-taiga-base"
             />
             <span className="font-heading font-bold text-taiga-dark min-w-[120px]">
               до {(priceRange[1] / 1000000).toFixed(1)} млн ₽
             </span>
           </div>
        </div>
        
        <div className="text-gray-400 text-sm">
          Найдено: <span className="text-taiga-dark font-bold">{filteredApartments.length}</span>
        </div>
      </div>

      {/* --- Сетка квартир --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredApartments.map((apt, index) => (
           <ApartmentCard 
             key={apt.id} 
             data={apt} 
             onOpen={() => setActiveApartment(apt)} // <-- Открываем модалку
             index={index}
             projectFloors={projectFloors}
           />
        ))}
      </div>

      {filteredApartments.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          К сожалению, по вашим параметрам ничего не найдено.
        </div>
      )}

      {/* --- Модальное окно --- */}
      <AnimatePresence>
        {activeApartment && (
          <ApartmentModal 
            apartment={activeApartment} 
            onClose={() => setActiveApartment(null)}
            projectFloors={projectFloors}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

