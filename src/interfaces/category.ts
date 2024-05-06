export interface RequestCategory {
  id?: number;
  name: string;
}

export interface ResponseCategory {
  id: number;
  name: string;
}

export interface ResponseStoreCategory {
  inserted: boolean;
}

export interface ResponseUpdateCategory {
  updated: boolean;
}

export interface ResponseDeleteCategory {
  deleted: boolean;
}
