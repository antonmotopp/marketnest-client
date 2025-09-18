import { api } from '@/lib';
import type { IAdvertisement } from '@/types';

export interface AdvertisementFilters {
  category?: string;
  user_id?: string;
  status?: string;
  search?: string;
}

export const advertisementsApi = {
  async create(data: FormData): Promise<IAdvertisement> {
    const response = await api.post(`/advertisements/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async update(id: number | undefined, data: FormData): Promise<IAdvertisement> {
    const response = await api.put(`/advertisements/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async getAll(filters: AdvertisementFilters = {}): Promise<IAdvertisement[]> {
    const params = new URLSearchParams();

    if (filters.category) params.append('category', filters.category);
    if (filters.user_id) params.append('user_id', filters.user_id);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/advertisements/all?${params.toString()}`);

    return response.data;
  },

  async getById(id: string): Promise<IAdvertisement> {
    const response = await api.get(`/advertisements/${id}`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/advertisements/${id}`);
  },
};
