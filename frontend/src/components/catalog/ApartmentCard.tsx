"use client";
import { Apartment } from "@/lib/mockData";
import { ArrowUpRight, Maximize, Layers, Ruler } from "lucide-react";

interface Props {
  data: Apartment;
  onOpen: () => void;
  index?: number;
  projectFloors?: number | null;
}

export default function ApartmentCard({ data, onOpen, index = 0, projectFloors }: Props) {
  const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU').format(price);

  return (
    <div
      style={{ 
        animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
      }}
      // Делаем всю карточку кликабельной для удобства
      onClick={onOpen} 
      className="group bg-white rounded-[2rem] p-5 border border-gray-100 hover:border-taiga-accent/50 hover:shadow-2xl hover:shadow-taiga-dark/5 transition-shadow duration-300 flex flex-col h-full relative cursor-pointer"
    >
      {/* Бейджи статуса */}
      <div className="absolute top-5 left-5 z-10 flex gap-2">
        <div className="bg-taiga-dark text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          {data.rooms === 0 ? "Студия" : `${data.rooms}-комн`}
        </div>
        {data.status === 'booked' && (
          <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Бронь
          </div>
        )}
      </div>

      {/* Изображение планировки (с эффектом увеличения при наведении) */}
      {((data as any).gallery && (data as any).gallery.length > 0 ? (data as any).gallery[0] : data.image) && (
        <div className="relative aspect-square mb-6 flex items-center justify-center bg-taiga-gray/30 rounded-2xl overflow-hidden group-hover:bg-taiga-light transition-colors">
          <div className="w-3/4 h-3/4 bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110" 
               style={{ backgroundImage: `url(${(data as any).gallery && (data as any).gallery.length > 0 ? (data as any).gallery[0] : data.image})` }}
          />
        </div>
      )}

      {/* Заголовок */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-lg font-heading font-bold text-taiga-dark">Квартира {data.number}</h3>
          <p className="text-sm text-gray-400">Секция {data.section}</p>
        </div>
      </div>

      {/* Характеристики (Сетка) */}
      <div className="grid grid-cols-3 gap-2 mb-6 border-y border-gray-100 py-4">
        <div className="text-center">
          <div className="flex justify-center text-taiga-accent mb-1"><Maximize size={16}/></div>
          <div className="text-sm font-bold text-taiga-dark">{data.area}</div>
          <div className="text-[10px] text-gray-400">м²</div>
        </div>
        <div className="text-center border-l border-gray-100">
          <div className="flex justify-center text-taiga-accent mb-1"><Layers size={16}/></div>
          <div className="text-sm font-bold text-taiga-dark">{data.floor} {projectFloors ? `из ${projectFloors}` : ''}</div>
          <div className="text-[10px] text-gray-400">этаж</div>
        </div>
        <div className="text-center border-l border-gray-100">
          <div className="flex justify-center text-taiga-accent mb-1"><Ruler size={16}/></div>
          <div className="text-sm font-bold text-taiga-dark">{(data as any).ceiling_height ? `${(data as any).ceiling_height}` : '-'}</div>
          <div className="text-[10px] text-gray-400">потолки</div>
        </div>
      </div>

      {/* Футер карточки: Цена и кнопка */}
      <div className="mt-auto flex items-center justify-between">
        {data.price ? (
          <div>
            <div className="text-xl font-heading font-bold text-taiga-dark">
              {formatPrice(data.price)} ₽
            </div>
          </div>
        ) : (
          <div>
            <div className="text-xl font-heading font-bold text-taiga-dark">
              По запросу
            </div>
          </div>
        )}
        
        {/* Кнопка теперь просто визуальный элемент, клик обрабатывается на всей карточке */}
        <div className="w-10 h-10 rounded-full bg-taiga-gray group-hover:bg-taiga-accent flex items-center justify-center transition-colors text-taiga-dark">
          <ArrowUpRight size={20} />
        </div>
      </div>
    </div>
  );
}

