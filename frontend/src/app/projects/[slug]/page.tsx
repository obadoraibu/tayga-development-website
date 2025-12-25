import { getProjectBySlug, getProjects } from "@/lib/api";
import { mapStrapiProject } from "@/lib/strapiHelpers";
import Catalog from "@/components/catalog/Catalog";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProjectGallery from "@/components/sections/ProjectGallery";
import { notFound } from "next/navigation";
import { MapPin, Calendar, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

// Отключаем статическую генерацию для динамических страниц
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    console.log('[generateStaticParams] Projects from API:', projects?.length || 0);
    
    // В Strapi v5 структура плоская (без attributes)
    const slugs = projects
      .map((project: any) => {
        const data = project.attributes || project;
        const slug = data?.slug || project?.slug;
        if (!slug) {
          console.warn('[generateStaticParams] Project without slug:', project);
        }
        return slug;
      })
      .filter(Boolean)
      .map((slug: string) => ({ slug }));
    
    console.log('[generateStaticParams] Generated slugs:', slugs);
    return slugs;
  } catch (error) {
    console.error('[generateStaticParams] Error:', error);
    // Возвращаем пустой массив вместо fallback
    return [];
  }
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  let project;
  
  try {
    const projectData = await getProjectBySlug(params.slug);
    console.log('[SERVER] Project data from API for slug:', params.slug, JSON.stringify(projectData, null, 2));
    
    if (!projectData) {
      console.warn('[SERVER] No project found for slug:', params.slug);
      return notFound();
    }
    
    project = mapStrapiProject(projectData);
    console.log('[SERVER] Mapped project:', project?.title, 'slug:', project?.slug, 'apartments:', project?.apartments?.length || 0);
    console.log('[SERVER] Project image URL:', project?.image);
    console.log('[SERVER] Project has image:', !!project?.image);
    
    if (!project || !project.slug) {
      console.warn('[SERVER] Project mapping failed for slug:', params.slug);
      return notFound();
    }
  } catch (error) {
    console.error('[SERVER] Error fetching project:', error);
    return notFound();
  }
  
  if (!project) return notFound();

  return (
    <main className="min-h-screen bg-taiga-light">
      <Header />

      {/* 1. HERO SECTION */}
      {/* Убрали фиксированную высоту, добавили padding-bottom */}
      {project.image && (
        <section className="relative h-[80vh] min-h-[600px] flex items-end pb-24 rounded-b-[3rem] overflow-hidden bg-taiga-dark">
          <div className="absolute inset-0">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-taiga-dark via-taiga-dark/40 to-transparent" />
          </div>
          
          <div className="container relative z-10 px-4 text-white">
            <span className="inline-block px-3 py-1 border border-taiga-accent text-taiga-accent rounded-full text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">
              Жилой комплекс
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 max-w-4xl leading-none">
              {project.title}
            </h1>
            
            <div className="flex flex-col md:flex-row gap-6 md:items-center text-white/90 font-medium">
               {project.address && (
                 <>
                   <div className="flex items-center gap-2">
                     <MapPin className="text-taiga-accent" size={20}/>
                     {project.address}
                   </div>
                   {project.deadline && <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/30" />}
                 </>
               )}
               {project.deadline && (
                 <div className="flex items-center gap-2">
                   <Calendar className="text-taiga-accent" size={20}/>
                   Срок сдачи: {project.deadline}
                 </div>
               )}
            </div>
          </div>
        </section>
      )}

      {/* 2. DESCRIPTION & FEATURES (Разделяем фото и каталог) */}
      <section className="py-24 container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Описание */}
          <div>
            <h2 className="text-3xl font-heading font-bold text-taiga-dark mb-6">
              Особенности проекта
            </h2>
            <div className="prose prose-lg text-taiga-dark/70 font-light leading-relaxed">
              {project.description && (
                <div dangerouslySetInnerHTML={{ __html: project.description }} />
              )}
            </div>
            <div className="mt-8">
              <Button variant="outline" className="border-taiga-dark text-taiga-dark hover:text-taiga-dark">
                Скачать презентацию
              </Button>
            </div>
          </div>

          {/* Фишки (Иконки) */}
          {project.advantages && project.advantages.length > 0 && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-heading font-bold text-xl mb-6 text-taiga-dark">Преимущества</h3>
              <ul className="space-y-4">
                {project.advantages.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-taiga-accent shrink-0 mt-1" size={20} />
                    <span className="text-taiga-dark/80 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 3. GALLERY (Слайдер) */}
      {project.gallery && project.gallery.length > 0 && (
        <ProjectGallery images={project.gallery} />
      )}

      {/* 4. CATALOG (Фильтры + Квартиры) */}
      {/* Показываем каталог только если есть квартиры */}
      {project.apartments && project.apartments.length > 0 && (
        <section id="catalog" className="pt-24 pb-32 container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-taiga-dark mb-4">Выбор квартиры</h2>
            <p className="text-taiga-dark/60 max-w-xl mx-auto">
              Используйте фильтры, чтобы найти идеальную планировку под ваш образ жизни.
            </p>
          </div>
          
          {/* Сам компонент каталога с фильтрами */}
          <Catalog apartments={project.apartments} projectFloors={project.floors} />
        </section>
      )}

      <Footer />
    </main>
  );
}

