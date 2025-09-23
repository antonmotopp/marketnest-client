export interface IAdvertisement {
  id: number;
  title: string;
  description: string;
  price: number;
  category: 'electronics' | 'furniture' | 'other';
  status: 'available' | 'reserved' | 'sold';
  user_id: number;
  created_at: string;
  updated_at: string;
  photo_count: number;
  photos: string[];
}

export interface IAdvertisementFilters {
  category?: string;
  user_id?: string;
  status?: string;
  search?: string;
  sort_by?: string;
}
