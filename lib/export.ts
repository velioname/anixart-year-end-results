import html2canvas from 'html2canvas';

export async function exportToPNG(element: HTMLElement, filename: string = 'anixart-year-wrapped.png'): Promise<void> {
  // Создаем контейнер для экспорта
  const exportContainer = document.createElement('div');
  exportContainer.style.position = 'fixed';
  exportContainer.style.top = '0';
  exportContainer.style.left = '0';
  exportContainer.style.width = '1080px';
  exportContainer.style.height = '1920px';
  exportContainer.style.zIndex = '99999';
  exportContainer.style.overflow = 'hidden';
  
  // Получаем цвет фона
  const computedStyle = window.getComputedStyle(element);
  const bodyStyle = window.getComputedStyle(document.body);
  let backgroundColor = computedStyle.backgroundColor;
  
  if (!backgroundColor || backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
    backgroundColor = bodyStyle.backgroundColor;
  }
  
  if (!backgroundColor || backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    backgroundColor = isDark ? '#121212' : '#ffffff';
  }
  
  exportContainer.style.backgroundColor = backgroundColor;
  
  // Клонируем элемент
  const clonedElement = element.cloneNode(true) as HTMLElement;
  
  // Удаляем footer и другие элементы, которые не должны быть в экспорте
  const footer = clonedElement.querySelector('footer');
  if (footer) footer.remove();
  
  const buttons = clonedElement.querySelectorAll('button, a[href], input, select, textarea');
  buttons.forEach(btn => {
    const el = btn as HTMLElement;
    el.style.display = 'none';
  });
  
  // Устанавливаем стили для клона
  clonedElement.style.width = '1080px';
  clonedElement.style.height = '1920px';
  clonedElement.style.position = 'relative';
  clonedElement.style.margin = '0';
  clonedElement.style.padding = '0';
  clonedElement.style.boxSizing = 'border-box';
  clonedElement.style.backgroundColor = backgroundColor;
  
  // Находим ScreenWrapper внутри клона и устанавливаем правильные размеры
  const screenWrapper = clonedElement.querySelector('[class*="ScreenContainer"]') as HTMLElement;
  if (screenWrapper) {
    screenWrapper.style.width = '100%';
    screenWrapper.style.height = '100%';
    screenWrapper.style.minHeight = '1920px';
    screenWrapper.style.padding = '40px';
    screenWrapper.style.boxSizing = 'border-box';
  }
  
  exportContainer.appendChild(clonedElement);
  document.body.appendChild(exportContainer);
  
  // Ждем загрузки всех изображений
  const images = clonedElement.querySelectorAll('img');
  const imagePromises = Array.from(images).map(img => {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
      setTimeout(resolve, 3000);
    });
  });
  
  await Promise.all(imagePromises);
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const canvas = await html2canvas(exportContainer, {
      width: 1080,
      height: 1920,
      scale: 2,
      useCORS: true,
      backgroundColor: backgroundColor,
      logging: false,
      allowTaint: false,
      foreignObjectRendering: true,
      imageTimeout: 15000,
      windowWidth: 1080,
      windowHeight: 1920,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Ошибка при экспорте PNG:', error);
    throw error;
  } finally {
    // Удаляем контейнер
    if (exportContainer.parentNode) {
      document.body.removeChild(exportContainer);
    }
  }
}

