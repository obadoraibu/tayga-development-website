"use client";
import { useRef } from "react";
import { motion } from "framer-motion";

interface ProjectGalleryProps {
  images?: string[];
}

export default function ProjectGallery({ images = [] }: ProjectGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Используем только изображения из Strapi, без fallback
  const galleryImages = images.filter(Boolean);
  
  // Если галерея пустая, не показываем секцию
  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white overflow-hidden" ref={containerRef}>
      <div className="container px-4 mx-auto mb-10 flex justify-between items-end">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-taiga-dark">
          Галерея проекта
        </h2>
        <div className="hidden md:flex gap-2 text-taiga-dark/40 text-sm">
          <span className="font-medium">Листайте</span> &rarr;
        </div>
      </div>

      {/* Горизонтальный скролл-контейнер */}
      <motion.div className="flex gap-6 px-4 md:px-[max(1rem,calc((100vw-1200px)/2))] overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 cursor-grab active:cursor-grabbing">
        {galleryImages.map((src, index) => (
          <motion.div 
            key={index}
            className="min-w-[85vw] md:min-w-[600px] lg:min-w-[800px] aspect-[16/9] rounded-3xl overflow-hidden snap-center relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <img 
              src={src} 
              alt={`Gallery ${index}`} 
              className="w-full h-full object-cover"
              draggable={false}
            />
            {/* Градиент снизу для текста (опционально) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

