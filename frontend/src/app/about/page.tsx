import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAbout } from "@/lib/api";
import { mapStrapiAbout } from "@/lib/strapiHelpers";
import { markdownToHtml } from "@/lib/markdownToHtml";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
  let aboutData = null;
  let about = null;

  try {
    aboutData = await getAbout();
    console.log('[About Page] Raw aboutData from API:', JSON.stringify(aboutData, null, 2));
    
    if (aboutData) {
      about = mapStrapiAbout(aboutData);
      console.log('[About Page] Mapped about data:', JSON.stringify(about, null, 2));
    } else {
      console.warn('[About Page] No about data received from API');
    }
  } catch (error) {
    console.error('[About Page] Error fetching about data:', error);
  }

  // Маппер всегда возвращает объект (не null), поэтому about всегда будет объектом
  // Используем данные из Strapi
  const finalData = about || {
    title: '',
    description: '',
    mainImage: '',
    gallery: [],
    stats: [],
  };
  
  if (!about) {
    console.warn('[About Page] No about data available from Strapi');
    console.warn('[About Page] Check: 1) Strapi is running, 2) About single type has data, 3) API permissions are set');
  }
  
  // Описание уже обработано в mapStrapiAbout (конвертировано из markdown в HTML)
  const descriptionHtml = finalData.description || '';
  
  console.log('[About Page] Final data to render:', {
    hasTitle: !!finalData.title,
    hasDescription: !!finalData.description,
    hasMainImage: !!finalData.mainImage,
    galleryCount: finalData.gallery?.length || 0,
    statsCount: finalData.stats?.length || 0,
    isFromStrapi: !!about
  });

  return (
    <main className="min-h-screen bg-taiga-light">
      {/* Темный хедер */}
      <div className="bg-taiga-dark pb-10 pt-6">
         <Header />
      </div>

      {/* Hero блок О компании */}
      <section className="bg-taiga-dark text-white pb-24 pt-10 rounded-b-[3rem] overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              {finalData.title && (
                <h1 className="text-5xl md:text-7xl font-heading font-bold mb-8 leading-none">
                  {finalData.title}
                </h1>
              )}
              {descriptionHtml && (
                <div 
                  className="text-lg text-white/70 leading-relaxed mb-10 prose prose-invert prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              )}
              
              {/* Статистика */}
              {finalData.stats && finalData.stats.length > 0 && (
                <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                  {finalData.stats.map((stat: any, i: number) => (
                    <div key={i}>
                      <div className="text-4xl font-heading font-bold text-taiga-accent mb-1">{stat.value}</div>
                      <div className="text-sm text-white/50 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {finalData.mainImage && (
              <div className="lg:w-1/2 relative">
                 <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                   <img src={finalData.mainImage} alt="About main" className="w-full h-full object-cover" />
                 </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Галерея "Наша жизнь" */}
      {finalData.gallery && finalData.gallery.length > 0 && (
        <section className="py-24 container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-taiga-dark mb-12 text-center">
            О нас
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {finalData.gallery.map((src: string, i: number) => (
              <div 
                key={i} 
                className={`rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ${i === 0 ? "md:col-span-2" : ""}`}
              >
                <img src={src} alt="Team" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}



