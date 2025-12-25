"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "../ui/Button";

interface HeroProps {
  data?: {
    subtitle?: string;
    title?: string;
    description?: string;
    button1_text?: string;
    button1_link?: string;
    button2_text?: string;
    button2_link?: string;
    background_image?: string;
  } | null;
}

export default function Hero({ data }: HeroProps) {
  // Отладка в браузере
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('Hero component received data:', data);
  }
  
  const hero = data || {
    subtitle: "Строительная компания",
    title: "Гармония природы и бетона",
    description: "Создаем жилые комплексы комфорт-класса в окружении леса, сохраняя городской комфорт и высокие стандарты качества.",
    button1_text: "Выбрать квартиру",
    button1_link: "/#projects",
    button2_text: "О проектах",
    button2_link: "/#projects",
    background_image: "/images/hero/Hero.png",
  };
  
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('Hero component using data:', hero);
  }

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-taiga-dark">
      {/* Фон */}
      <div className="absolute inset-0 z-0">
        <img 
          src={hero.background_image}
          alt="Фон"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-taiga-dark/60" /> {/* Затемнение */}
      </div>

      <div className="container relative z-10 px-4 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ willChange: 'opacity, transform' }}
        >
          <h2 className="text-taiga-accent font-medium tracking-[0.2em] uppercase mb-4">
            {hero.subtitle}
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-8 leading-tight">
            {hero.title}
          </h1>
          {hero.description && (
            <p className="text-gray-200 max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
              {hero.description}
            </p>
          )}
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href={hero.button1_link || '/#projects'}>
              <Button>{hero.button1_text}</Button>
            </Link>
            <Link href={hero.button2_link || '/#projects'}>
              <Button variant="outline">{hero.button2_text}</Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Скролл индикатор (Иконка мышки) */}
      {/* Добавлен класс hidden md:block — скрыто на мобильных, видно на десктопе */}
      <motion.div 
        className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

