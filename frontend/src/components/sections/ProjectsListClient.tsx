"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface Project {
  slug: string;
  title: string;
  location: string;
  date: string;
  image: string;
  price: string;
}

interface ProjectsListClientProps {
  projects: Project[];
}

export default function ProjectsListClient({ projects }: ProjectsListClientProps) {
  return (
    <section className="py-24 bg-taiga-light" id="projects">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h3 className="text-taiga-base uppercase tracking-widest font-semibold mb-2">Наши объекты</h3>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-taiga-dark">Жилые Комплексы</h2>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-taiga-dark/60">Строим для жизни,<br/>вдохновляясь природой.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Link key={project.slug} href={`/projects/${project.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="group cursor-pointer"
              >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-6">
                <div className="absolute inset-0 bg-taiga-dark/20 group-hover:bg-transparent transition-colors z-10" />
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="text-white" />
                </div>
                <div className="absolute bottom-4 left-4 z-20 bg-taiga-accent text-taiga-dark px-4 py-2 rounded-lg font-bold text-sm">
                  {project.date}
                </div>
              </div>

              <h3 className="text-2xl font-heading font-bold text-taiga-dark mb-1 group-hover:text-taiga-base transition-colors">
                {project.title}
              </h3>
              <p className="text-taiga-dark/50 mb-3">{project.location}</p>
              <div className="flex items-center justify-between border-t border-taiga-dark/10 pt-3">
                <span className="text-taiga-dark font-medium">Стоимость</span>
                <span className="text-xl font-bold text-taiga-base">{project.price}</span>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}




