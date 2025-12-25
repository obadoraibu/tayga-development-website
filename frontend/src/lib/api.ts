// src/lib/api.ts
import qs from "qs";

export function getStrapiURL(path = "") {
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"}${path}`;
}

export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  
  // Убеждаемся, что URL начинается с /
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  
  // ВАЖНО: Для изображений всегда используем внешний URL, который будет работать в браузере
  // На сервере (SSR) мы генерируем HTML для браузера, поэтому нужен URL, доступный из браузера
  let baseUrl = process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL;
  
  if (!baseUrl) {
    // Если переменная не установлена, используем localhost:1337
    // Это будет работать, когда frontend и backend на одной машине
    baseUrl = "http://localhost:1337";
  }
  
  // Если baseUrl содержит backend:1337 (внутренний Docker URL), заменяем на localhost
  // Это нужно, потому что браузер не может обратиться к backend:1337
  if (baseUrl.includes('backend:1337')) {
    baseUrl = baseUrl.replace('backend:1337', 'localhost:1337');
  }
  
  const fullUrl = `${baseUrl}${cleanUrl}`;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[getStrapiMedia] Converting:', url, 'to:', fullUrl);
  }
  
  return fullUrl;
}

interface UrlParamsObject {
  populate?: string | string[] | Record<string, any>;
  filters?: Record<string, any>;
  sort?: string | string[];
  [key: string]: any;
}

export async function fetchAPI(path: string, urlParamsObject: UrlParamsObject = {}, options: any = {}) {
  // Мержим дефолтные параметры с переданными
  const isPostRequest = (options.method || '').toUpperCase() === 'POST';
  const mergedOptions: any = {
    headers: {
      "Content-Type": "application/json",
    },
    // Отключаем кэш для разработки (в продакшене можно включить)
    cache: 'no-store' as RequestCache,
    ...options,
  };

  // Для POST запросов body уже должен быть в options
  // Для GET запросов строим query string
  let requestUrl = '';
  if (isPostRequest) {
    requestUrl = `${getStrapiURL(`/api${path}`)}`;
  } else {
    // Строим query string (например: ?populate=*)
    // Используем arrayFormat: 'brackets' для правильной сериализации вложенных объектов Strapi v5
    // Но только если это не простой populate: "*"
    let queryString = '';
    const hasNestedPopulate = urlParamsObject.populate && typeof urlParamsObject.populate === 'object' && !Array.isArray(urlParamsObject.populate);
    const hasFilters = urlParamsObject.filters && typeof urlParamsObject.filters === 'object';
    
    if (hasNestedPopulate || hasFilters) {
      // Сложный случай с вложенными объектами (populate или filters) - используем специальные опции
      queryString = qs.stringify(urlParamsObject, {
        encodeValuesOnly: true,
        arrayFormat: 'brackets',
      });
    } else {
      // Простой случай - используем стандартную сериализацию
      queryString = qs.stringify(urlParamsObject);
    }
    requestUrl = `${getStrapiURL(`/api${path}${queryString ? `?${queryString}` : ""}`)}`;
  }

  console.log('[API] Fetching:', requestUrl, isPostRequest ? '(POST)' : '(GET)');
  if (isPostRequest && mergedOptions.body) {
    console.log('[API] POST body:', mergedOptions.body);
  }
  
  try {
    const response = await fetch(requestUrl, mergedOptions);
    
    // Проверяем, есть ли контент для парсинга
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Если ответ не JSON, читаем как текст
      const text = await response.text();
      console.warn('[API] Non-JSON response:', text);
      data = { error: { message: text || response.statusText } };
    }

    if (!response.ok) {
      console.error(`[API] Strapi API Error (${response.status}):`, response.statusText, requestUrl);
      console.error(`[API] Error details:`, data);
      
      // Возвращаем объект с ошибкой вместо throw, чтобы вызывающий код мог обработать
      return {
        data: null,
        error: {
          status: response.status,
          message: data.error?.message || data.message || response.statusText,
          details: data.error || data
        }
      };
    }
    
    // Для POST запросов успешный ответ может не содержать data
    if (isPostRequest) {
      console.log('[API] POST response received:', data);
      return { data: data.data || data, error: null };
    }
    
    console.log('[API] Response received for:', requestUrl, 'Data count:', data?.data?.length || 'N/A');
    return data;
  } catch (error: any) {
    console.error('[API] Fetch error:', error);
    // Проверяем, является ли ошибка ошибкой подключения
    if (error.code === 'ECONNREFUSED' || error.message?.includes('fetch failed')) {
      console.warn(`[API] Strapi is not running or not accessible at ${requestUrl}`);
      console.warn(`[API] Make sure Strapi is running on ${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}`);
    }
    throw error;
  }
}

