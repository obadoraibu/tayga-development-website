import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getNews } from "@/lib/api";
import { mapStrapiNews } from "@/lib/strapiHelpers";

export default async function NewsPage() {
  let allNews = [];
  
  try {
    const strapiNews = await getNews();
    allNews = strapiNews.map(mapStrapiNews).filter(Boolean);
  } catch (error) {
    // Не используем fallback - показываем пустой список
    console.error('[SERVER] Error fetching news:', error);
    console.error('[SERVER] Strapi connection failed. Make sure Strapi is running on http://localhost:1337');
    // allNews остается пустым массивом
  }
  return (
    <main className="min-h-screen bg-taiga-light flex flex-col">
      {/* Здесь Header должен быть темным (не прозрачным), так как нет Hero картинки.
        Можно передать пропс в Header или сделать подложку.
        Сделаем простую темную подложку под хедер.
      */}
      <div className="bg-taiga-dark pb-24 pt-32 rounded-b-[3rem]">
        <Header />
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            Новости компании
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Следите за ходом строительства, акциями и важными событиями из жизни наших проектов.
          </p>
        </div>
      </div>

      <div className="container px-4 mx-auto py-20 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {allNews.map((item: any) => (
            <Link key={item.id} href={`/news/${item.id}`} className="group block">
              <div className="relative overflow-hidden rounded-3xl aspect-[16/9] mb-6 shadow-sm">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-taiga-dark z-10">
                  {item.tag}
                </div>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-taiga-dark/0 group-hover:bg-taiga-dark/10 transition-colors duration-300" />
                
                {/* Круглая кнопка стрелки при ховере */}
                <div className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-taiga-dark opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                  <ArrowUpRight size={20} />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <span className="text-taiga-base/60 font-medium text-sm">{item.date}</span>
                <div className="h-px bg-taiga-dark/10 flex-grow" />
              </div>
              
              <h2 className="text-2xl font-heading font-bold text-taiga-dark group-hover:text-taiga-base transition-colors leading-tight">
                {item.title}
              </h2>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}

