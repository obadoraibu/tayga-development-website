import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPartnerPostById } from "@/lib/api";
import { mapStrapiPartnerPost } from "@/lib/strapiHelpers";
import { markdownToHtml } from "@/lib/markdownToHtml";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PartnerPostPage({ params }: { params: { id: string } }) {
  let partnerPostData = null;
  let partnerPost = null;

  try {
    partnerPostData = await getPartnerPostById(params.id);
    if (partnerPostData) {
      partnerPost = mapStrapiPartnerPost(partnerPostData);
    }
  } catch (error) {
    console.error('[Partner Post Page] Error fetching partner post:', error);
  }

  if (!partnerPost) {
    notFound();
  }

  const contentHtml = typeof partnerPost.content === 'string' 
    ? await markdownToHtml(partnerPost.content) 
    : partnerPost.content;

  return (
    <main className="min-h-screen bg-taiga-light pb-20">
      <Header />
      <div className="pt-32 container px-4 mx-auto max-w-4xl">
        <Link href="/partners" className="inline-flex items-center gap-2 text-taiga-dark/50 hover:text-taiga-dark mb-8 transition-colors">
          <ArrowLeft size={20} /> Назад
        </Link>
        
        <span className="block text-taiga-base mb-4 font-medium">{partnerPost.date}</span>
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-taiga-dark mb-8 leading-tight">
          {partnerPost.title}
        </h1>
        
        {partnerPost.image && (
        <div className="rounded-3xl overflow-hidden mb-10 aspect-video">
           <img 
               src={partnerPost.image} 
             className="w-full h-full object-cover" 
               alt={partnerPost.title}
           />
        </div>
        )}

        <div 
          className="prose prose-lg text-taiga-dark/80 mb-20"
          dangerouslySetInnerHTML={{ __html: contentHtml || '' }}
        />
      </div>
      <Footer />
    </main>
  );
}

