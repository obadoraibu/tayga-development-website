// Утилита для преобразования данных из Strapi в формат компонентов
import { getStrapiMedia } from "./api";

export function mapStrapiProject(projectData: any) {
  if (!projectData) return null;

  return {
    id: projectData.id,
    slug: projectData.attributes.slug,
    title: projectData.attributes.title,
    description: projectData.attributes.description,
    address: projectData.attributes.address,
    deadline: projectData.attributes.deadline,
    image: getStrapiMedia(projectData.attributes.cover?.data?.attributes?.url) || '',
    apartments: projectData.attributes.apartments?.data?.map(mapStrapiApartment) || [],
  };
}

export function mapStrapiApartment(aptData: any) {
  return {
    id: aptData.id,
    number: aptData.attributes.number,
    price: aptData.attributes.price,
    area: aptData.attributes.area,
    floor: aptData.attributes.floor,
    rooms: aptData.attributes.rooms,
    section: aptData.attributes.section,
    status: aptData.attributes.status,
    image: getStrapiMedia(aptData.attributes.layout_image?.data?.attributes?.url) || '',
  };
}

export function mapStrapiNews(newsData: any) {
  return {
    id: newsData.id,
    title: newsData.attributes.title,
    date: newsData.attributes.date,
    preview: newsData.attributes.preview_text,
    content: newsData.attributes.content,
    image: getStrapiMedia(newsData.attributes.cover?.data?.attributes?.url) || '',
    tag: newsData.attributes.tag || 'Новости',
  };
}




