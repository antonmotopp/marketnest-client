import { api } from '@/lib';
import type { IRating, IRatingCreate } from '@/types';

export const ratingsApi = {
  createRating: async (rating: IRatingCreate): Promise<IRating> => {
    const response = await api.post('/ratings/', rating);
    return response.data;
  },

  getUserRatings: async (userId: number): Promise<IRating[]> => {
    const response = await api.get(`/ratings/${userId}`);
    return response.data;
  },

  getRatingsByUser: async (userId: number): Promise<IRating[]> => {
    const response = await api.get(`/ratings/reviewer/${userId}`);
    return response.data;
  },
};
