// Вспомогательные функции для преобразования данных Strapi
import { getStrapiMedia } from "./api";
import { markdownToHtml } from "./markdownToHtml";

export function mapStrapiProject(projectData: any) {
  if (!projectData) {
    console.warn('[MAPPER] Project data is null');
    return null;
  }

  // В Strapi v5 структура плоская (без attributes), в v4 - вложенная
  const data = projectData.attributes || projectData;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[MAPPER] Raw project data:', JSON.stringify(projectData, null, 2));
  }
  
  // Обработка обложки - проверяем разные варианты структуры
  let coverImage = '';
  if (data.cover) {
    // Strapi v4 вложенная структура
    if (data.cover.data?.attributes?.url) {
      coverImage = getStrapiMedia(data.cover.data.attributes.url) || '';
    } else if (data.cover.data?.url) {
      coverImage = getStrapiMedia(data.cover.data.url) || '';
    } 
    // Strapi v5 плоская структура - проверяем url напрямую
    else if (data.cover.url) {
      coverImage = getStrapiMedia(data.cover.url) || '';
    } else if (data.cover.formats?.large?.url) {
      coverImage = getStrapiMedia(data.cover.formats.large.url) || '';
    } else if (data.cover.formats?.medium?.url) {
      coverImage = getStrapiMedia(data.cover.formats.medium.url) || '';
    } else if (data.cover.formats?.small?.url) {
      coverImage = getStrapiMedia(data.cover.formats.small.url) || '';
    }
    
    if (process.env.NODE_ENV === 'development') {
      if (!coverImage) {
        console.warn('[MAPPER] Cover image not found. Cover structure:', JSON.stringify(data.cover, null, 2));
      } else {
        console.log('[MAPPER] Cover image URL:', coverImage);
      }
    }
  }
  
  // Обработка галереи
  let gallery: string[] = [];
  if (data.images) {
    let imagesArray: any[] = [];
    
    // Определяем структуру данных
    if (data.images.data && Array.isArray(data.images.data)) {
      // Strapi v4: массив в data
      imagesArray = data.images.data;
    } else if (Array.isArray(data.images)) {
      // Strapi v5: плоский массив
      imagesArray = data.images;
    }
    
    // Обрабатываем каждое изображение
    gallery = imagesArray.map((img: any) => {
      let imageUrl = '';
      
      // Проверяем разные варианты структуры
      if (img.attributes?.url) {
        imageUrl = getStrapiMedia(img.attributes.url) || '';
      } else if (img.url) {
        imageUrl = getStrapiMedia(img.url) || '';
      } else if (img.formats?.large?.url) {
        imageUrl = getStrapiMedia(img.formats.large.url) || '';
      } else if (img.formats?.medium?.url) {
        imageUrl = getStrapiMedia(img.formats.medium.url) || '';
      } else if (img.formats?.small?.url) {
        imageUrl = getStrapiMedia(img.formats.small.url) || '';
      }
      
      if (process.env.NODE_ENV === 'development' && !imageUrl) {
        console.warn('[MAPPER] Gallery image not found. Image structure:', JSON.stringify(img, null, 2));
      }
      
      return imageUrl;
    }).filter(Boolean);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[MAPPER] Gallery images found:', gallery.length);
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[MAPPER] No images field in project data');
    }
  }
  
  // Обработка квартир
  let apartments: any[] = [];
  if (data.apartments?.data) {
    // Strapi v4: массив в data
    apartments = data.apartments.data.map(mapStrapiApartment).filter(Boolean);
  } else if (Array.isArray(data.apartments)) {
    // Strapi v5: плоский массив
    apartments = data.apartments.map(mapStrapiApartment).filter(Boolean);
  }
  
  // Обработка Rich Text описания
  // В Strapi v5 Rich Text может быть markdown-подобной строкой или HTML
  let descriptionHtml = '';
  if (data.description) {
    if (typeof data.description === 'string') {
      // Конвертируем markdown в HTML для сохранения форматирования
      descriptionHtml = markdownToHtml(data.description);
    } else {
      // Если это объект, конвертируем в строку и обрабатываем
      descriptionHtml = markdownToHtml(String(data.description));
    }
  }
  
  // Обработка преимуществ (JSON массив строк)
  let advantages: string[] = [];
  if (data.advantages) {
    if (Array.isArray(data.advantages)) {
      advantages = data.advantages.filter((item: any) => typeof item === 'string' && item.trim().length > 0);
    } else if (typeof data.advantages === 'string') {
      try {
        const parsed = JSON.parse(data.advantages);
        if (Array.isArray(parsed)) {
          advantages = parsed.filter((item: any) => typeof item === 'string' && item.trim().length > 0);
        }
      } catch (e) {
        // Если не JSON, игнорируем
        advantages = [];
      }
    }
  }
  
  const mapped = {
    id: projectData.id || projectData.documentId,
    slug: data.slug || '',
    title: data.title || '',
    description: descriptionHtml,
    advantages: advantages,
    address: data.address || '',
    deadline: data.deadline || null,
    floors: data.floors || null,
    image: coverImage,
    gallery: gallery,
    apartments: apartments,
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[MAPPER] Project mapped:', mapped.title, 'slug:', mapped.slug, 'apartments:', apartments.length, 'gallery:', gallery.length);
    console.log('[MAPPER] Cover image:', coverImage);
    if (!mapped.slug) {
      console.warn('[MAPPER] Project missing slug!', mapped);
    }
  }
  
  // Не возвращаем проекты без slug
  if (!mapped.slug) {
    console.warn('[MAPPER] Skipping project without slug:', mapped.title);
    return null;
  }
  
  return mapped;
}

