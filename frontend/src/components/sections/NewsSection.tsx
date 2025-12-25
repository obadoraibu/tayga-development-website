"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface NewsItem {
  id: string | number;
  date: string;
  title: string;
  preview: string;
  image: string;
}

interface NewsSectionProps {
  news?: NewsItem[];
}

export default function NewsSection({ news = [] }: NewsSectionProps) {
  // Используем только данные из Strapi
  const newsData = news.slice(0, 3);
  
  if (newsData.length === 0) {
    console.warn('[NewsSection] No news to display. Check Strapi connection and published news.');
  }
  return (
    <section className="py-24 container px-4 mx-auto">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-taiga-dark">Новости</h2>
        <Link href="/news" className="hidden md:flex items-center gap-2 text-taiga-base font-semibold hover:text-taiga-accent transition-colors">
          Все новости <ArrowRight size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {newsData.map((item, i) => (
          <motion.article 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer flex flex-col h-full"
          >
            <div className="overflow-hidden rounded-2xl mb-5 aspect-[16/10]">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="text-sm text-taiga-base/60 mb-2 font-medium">{item.date}</div>
            <h3 className="text-xl font-heading font-bold text-taiga-dark mb-3 group-hover:text-taiga-base transition-colors">
              {item.title}
            </h3>
            <p className="text-taiga-dark/60 text-sm mb-4 line-clamp-3">
              {item.preview}
            </p>
            <div className="mt-auto pt-4">
               <Link href={`/news/${item.id}`} className="text-taiga-dark underline decoration-taiga-accent decoration-2 underline-offset-4 font-semibold">
                 Читать далее
               </Link>
            </div>
          </motion.article>
        ))}
      </div>
      
      {/* Кнопка для мобильных */}
      <div className="mt-8 md:hidden">
        <Link href="/news" className="w-full py-3 rounded-xl border border-taiga-dark/10 flex justify-center items-center gap-2 font-semibold">
          Все новости <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

