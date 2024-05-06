export interface Dates {
  id: number;
  date: string;
}

export interface RequestEvent {
  id?: number;
  title: string;
  image?: string;
  description: string;
  categoryId: number | string;
  category?: string;
  location: string;
  latitude: string;
  longitude: string;
  startTime: string;
  openingTime: string;
  minimumAge: boolean;
  specialZone: boolean;
  dates?: Dates[];
  userId?: number;
}

export interface ResponseEvent {
  id: number;
  title: string;
  image: string;
  description: string;
  categoryId: number;
  category: string;
  location: string;
  latitude: string;
  longitude: string;
  startTime: string;
  openingTime: string;
  minimumAge: number;
  specialZone: number;
  dates: Dates[];
  userId: number;
}

export interface ResponseStoreEvent {
  inserted: boolean;
}

export interface ResponseUpdateEvent {
  updated: boolean;
}

export interface ResponseDeleteEvent {
  deleted: boolean;
}
export interface ResponseUploadEvents {
  error: boolean;
  imported: {
    quantity: number;
    success: ResponseEvent[];
    falided: ResponseEvent[];
  }
}