export function mapStrapiApartment(aptData: any) {
  if (!aptData) {
    console.warn('[MAPPER] Apartment data is null');
    return null;
  }
  
  const attributes = aptData.attributes || aptData;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[MAPPER] Apartment raw data keys:', Object.keys(attributes));
    console.log('[MAPPER] Apartment has layout_image:', !!attributes.layout_image);
    console.log('[MAPPER] Apartment has gallery:', !!attributes.gallery);
    if (attributes.layout_image) {
      console.log('[MAPPER] layout_image structure:', JSON.stringify(attributes.layout_image, null, 2));
    }
    if (attributes.gallery) {
      console.log('[MAPPER] gallery structure:', JSON.stringify(attributes.gallery, null, 2));
    }
  }
  
  // Обработка изображения планировки - проверяем разные варианты структуры
  let layoutImage = '';
  if (attributes.layout_image) {
    // Strapi v4 структура: layout_image.data.attributes.url
    if (attributes.layout_image.data?.attributes?.url) {
      layoutImage = getStrapiMedia(attributes.layout_image.data.attributes.url) || '';
    }
    // Альтернативная структура: layout_image.data.url
    else if (attributes.layout_image.data?.url) {
      layoutImage = getStrapiMedia(attributes.layout_image.data.url) || '';
    }
    // Strapi v5 плоская структура: layout_image.url
    else if (attributes.layout_image.url) {
      layoutImage = getStrapiMedia(attributes.layout_image.url) || '';
    }
    // Форматы изображений
    else if (attributes.layout_image.formats?.large?.url) {
      layoutImage = getStrapiMedia(attributes.layout_image.formats.large.url) || '';
    }
    else if (attributes.layout_image.formats?.medium?.url) {
      layoutImage = getStrapiMedia(attributes.layout_image.formats.medium.url) || '';
    }
    else if (attributes.layout_image.formats?.small?.url) {
      layoutImage = getStrapiMedia(attributes.layout_image.formats.small.url) || '';
    }
    else if (attributes.layout_image.formats?.thumbnail?.url) {
      layoutImage = getStrapiMedia(attributes.layout_image.formats.thumbnail.url) || '';
    }
    
    if (process.env.NODE_ENV === 'development' && !layoutImage) {
      console.warn('[MAPPER] Apartment layout_image URL not found. Structure:', JSON.stringify(attributes.layout_image, null, 2));
    } else if (process.env.NODE_ENV === 'development' && layoutImage) {
      console.log('[MAPPER] Apartment layout_image URL:', layoutImage);
    }
  }
  
  // Обработка галереи изображений
  let gallery: string[] = [];
  if (attributes.gallery) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[MAPPER] Apartment gallery raw data:', JSON.stringify(attributes.gallery, null, 2));
    }
    
    let galleryArray: any[] = [];
    
    // Определяем структуру данных
    if (attributes.gallery.data && Array.isArray(attributes.gallery.data)) {
      // Strapi v4: массив в data
      galleryArray = attributes.gallery.data;
    } else if (Array.isArray(attributes.gallery)) {
      // Strapi v5: плоский массив
      galleryArray = attributes.gallery;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[MAPPER] Apartment gallery array length:', galleryArray.length);
    }
    
    // Обрабатываем каждое изображение
    gallery = galleryArray.map((img: any) => {
      let imageUrl = '';
      
      // Проверяем разные варианты структуры
      if (img.attributes?.url) {
        imageUrl = getStrapiMedia(img.attributes.url) || '';
      } else if (img.url) {
        imageUrl = getStrapiMedia(img.url) || '';
      } else if (img.formats?.large?.url) {
        imageUrl = getStrapiMedia(img.formats.large.url) || '';
      } else if (img.formats?.medium?.url) {
        imageUrl = getStrapiMedia(img.formats.medium.url) || '';
      } else if (img.formats?.small?.url) {
        imageUrl = getStrapiMedia(img.formats.small.url) || '';
      } else if (img.formats?.thumbnail?.url) {
        imageUrl = getStrapiMedia(img.formats.thumbnail.url) || '';
      }
      
      if (process.env.NODE_ENV === 'development' && !imageUrl) {
        console.warn('[MAPPER] Apartment gallery image URL not found. Image structure:', JSON.stringify(img, null, 2));
      }
      
      return imageUrl;
    }).filter(Boolean);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[MAPPER] Apartment gallery images found:', gallery.length);
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[MAPPER] Apartment has no gallery field');
    }
  }
  
  // Объединяем layout_image и gallery в один массив изображений
  const allImages = layoutImage ? [layoutImage, ...gallery] : gallery;
  
  // Обработка Rich Text описания
  let descriptionHtml = '';
  if (attributes.description) {
    if (typeof attributes.description === 'string') {
      descriptionHtml = markdownToHtml(attributes.description);
    } else {
      descriptionHtml = markdownToHtml(String(attributes.description));
    }
  }
  
  return {
    id: aptData.id || aptData.documentId,
    number: attributes.number,
    price: attributes.price,
    area: attributes.area,
    floor: attributes.floor,
    rooms: attributes.rooms,
    section: attributes.section,
    status: attributes.status,
    renovation: attributes.renovation || null,
    ceiling_height: attributes.ceiling_height || null,
    description: descriptionHtml,
    image: layoutImage, // Для обратной совместимости
    gallery: allImages, // Все изображения (layout + gallery)
  };
}

