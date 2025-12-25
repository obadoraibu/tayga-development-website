import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowUpRight, Briefcase } from "lucide-react";
import { getPartnerPosts } from "@/lib/api";
import { mapStrapiPartnerPost } from "@/lib/strapiHelpers";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PartnersPage() {
  let partnerPostsData: any[] = [];
  let partnerPosts: any[] = [];

  try {
    partnerPostsData = await getPartnerPosts();
    partnerPosts = partnerPostsData.map(mapStrapiPartnerPost).filter(Boolean);
  } catch (error) {
    console.error('[Partners Page] Error fetching partner posts:', error);
  }

  return (
    <main className="min-h-screen bg-taiga-light flex flex-col">
      <div className="bg-taiga-dark pb-24 pt-32 rounded-b-[3rem]">
        <Header />
        <div className="container px-4 mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-taiga-accent px-4 py-2 rounded-full mb-6 backdrop-blur-md">
            <Briefcase size={18} />
            <span className="text-sm font-bold uppercase tracking-wider">B2B Portal</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            Для партнеров
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Информация для агентств недвижимости, подрядчиков и поставщиков. 
            Актуальные регламенты, тендеры и новости сотрудничества.
          </p>
        </div>
      </div>

      <div className="container px-4 mx-auto py-20 flex-grow">
        {partnerPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partnerPosts.map((post) => (
              <Link key={post.id} href={`/partners/${post.id}`} className="group bg-white rounded-3xl p-4 hover:shadow-xl transition-all duration-300 border border-gray-100">
                {post.image && (
                  <div className="relative overflow-hidden rounded-2xl aspect-[3/2] mb-5">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-lg text-xs font-bold text-taiga-dark">
                      {post.date}
                    </div>
                  </div>
                )}
                
                <h3 className="text-xl font-heading font-bold text-taiga-dark mb-3 group-hover:text-taiga-base transition-colors leading-tight">
                  {post.title}
                </h3>
                {post.preview && (
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                    {post.preview}
                  </p>
                )}
                
                <div className="flex items-center text-taiga-accent font-bold text-sm uppercase tracking-wider gap-2">
                  Подробнее <ArrowUpRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            Пока нет публикаций для партнеров
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}




