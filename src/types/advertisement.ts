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
  image: string;
  photos: string[];
}