// Получение всех проектов
export async function getProjects() {
  try {
    const data = await fetchAPI("/projects", { 
      populate: {
        cover: true,
        images: true,
        apartments: {
          populate: {
            layout_image: true,
            gallery: true,
          },
        },
      },
      sort: ["createdAt:desc"]
    });
    if (process.env.NODE_ENV === 'development') {
      console.log('[API] Projects response count:', data?.data?.length || 0);
      if (data?.data?.length > 0) {
        console.log('[API] First project keys:', Object.keys(data.data[0]));
        console.log('[API] First project has cover:', !!data.data[0].cover);
        console.log('[API] First project has apartments:', !!data.data[0].apartments);
        if (data.data[0].apartments && data.data[0].apartments.length > 0) {
          const firstApt = data.data[0].apartments[0];
          console.log('[API] First apartment keys:', Object.keys(firstApt));
          console.log('[API] First apartment has layout_image:', !!firstApt.layout_image);
          console.log('[API] First apartment has gallery:', !!firstApt.gallery);
          if (firstApt.layout_image) {
            console.log('[API] First apartment layout_image type:', typeof firstApt.layout_image);
          }
          if (firstApt.gallery) {
            console.log('[API] First apartment gallery type:', typeof firstApt.gallery, Array.isArray(firstApt.gallery));
          }
        }
      }
    }
    return data.data || [];
  } catch (error) {
    console.error('[API] Error fetching projects:', error);
    return [];
  }
}

// Получение одного проекта по slug (с квартирами)
export async function getProjectBySlug(slug: string) {
  try {
    console.log('[API] Fetching project by slug:', slug);
    const data = await fetchAPI("/projects", {
      filters: { slug: slug },
      populate: {
        cover: true,
        images: true,
        apartments: {
          populate: {
            layout_image: true,
            gallery: true,
          },
        },
      },
    });
    console.log('[API] Project by slug response:', JSON.stringify(data, null, 2));
    console.log('[API] Found projects:', data?.data?.length || 0);
    
    if (!data?.data || data.data.length === 0) {
      console.warn('[API] No project found with slug:', slug);
      return null;
    }
    
    return data.data[0];
  } catch (error) {
    console.error('[API] Error fetching project by slug:', error);
    return null;
  }
}

// Получение всех новостей
export async function getNews() {
  try {
    const data = await fetchAPI("/newsitems", {
      populate: "*",
      sort: ["date:desc"], // Сортировка по дате (новые сначала)
    });
    
    console.log('[API] News response:', {
      hasData: !!data?.data,
      count: data?.data?.length || 0,
      error: data?.error,
      fullResponse: data
    });
    
    if (data?.error) {
      console.error('[API] News API returned error:', data.error);
      return [];
    }
    
    if (process.env.NODE_ENV === 'development' && data?.data?.length > 0) {
      console.log('[API] First news item:', JSON.stringify(data.data[0], null, 2));
    }
    
    return data?.data || [];
  } catch (error: any) {
    console.error('[API] Error fetching news:', error);
    if (error.message?.includes('ECONNREFUSED')) {
      console.warn('[API] Strapi is not running. Start it with: cd backend && npm run develop');
    }
    return [];
  }
}

// Получение одной новости по ID (поддерживает и id, и documentId)
export async function getNewsById(id: string) {
  try {
    console.log('[API] Fetching news by id:', id);
    
    // В Strapi v5 используем фильтр по id
    const numericId = parseInt(id);
    let data;
    
    if (!isNaN(numericId)) {
      // Используем фильтр по числовому id (правильный синтаксис для Strapi v5)
      const response = await fetchAPI("/newsitems", {
        filters: { 
          id: numericId
        },
        populate: "*",
      });
      
      if (response?.data && response.data.length > 0) {
        data = { data: response.data[0] };
        console.log('[API] Found news by numeric id:', numericId);
      }
    }
    
    // Если не нашли по числовому id, попробуем по documentId
    if (!data?.data) {
      const responseByDocId = await fetchAPI("/newsitems", {
        filters: { 
          documentId: id
        },
        populate: "*",
      });
      
      if (responseByDocId?.data && responseByDocId.data.length > 0) {
        data = { data: responseByDocId.data[0] };
        console.log('[API] Found news by documentId:', id);
      }
    }
    
    // Если все еще не нашли, попробуем прямой запрос
    if (!data?.data) {
      try {
        const directResponse = await fetchAPI(`/newsitems/${id}`, {
          populate: "*",
        });
        if (directResponse?.data) {
          data = directResponse;
          console.log('[API] Found news by direct fetch');
        }
      } catch (error) {
        console.log('[API] Direct fetch failed, id:', id);
      }
    }
    
    console.log('[API] News by id response:', JSON.stringify(data, null, 2));
    
    if (!data?.data) {
      console.warn('[API] No news found with id:', id);
      return null;
    }
    
    return data.data;
  } catch (error) {
    console.error('[API] Error fetching news by id:', error);
    return null;
  }
}

