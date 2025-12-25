import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getNewsById } from "@/lib/api";
import { mapStrapiNews } from "@/lib/strapiHelpers";
import { notFound } from "next/navigation";

// Отключаем статическую генерацию для динамических страниц
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NewsPage({ params }: { params: { id: string } }) {
  let newsItem = null;
  
  try {
    console.log('[SERVER] Fetching news for id:', params.id);
    const newsData = await getNewsById(params.id);
    console.log('[SERVER] News data from API for id:', params.id, JSON.stringify(newsData, null, 2));
    
    if (!newsData) {
      console.warn('[SERVER] No news found for id:', params.id);
      return notFound();
    }
    
    newsItem = mapStrapiNews(newsData);
    console.log('[SERVER] Mapped news item:', newsItem?.title, 'id:', newsItem?.id);
    
    if (!newsItem || !newsItem.id) {
      console.warn('[SERVER] News mapping failed for id:', params.id);
      return notFound();
    }
  } catch (error) {
    console.error('[SERVER] Error fetching news:', error);
    return notFound();
  }
  
  if (!newsItem) return notFound();
  
  return (
    <main className="min-h-screen bg-taiga-light pb-20">
      <Header />
      <div className="pt-32 container px-4 mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-taiga-dark/50 hover:text-taiga-dark mb-8 transition-colors">
          <ArrowLeft size={20} /> Назад
        </Link>
        
        <span className="block text-taiga-base mb-4 font-medium">{newsItem.date}</span>
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-taiga-dark mb-8 leading-tight">
          {newsItem.title}
        </h1>
        
        {newsItem.image && (
        <div className="rounded-3xl overflow-hidden mb-10 aspect-video">
           <img 
               src={newsItem.image} 
             className="w-full h-full object-cover" 
               alt={newsItem.title}
           />
        </div>
        )}

        <div 
          className="prose prose-lg text-taiga-dark/80 mb-20"
          dangerouslySetInnerHTML={{ __html: newsItem.content || '' }}
        />
      </div>
      <Footer />
    </main>
  );
}

