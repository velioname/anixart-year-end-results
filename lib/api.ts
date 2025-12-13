const API_BASE_URL = 'https://api.anixart.tv';

export interface SignInResponse {
  code: number;
  profile: {
    id: number;
    login: string;
    avatar?: string;
    [key: string]: any;
  };
  profileToken: {
    id: number;
    token: string;
  };
}

export interface ApiResponse<T> {
  code: number;
  [key: string]: any;
}

export interface PreferredItem {
  name: string;
  percentage: number;
}

export interface Badge {
  id: number;
  type: number;
  name: string;
  image_url?: string;
}

export interface Release {
  id: number;
  title_ru: string;
  title_original?: string;
  title_alt?: string;
  poster?: string;
  image?: string;
  genres?: string;
  year?: string;
  description?: string;
  rating?: number;
  grade?: number;
}

export function getPosterUrl(poster?: string, image?: string): string | undefined {
  // Если image уже полный URL, возвращаем как есть
  if (image) {
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    // Если image не содержит расширение, добавляем .jpg
    if (!image.includes('.')) {
      return `https://s.anixmirai.com/posters/${image}.jpg`;
    }
    return `https://s.anixmirai.com/posters/${image}`;
  }
  
  // Если poster уже полный URL, возвращаем как есть
  if (poster) {
    if (poster.startsWith('http://') || poster.startsWith('https://')) {
      return poster;
    }
    // Если poster не содержит расширение, добавляем .jpg
    if (!poster.includes('.')) {
      return `https://s.anixmirai.com/posters/${poster}.jpg`;
    }
    return `https://s.anixmirai.com/posters/${poster}`;
  }
  
  return undefined;
}

export interface HistoryItem {
  '@id'?: number;
  id: number;
  poster?: string;
  image?: string;
  title_ru: string;
  title_original?: string;
  genres?: string;
  year?: string;
  last_view_timestamp?: number;
  last_view_episode?: {
    position?: number;
    name?: string;
    release?: Release;
  };
  is_viewed?: boolean;
  // Поля из истории профиля
  release?: {
    id: number;
    poster?: string;
    image?: string;
    title_ru: string;
    [key: string]: any;
  };
}

export interface Vote {
  id: number;
  title_ru: string;
  title_original?: string;
  poster?: string;
  image?: string;
  genres?: string;
  my_vote?: number;
  voted_at?: number;
}

export interface WatchDynamics {
  id: number;
  day: number;
  count: number;
  timestamp: number;
}

export interface Profile {
  id: number;
  login: string;
  avatar?: string;
  badge?: Badge;
  watched_episode_count: number;
  watched_time: number; // в минутах
  completed_count: number;
  favorite_count: number;
  friend_count: number;
  comment_count: number;
  register_date: number; // timestamp
  last_activity_time: number; // timestamp
  history?: HistoryItem[];
  votes?: Vote[];
  watch_dynamics?: WatchDynamics[];
  preferred_genres?: PreferredItem[];
  preferred_audiences?: PreferredItem[];
  preferred_themes?: PreferredItem[];
}

export interface Collection {
  id: number;
  title: string;
  description?: string;
  release_count?: number;
}

export interface PageableResponse<T> {
  items: T[];
  total: number;
  page?: number;
}