export function mapStrapiNews(newsData: any) {
  if (!newsData) {
    console.warn('[MAPPER] News data is null');
    return null;
  }
  
  const attributes = newsData.attributes || newsData;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[MAPPER] Mapping news item:', attributes?.title, 'Raw data:', JSON.stringify(newsData, null, 2));
  }
  
  // Форматируем дату
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  // Обработка изображения - проверяем разные варианты структуры
  let imageUrl = '';
  if (attributes.cover?.data?.attributes?.url) {
    // Стандартная структура: cover.data.attributes.url
    imageUrl = getStrapiMedia(attributes.cover.data.attributes.url) || '';
  } else if (attributes.cover?.data?.url) {
    // Альтернативная структура
    imageUrl = getStrapiMedia(attributes.cover.data.url) || '';
  } else if (attributes.cover?.attributes?.url) {
    imageUrl = getStrapiMedia(attributes.cover.attributes.url) || '';
  } else if (attributes.cover?.url) {
    imageUrl = getStrapiMedia(attributes.cover.url) || '';
  }
  
  if (!imageUrl) {
    console.warn('[MAPPER] News image not found for:', attributes?.title, 'cover structure:', JSON.stringify(attributes?.cover, null, 2));
  }
  
      const mapped = {
        id: newsData.id || newsData.documentId,
        title: attributes?.title || '',
        date: formatDate(attributes?.date) || attributes?.date || '',
        preview: attributes?.preview_text || '',
        content: attributes?.content || '',
        image: imageUrl || '',
        tag: attributes?.tag || 'Новости',
      };
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[MAPPER] Mapped news:', mapped.title, 'image:', mapped.image);
  }
  
  return mapped;
}