// Получение Hero секции (single type)
export async function getHero() {
  try {
    const response = await fetchAPI("/hero", {
      populate: {
        background_image: {
          fields: ['url', 'alternativeText'],
        },
      },
    });
    
    // Для single type в Strapi v5 структура: { data: { id, attributes: {...} } }
    // Или может быть просто { data: null } если не создано
    const heroData = response?.data;
    
    console.log('[API] Raw Hero API response:', JSON.stringify(response, null, 2));
    console.log('[API] Hero data extracted:', JSON.stringify(heroData, null, 2));
    
    return heroData;
  } catch (error) {
    console.error('[API] Error fetching Hero:', error);
    return null;
  }
}

// Получение Footer (single type)
export async function getFooter() {
  const data = await fetchAPI("/footer", {
    populate: "*",
  });
  return data.data;
}

// Получение Contact секции (single type)
export async function getContact() {
  const data = await fetchAPI("/contact", {
    populate: "*",
  });
  return data.data;
}

// Получение настроек сайта (single type)
export async function getSiteSettings() {
  const data = await fetchAPI("/sitesettings", {
    populate: "*",
  });
  return data.data;
}

// Получение данных "О нас"
export async function getAbout() {
  try {
    const response = await fetchAPI("/about", {
      populate: "*",
    });
    
    console.log('[API] About response:', {
      hasData: !!response?.data,
      hasError: !!response?.error,
      dataStructure: response?.data ? Object.keys(response.data) : 'no data',
      fullResponse: response
    });
    
    if (response?.error) {
      console.error('[API] About API returned error:', response.error);
      if (response.error.status === 403) {
        console.warn('[API] 403 Forbidden: Check Strapi API permissions for About single type');
        console.warn('[API] Go to Strapi Admin -> Settings -> Users & Permissions -> Roles -> Public -> About -> Enable "find"');
      }
      return null;
    }
    
    // Для single type в Strapi v5 структура: { data: { id, attributes: {...} } } или { data: {...} }
    return response?.data || null;
  } catch (error: any) {
    console.error('[API] Error fetching about:', error);
    if (error.message?.includes('ECONNREFUSED')) {
      console.warn('[API] Strapi is not running. Start it with: cd backend && npm run develop');
    }
    return null;
  }
}

// Получение всех постов для партнеров
export async function getPartnerPosts() {
  try {
    const data = await fetchAPI("/partnerposts", {
      populate: "*",
      sort: ["date:desc"],
    });
    
    console.log('[API] Partner posts response:', {
      hasData: !!data?.data,
      count: data?.data?.length || 0,
      error: data?.error,
      fullResponse: data
    });
    
    if (data?.error) {
      console.error('[API] Partner posts API returned error:', data.error);
      if (data.error.status === 403) {
        console.warn('[API] 403 Forbidden: Check Strapi API permissions for PartnerPost content type');
        console.warn('[API] Go to Strapi Admin -> Settings -> Users & Permissions -> Roles -> Public -> PartnerPost -> Enable "find" and "findOne"');
      }
      return [];
    }
    
    return data?.data || [];
  } catch (error: any) {
    console.error('[API] Error fetching partner posts:', error);
    if (error.message?.includes('ECONNREFUSED')) {
      console.warn('[API] Strapi is not running. Start it with: cd backend && npm run develop');
    }
    return [];
  }
}

// Получение одного поста для партнеров по ID (поддерживает и id, и documentId)
export async function getPartnerPostById(id: string | number) {
  try {
    console.log('[API] Fetching partner post by id:', id);
    
    // В Strapi v5 используем фильтр по id
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    let data: { data?: any; error?: any } | undefined;
    
    if (!isNaN(numericId)) {
      // Используем фильтр по числовому id (правильный синтаксис для Strapi v5)
      const response = await fetchAPI("/partnerposts", {
        filters: { 
          id: numericId
        },
        populate: "*",
      });
      
      if (response?.error) {
        console.error('[API] Partner post API returned error:', response.error);
        return null;
      }
      
      if (response?.data && response.data.length > 0) {
        data = { data: response.data[0] };
        console.log('[API] Found partner post by numeric id:', numericId);
      }
    }
    
    // Если не нашли по числовому id, попробуем по documentId
    if (!data?.data && typeof id === 'string') {
      const responseByDocId = await fetchAPI("/partnerposts", {
        filters: {
          documentId: id
        },
        populate: "*",
      });
      
      if (responseByDocId?.error) {
        console.error('[API] Partner post API returned error:', responseByDocId.error);
        return null;
      }
      
      if (responseByDocId?.data && responseByDocId.data.length > 0) {
        data = { data: responseByDocId.data[0] };
        console.log('[API] Found partner post by documentId:', id);
      }
    }
    
    if (!data?.data) {
      console.warn('[API] Partner post not found for id:', id);
      return null;
    }
    
    return data.data;
  } catch (error: any) {
    console.error('[API] Error fetching partner post by id:', error);
    if (error.message?.includes('ECONNREFUSED')) {
      console.warn('[API] Strapi is not running. Start it with: cd backend && npm run develop');
    }
    return null;
  }
}