class AnixartAPI {
  private token: string | null = null;
  private profileId: number | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('anixart_token', token);
      }
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('anixart_token');
        sessionStorage.removeItem('anixart_profile_id');
      }
      this.profileId = null;
    }
  }

  setProfileId(id: number | null) {
    this.profileId = id;
    if (id) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('anixart_profile_id', id.toString());
      }
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('anixart_profile_id');
      }
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('anixart_token');
    }
    return null;
  }

  getProfileId(): number | null {
    if (this.profileId) return this.profileId;
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('anixart_profile_id');
      return stored ? parseInt(stored, 10) : null;
    }
    return null;
  }

  async signIn(login: string, password: string): Promise<SignInResponse> {
    const formData = new URLSearchParams();
    formData.append('login', login);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/signIn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error('Ошибка авторизации');
    }

    const data: SignInResponse = await response.json();
    
    if (data.code !== 0) {
      throw new Error('Ошибка авторизации');
    }

    this.setToken(data.profileToken.token);
    this.setProfileId(data.profile.id);
    return data;
  }

  async getProfile(profileId?: number): Promise<Profile> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Токен не найден');
    }

    const id = profileId || this.getProfileId();
    if (!id) {
      throw new Error('ID профиля не найден');
    }

    const response = await fetch(`${API_BASE_URL}/profile/${id}?token=${token}`);
    
    if (!response.ok) {
      throw new Error('Ошибка получения профиля');
    }

    const data: ApiResponse<Profile> = await response.json();
    
    if (data.code !== 0) {
      throw new Error('Ошибка получения профиля');
    }

    return data.profile;
  }

  async getHistory(page: number = 1): Promise<PageableResponse<HistoryItem>> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Токен не найден');
    }

    const response = await fetch(`${API_BASE_URL}/history/${page}?token=${token}`);
    
    if (!response.ok) {
      throw new Error('Ошибка получения истории');
    }

    const data: any = await response.json();
    
    // Проверяем структуру ответа
    if (data.code !== undefined && data.code !== 0) {
      throw new Error('Ошибка получения истории');
    }

    // Если ответ обернут в code, возвращаем содержимое
    if (data.code !== undefined && data.items) {
      return data;
    }

    // Если ответ уже в формате PageableResponse
    if (data.items) {
      return data;
    }

    // Fallback - возвращаем как есть
    return data;
  }

  async getRelease(id: number): Promise<Release> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Токен не найден');
    }

    const response = await fetch(
      `${API_BASE_URL}/release/${id}?extended_mode=true&token=${token}`
    );
    
    if (!response.ok) {
      throw new Error('Ошибка получения релиза');
    }

    const data: any = await response.json();
    
    if (data.code !== 0) {
      throw new Error('Ошибка получения релиза');
    }

    // Возвращаем данные релиза из ответа
    return data.release || data;
  }

  async getRandomRelease(): Promise<Release> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Токен не найден');
    }

    const response = await fetch(`${API_BASE_URL}/release/random?token=${token}`);
    
    if (!response.ok) {
      throw new Error('Ошибка получения случайного релиза');
    }

    const data: any = await response.json();
    
    if (data.code !== 0) {
      throw new Error('Ошибка получения случайного релиза');
    }

    return data.release || data;
  }

  async getCollections(profileId: number, page: number = 1): Promise<PageableResponse<Collection>> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Токен не найден');
    }

    const response = await fetch(
      `${API_BASE_URL}/collection/all/profile/${profileId}/${page}?token=${token}`
    );
    
    if (!response.ok) {
      throw new Error('Ошибка получения коллекций');
    }

    const data: any = await response.json();
    
    // Проверяем структуру ответа
    if (data.code !== undefined && data.code !== 0) {
      throw new Error('Ошибка получения коллекций');
    }

    // Если ответ обернут в code, возвращаем содержимое
    if (data.code !== undefined && data.items) {
      return data;
    }

    // Если ответ уже в формате PageableResponse
    if (data.items) {
      return data;
    }

    // Fallback - возвращаем как есть
    return data;
  }

  async getCollection(id: number): Promise<Collection> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Токен не найден');
    }

    const response = await fetch(`${API_BASE_URL}/collection/${id}?token=${token}`);
    
    if (!response.ok) {
      throw new Error('Ошибка получения коллекции');
    }

    const data: any = await response.json();
    
    if (data.code !== 0) {
      throw new Error('Ошибка получения коллекции');
    }

    return data.collection || data;
  }

  async getCollectionReleases(id: number, page: number = 1): Promise<PageableResponse<Release>> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Токен не найден');
    }

    const response = await fetch(
      `${API_BASE_URL}/collection/${id}/releases/${page}?token=${token}`
    );
    
    if (!response.ok) {
      throw new Error('Ошибка получения релизов коллекции');
    }

    const data: any = await response.json();
    
    if (data.code !== 0) {
      throw new Error('Ошибка получения релизов коллекции');
    }

    return data.items ? data : { items: [], total: 0 };
  }

  async getFavorites(page: number = 1): Promise<PageableResponse<Release>> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Токен не найден');
    }

    const response = await fetch(`${API_BASE_URL}/favorite/all/${page}?token=${token}`);
    
    if (!response.ok) {
      throw new Error('Ошибка получения избранного');
    }

    const data: any = await response.json();
    
    if (data.code !== undefined && data.code !== 0) {
      throw new Error('Ошибка получения избранного');
    }

    if (data.items) {
      return data;
    }

    return data;
  }

  async getProfileList(type: number, page: number = 1): Promise<PageableResponse<Release>> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Токен не найден');
    }

    // type: 1 - watching, 2 - plan, 3 - completed, 4 - hold_on, 5 - dropped
    const response = await fetch(`${API_BASE_URL}/profile/list/all/${type}/${page}?token=${token}`);
    
    if (!response.ok) {
      throw new Error('Ошибка получения списка профиля');
    }

    const data: any = await response.json();
    
    if (data.code !== undefined && data.code !== 0) {
      throw new Error('Ошибка получения списка профиля');
    }

    if (data.items) {
      return data;
    }

    return data;
  }
}

export const api = new AnixartAPI();