export function mapStrapiHero(heroData: any) {
  // Если данных нет, возвращаем null (компонент использует fallback)
  if (!heroData) {
    console.warn('[MAPPER] Hero data is null or undefined - component will use fallback');
    return null;
  }
  
  // Для single type в Strapi v5 структура: { id: 1, attributes: {...} }
  const attributes = heroData.attributes || heroData;
  
  // Отладка
  console.log('[MAPPER] === Mapping Hero ===');
  console.log('[MAPPER] Raw heroData:', JSON.stringify(heroData, null, 2));
  console.log('[MAPPER] Attributes:', JSON.stringify(attributes, null, 2));
  console.log('[MAPPER] Title from Strapi:', attributes?.title);
  console.log('[MAPPER] Subtitle from Strapi:', attributes?.subtitle);
  console.log('[MAPPER] Background image raw:', attributes?.background_image);
  
  // Обработка изображения - проверяем разные варианты структуры
  let backgroundImage = '/images/hero/Hero.png';
  if (attributes?.background_image?.data?.attributes?.url) {
    backgroundImage = getStrapiMedia(attributes.background_image.data.attributes.url) || backgroundImage;
  } else if (attributes?.background_image?.attributes?.url) {
    backgroundImage = getStrapiMedia(attributes.background_image.attributes.url) || backgroundImage;
  } else if (attributes?.background_image?.url) {
    backgroundImage = getStrapiMedia(attributes.background_image.url) || backgroundImage;
  }
  
  const mapped = {
    subtitle: attributes?.subtitle || 'Строительная компания',
    title: attributes?.title || 'Гармония природы и бетона',
    description: attributes?.description || '',
    button1_text: attributes?.button1_text || 'Выбрать квартиру',
    button1_link: attributes?.button1_link || '/#projects',
    button2_text: attributes?.button2_text || 'О проектах',
    button2_link: attributes?.button2_link || '/#projects',
    background_image: backgroundImage,
  };
  
  console.log('[MAPPER] Final mapped Hero:', JSON.stringify(mapped, null, 2));
  console.log('[MAPPER] === End Mapping ===');
  
  return mapped;
}

export function mapStrapiFooter(footerData: any) {
  const attributes = footerData?.attributes || footerData || {};
  return {
    description: attributes.description || '',
    address: attributes.address || 'г. Таежный, ул. Лесная, 1, офис 305',
    email: attributes.email || 'info@tayga-dev.ru',
    phone: attributes.phone || '+7 (999) 000-00-00',
    whatsapp_link: attributes.whatsapp_link || 'https://wa.me/79990000000',
    telegram_link: attributes.telegram_link || 'https://t.me/taygadev',
    social_text: attributes.social_text || 'Подпишитесь на наш канал, чтобы следить за ходом строительства.',
    copyright_text: attributes.copyright_text || 'Tayga Development. Все права защищены.',
    privacy_link: attributes.privacy_link || '/privacy',
    developer_name: attributes.developer_name || 'YOUR NAME',
    developer_link: attributes.developer_link || 'https://your-studio.com',
  };
}

export function mapStrapiContact(contactData: any) {
  const attributes = contactData?.attributes || contactData || {};
  return {
    title: attributes.title || 'Остались вопросы?',
    description: attributes.description || '',
    office_label: attributes.office_label || 'Офис продаж',
    office_address: attributes.office_address || 'г. Таежный, ул. Лесная, 1',
    phone_label: attributes.phone_label || 'Телефон',
    phone: attributes.phone || '+7 (999) 000-00-00',
    form_button_text: attributes.form_button_text || 'Получить консультацию',
    form_success_title: attributes.form_success_title || 'Заявка отправлена!',
    form_success_text: attributes.form_success_text || 'Мы скоро перезвоним вам.',
    privacy_text: attributes.privacy_text || 'Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности',
  };
}

