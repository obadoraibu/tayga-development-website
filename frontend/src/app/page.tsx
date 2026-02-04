import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ProjectsList from "@/components/sections/ProjectsList";
import NewsSection from "@/components/sections/NewsSection";
import ContactSection from "@/components/sections/ContactSection";
import { getProjects, getNews, getHero, getFooter, getContact } from "@/lib/api";
import { mapStrapiProject, mapStrapiNews, mapStrapiHero, mapStrapiFooter, mapStrapiContact } from "@/lib/strapiHelpers";

// Отключаем кэш для разработки (в продакшене установить 60)
export const revalidate = 0;

export default async function Home() {
  // Получаем данные из Strapi с fallback на mockData
  let projectsData = [];
  let newsData = [];
  let heroData = null;
  let footerData = null;
  let contactData = null;
  
  try {
    const strapiProjects = await getProjects();
    console.log('[SERVER] Projects from API:', strapiProjects?.length || 0, 'items');
    console.log('[SERVER] Raw projects data:', JSON.stringify(strapiProjects, null, 2));
    projectsData = strapiProjects.map(mapStrapiProject).filter(Boolean);
    console.log('[SERVER] Mapped projects:', projectsData?.length || 0, 'items');
    console.log('[SERVER] Mapped projects data:', JSON.stringify(projectsData, null, 2));
    
    const strapiNews = await getNews();
    console.log('[SERVER] News from API:', strapiNews?.length || 0, 'items');
    if (strapiNews && strapiNews.length > 0) {
      newsData = strapiNews.map(mapStrapiNews).filter(Boolean);
      console.log('[SERVER] Mapped news:', newsData?.length || 0, 'items');
    } else {
      console.warn('[SERVER] No news data from Strapi');
    }
    
    const strapiHero = await getHero();
    console.log('[SERVER] Hero from API:', JSON.stringify(strapiHero, null, 2));
    heroData = mapStrapiHero(strapiHero);
    console.log('[SERVER] Mapped Hero data:', JSON.stringify(heroData, null, 2));
    
    const strapiFooter = await getFooter();
    footerData = mapStrapiFooter(strapiFooter);
    
    const strapiContact = await getContact();
    contactData = mapStrapiContact(strapiContact);
  } catch (error) {
    // Не используем fallback на mockData - показываем пустой список
    console.error('[SERVER] Error fetching Strapi data:', error);
    console.error('[SERVER] Strapi connection failed. Make sure Strapi is running on http://localhost:1337');
    // projectsData остается пустым массивом
    // heroData остается null, компонент использует fallback
  }
  
  // Финальная проверка - выводим что передаем в компонент
  console.log('[SERVER] Final heroData before render:', heroData);

  return (
    <main className="min-h-screen bg-taiga-light">
      <Header phone={footerData?.phone ?? contactData?.phone} schedule={footerData?.schedule ?? contactData?.schedule} />
      <Hero data={heroData} />
      <ProjectsList projects={projectsData} />
      <NewsSection news={newsData} />
      <ContactSection data={contactData} />
      <Footer data={footerData} />
    </main>
  );
}

