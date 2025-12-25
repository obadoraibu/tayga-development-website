"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { Apartment } from "@/lib/mockData";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";

interface Props {
  apartment: Apartment;
  onClose: () => void;
  projectFloors?: number | null;
}

export default function ApartmentModal({ apartment, onClose, projectFloors }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const router = useRouter();

  // Форматирование цены
  const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU').format(price);
  
  const handleConsultation = () => {
    onClose();
    router.push('/#contacts');
  };

  // Блокировка скролла страницы
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  // Используем галерею из данных, если она есть, иначе используем layout_image
  const images = (apartment as any).gallery && (apartment as any).gallery.length > 0 
    ? (apartment as any).gallery 
    : apartment.image 
      ? [apartment.image] 
      : [];

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }
  };
  
  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
        {/* Затемнение фона */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-taiga-dark/60 backdrop-blur-sm"
        />

        {/* Контент модального окна */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
          style={images.length === 0 ? { maxWidth: '600px' } : {}}
        >
          {/* Кнопка закрытия (Мобильная + Десктоп) */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-white/50 hover:bg-white backdrop-blur p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>

          {/* ЛЕВАЯ ЧАСТЬ: Галерея */}
          {images.length > 0 && (
            <div className="w-full lg:w-3/5 bg-gray-100 relative group h-[40vh] lg:h-auto">
              <img
                src={images[currentImage]}
                alt={`View ${currentImage}`}
                className="w-full h-full object-contain lg:object-cover"
              />
              
              {/* Навигация слайдера - показываем только если больше 1 изображения */}
              {images.length > 1 && (
                <>
                  <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="p-2 bg-white/80 rounded-full hover:bg-white shadow-lg"><ChevronLeft /></button>
                    <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="p-2 bg-white/80 rounded-full hover:bg-white shadow-lg"><ChevronRight /></button>
                  </div>
                  
                  {/* Точки пагинации */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_: string, idx: number) => (
                      <div 
                        key={idx} 
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImage ? "bg-taiga-dark w-4" : "bg-taiga-dark/30"}`} 
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ПРАВАЯ ЧАСТЬ: Информация */}
          <div className={`w-full ${images.length > 0 ? 'lg:w-2/5' : 'lg:w-full'} p-6 md:p-10 overflow-y-auto bg-white flex flex-col`}>
            <div className="mb-6">
              <div className="text-sm text-gray-400 font-medium mb-1">
                Секция {apartment.section}
              </div>
              <h2 className="text-3xl font-heading font-bold text-taiga-dark mb-2">
                {apartment.rooms === 0 ? "Студия" : `${apartment.rooms}-комнатная`}, {apartment.area} м²
              </h2>
              {apartment.price ? (
                <div className="text-2xl font-bold text-taiga-base">
                  {formatPrice(apartment.price)} ₽
                </div>
              ) : (
                <div className="text-2xl font-bold text-taiga-base">
                  По запросу
                </div>
              )}
            </div>

            {/* Таблица характеристик */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-taiga-light rounded-xl">
                <div className="text-sm text-gray-500">Этаж</div>
                <div className="text-lg font-bold text-taiga-dark">{apartment.floor}{projectFloors ? ` из ${projectFloors}` : ''}</div>
              </div>
              <div className="p-4 bg-taiga-light rounded-xl">
                <div className="text-sm text-gray-500">Отделка</div>
                <div className="text-lg font-bold text-taiga-dark">
                  {(apartment as any).renovation === 'without_repair' ? 'Черновая' : 
                   (apartment as any).renovation === 'whitebox' ? 'White Box' : 
                   (apartment as any).renovation === 'full_repair' ? 'Готовый ремонт' : '-'}
                </div>
              </div>
              <div className="p-4 bg-taiga-light rounded-xl">
                <div className="text-sm text-gray-500">Номер</div>
                <div className="text-lg font-bold text-taiga-dark">№ {apartment.number}</div>
              </div>
              <div className="p-4 bg-taiga-light rounded-xl">
                <div className="text-sm text-gray-500">Высота потолков</div>
                <div className="text-lg font-bold text-taiga-dark">{(apartment as any).ceiling_height ? `${(apartment as any).ceiling_height} м` : '-'}</div>
              </div>
            </div>

            {/* Описание */}
            {(apartment as any).description && (
              <div className="mb-8">
                <h3 className="text-lg font-heading font-bold text-taiga-dark mb-3">Описание</h3>
                <div 
                  className="prose prose-sm text-taiga-dark/70 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: (apartment as any).description }}
                />
              </div>
            )}

            {/* Футер модалки */}
            <div className="mt-auto space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-center border-taiga-dark text-taiga-dark hover:text-taiga-dark"
                onClick={handleConsultation}
              >
                <Phone size={18} />
                Получить консультацию
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
  );
}