export function mapStrapiAbout(aboutData: any) {
  if (!aboutData) {
    console.warn('[MAPPER] About data is null');
    // Возвращаем пустой объект вместо null, чтобы страница не была пустой
    return {
      title: '',
      description: '',
      mainImage: '',
      gallery: [],
      stats: [],
    };
  }
  
  // В Strapi v5 для single type структура может быть плоской или вложенной
  const attributes = aboutData.attributes || aboutData;
  
  // Если attributes пустой объект, все равно возвращаем результат
  if (!attributes || (typeof attributes === 'object' && Object.keys(attributes).length === 0)) {
    console.warn('[MAPPER] About attributes is empty');
    return {
      title: '',
      description: '',
      mainImage: '',
      gallery: [],
      stats: [],
    };
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[MAPPER] About raw data:', JSON.stringify(aboutData, null, 2));
    console.log('[MAPPER] About attributes keys:', Object.keys(attributes));
  }
  
  // Обработка главного изображения
  let mainImage = '';
  if (attributes.main_image) {
    if (attributes.main_image.data?.attributes?.url) {
      mainImage = getStrapiMedia(attributes.main_image.data.attributes.url) || '';
    } else if (attributes.main_image.data?.url) {
      mainImage = getStrapiMedia(attributes.main_image.data.url) || '';
    } else if (attributes.main_image.attributes?.url) {
      mainImage = getStrapiMedia(attributes.main_image.attributes.url) || '';
    } else if (attributes.main_image.url) {
      mainImage = getStrapiMedia(attributes.main_image.url) || '';
    } else if (attributes.main_image.formats?.large?.url) {
      mainImage = getStrapiMedia(attributes.main_image.formats.large.url) || '';
    } else if (attributes.main_image.formats?.medium?.url) {
      mainImage = getStrapiMedia(attributes.main_image.formats.medium.url) || '';
    }
    
    if (process.env.NODE_ENV === 'development') {
      if (!mainImage) {
        console.warn('[MAPPER] About main_image URL not found. Structure:', JSON.stringify(attributes.main_image, null, 2));
      } else {
        console.log('[MAPPER] About main_image URL:', mainImage);
      }
    }
  }
  
  // Обработка галереи
  let gallery: string[] = [];
  if (attributes.gallery) {
    let galleryArray: any[] = [];
    if (attributes.gallery.data && Array.isArray(attributes.gallery.data)) {
      galleryArray = attributes.gallery.data;
    } else if (Array.isArray(attributes.gallery)) {
      galleryArray = attributes.gallery;
    }
    
    gallery = galleryArray.map((img: any) => {
      let imageUrl = '';
      if (img.attributes?.url) {
        imageUrl = getStrapiMedia(img.attributes.url) || '';
      } else if (img.data?.attributes?.url) {
        imageUrl = getStrapiMedia(img.data.attributes.url) || '';
      } else if (img.url) {
        imageUrl = getStrapiMedia(img.url) || '';
      } else if (img.formats?.large?.url) {
        imageUrl = getStrapiMedia(img.formats.large.url) || '';
      } else if (img.formats?.medium?.url) {
        imageUrl = getStrapiMedia(img.formats.medium.url) || '';
      }
      
      if (process.env.NODE_ENV === 'development' && !imageUrl) {
        console.warn('[MAPPER] About gallery image URL not found. Image structure:', JSON.stringify(img, null, 2));
      }
      
      return imageUrl;
    }).filter(Boolean);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[MAPPER] About gallery images found:', gallery.length);
    }
  }
  
  // Обработка статистики (JSON)
  let stats: Array<{ value: string; label: string }> = [];
  if (attributes.stats) {
    if (Array.isArray(attributes.stats)) {
      stats = attributes.stats.filter((item: any) => item && typeof item === 'object' && item.value && item.label);
    } else if (typeof attributes.stats === 'string') {
      try {
        const parsed = JSON.parse(attributes.stats);
        if (Array.isArray(parsed)) {
          stats = parsed.filter((item: any) => item && typeof item === 'object' && item.value && item.label);
        }
      } catch (e) {
        console.warn('[MAPPER] Failed to parse stats JSON:', e);
        stats = [];
      }
    }
  }
  
  // Обработка Rich Text описания
  let descriptionHtml = '';
  if (attributes.description) {
    if (typeof attributes.description === 'string') {
      descriptionHtml = markdownToHtml(attributes.description);
    } else {
      descriptionHtml = markdownToHtml(String(attributes.description));
    }
  }
  
  const mapped = {
    title: attributes.title || '',
    description: descriptionHtml,
    mainImage: mainImage,
    gallery: gallery,
    stats: stats,
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[MAPPER] About mapped:', mapped.title, 'has description:', !!mapped.description, 'gallery:', gallery.length, 'stats:', stats.length);
  }
  
  return mapped;
}

export function mapStrapiPartnerPost(partnerPostData: any) {
  if (!partnerPostData) {
    console.warn('[MAPPER] Partner post data is null');
    return null;
  }
  
  const attributes = partnerPostData.attributes || partnerPostData;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[MAPPER] Mapping partner post:', attributes?.title, 'Raw data:', JSON.stringify(partnerPostData, null, 2));
  }
  
  // Форматируем дату
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  // Обработка изображения
  let imageUrl = '';
  if (attributes.cover?.data?.attributes?.url) {
    imageUrl = getStrapiMedia(attributes.cover.data.attributes.url) || '';
  } else if (attributes.cover?.data?.url) {
    imageUrl = getStrapiMedia(attributes.cover.data.url) || '';
  } else if (attributes.cover?.attributes?.url) {
    imageUrl = getStrapiMedia(attributes.cover.attributes.url) || '';
  } else if (attributes.cover?.url) {
    imageUrl = getStrapiMedia(attributes.cover.url) || '';
  }
  
  if (!imageUrl && attributes.cover) {
    console.warn('[MAPPER] Partner post image not found for:', attributes?.title, 'cover structure:', JSON.stringify(attributes?.cover, null, 2));
  }
  
  return {
    id: partnerPostData.id || partnerPostData.documentId,
    title: attributes.title || '',
    date: formatDate(attributes.date) || attributes.date || '',
    preview: attributes.preview_text || '',
    content: attributes.content || '',
    image: imageUrl || '',
  };
}

