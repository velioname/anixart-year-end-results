import { Profile } from './api';

export function calculateHours(watchedTimeMinutes: number): number {
  return Math.round(watchedTimeMinutes / 60);
}

export function calculateDays(watchedTimeMinutes: number): number {
  return Math.round(watchedTimeMinutes / 60 / 24);
}

export function calculateAveragePerDay(
  watchedTimeMinutes: number,
  daysSinceRegistration: number
): number {
  if (daysSinceRegistration === 0) return 0;
  return Math.round((watchedTimeMinutes / 60) / daysSinceRegistration * 10) / 10;
}

export function getDaysSinceRegistration(registerDate: number): number {
  const now = Date.now();
  const registered = registerDate * 1000; // timestamp в секундах
  const diffTime = Math.abs(now - registered);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getYearFromDate(timestamp: number): number {
  return new Date(timestamp * 1000).getFullYear();
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getTopReleaseFromHistory(history: any[]): any | null {
  if (!history || history.length === 0) return null;
  
  // Группируем по релизам и считаем количество просмотров
  const releaseCounts = new Map<number, { release: any; count: number }>();
  
  history.forEach((item) => {
    // Используем release.id если есть, иначе item.id
    const releaseId = item.release?.id || item.id;
    if (releaseId) {
      const existing = releaseCounts.get(releaseId);
      if (existing) {
        existing.count++;
      } else {
        // Используем release если есть, иначе сам item
        const releaseData = item.release || item;
        releaseCounts.set(releaseId, { release: releaseData, count: 1 });
      }
    }
  });

  // Находим релиз с максимальным количеством просмотров
  let topRelease = null;
  let maxCount = 0;

  releaseCounts.forEach((value) => {
    if (value.count > maxCount) {
      maxCount = value.count;
      topRelease = value.release;
    }
  });

  return topRelease;
}

export function getLastWatched(history: any[]): any | null {
  if (!history || history.length === 0) return null;
  
  // Находим самый последний просмотр по last_view_timestamp
  const sorted = [...history].sort((a, b) => {
    const timestampA = a.last_view_timestamp || 0;
    const timestampB = b.last_view_timestamp || 0;
    return timestampB - timestampA;
  });

  const last = sorted[0];
  if (!last) return null;

  // Если есть release, используем его данные, иначе используем сам элемент
  if (last.release) {
    return {
      ...last.release,
      last_view_timestamp: last.last_view_timestamp,
      last_view_episode: last.last_view_episode,
    };
  }

  return last;
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function isInCurrentYear(timestamp: number): boolean {
  if (!timestamp) return false;
  const date = new Date(timestamp * 1000);
  return date.getFullYear() === getCurrentYear();
}

export function filterByCurrentYear<T extends { last_view_timestamp?: number; voted_at?: number }>(
  items: T[]
): T[] {
  const currentYear = getCurrentYear();
  return items.filter((item) => {
    const timestamp = item.last_view_timestamp || item.voted_at;
    if (!timestamp) return false;
    const date = new Date(timestamp * 1000);
    return date.getFullYear() === currentYear;
  });
}

