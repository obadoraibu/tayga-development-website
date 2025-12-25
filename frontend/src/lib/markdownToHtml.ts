// Функция для конвертации markdown-подобного текста в HTML
// Обрабатывает заголовки, переносы строк, жирный текст и списки

export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';
  
  // Разбиваем на строки для обработки
  const lines = markdown.split('\n');
  const result: string[] = [];
  let inList = false;
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  
  const closeList = () => {
    if (inList && listItems.length > 0) {
      const tag = listType === 'ol' ? 'ol' : 'ul';
      result.push(`<${tag}>${listItems.join('')}</${tag}>`);
      listItems = [];
      inList = false;
      listType = null;
    }
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Пустая строка - закрываем список и начинаем новый параграф
    if (!line) {
      closeList();
      continue;
    }
    
    // Заголовки
    if (line.startsWith('### ')) {
      closeList();
      result.push(`<h3>${line.substring(4)}</h3>`);
      continue;
    }
    if (line.startsWith('## ')) {
      closeList();
      result.push(`<h2>${line.substring(3)}</h2>`);
      continue;
    }
    if (line.startsWith('# ')) {
      closeList();
      result.push(`<h1>${line.substring(2)}</h1>`);
      continue;
    }
    
    // Нумерованный список
    const numberedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (numberedMatch) {
      if (!inList || listType !== 'ol') {
        closeList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(`<li>${processInlineFormatting(numberedMatch[1])}</li>`);
      continue;
    }
    
    // Маркированный список
    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      if (!inList || listType !== 'ul') {
        closeList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(`<li>${processInlineFormatting(bulletMatch[1])}</li>`);
      continue;
    }
    
    // Обычный текст - параграф
    closeList();
    result.push(`<p>${processInlineFormatting(line)}</p>`);
  }
  
  // Закрываем последний список
  closeList();
  
  return result.join('');
}

// Обработка inline форматирования (жирный, курсив, ссылки)
function processInlineFormatting(text: string): string {
  let result = text;
  
  // Жирный текст
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__(.*?)__/g, '<strong>$1</strong>');
  
  // Курсив
  result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
  result = result.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Ссылки
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-taiga-base hover:text-taiga-accent underline">$1</a>');
  
  return result;
}

