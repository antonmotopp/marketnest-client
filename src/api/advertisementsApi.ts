import { api } from '@/lib';
import type { IAdvertisement, IAdvertisementFilters } from '@/types';

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

  updateStatus: async (id: string | number, newStatus: string): Promise<IAdvertisement> => {
    const response = await api.patch(`/advertisements/${id}/status`, {
      new_status: newStatus,
    });
    return response.data;
  },

  async getAll(filters: IAdvertisementFilters = {}): Promise<IAdvertisement[]> {
    const params = new URLSearchParams();

    if (filters.category) params.append('category', filters.category);
    if (filters.user_id) params.append('user_id', filters.user_id);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.rating_sort) params.append('rating_sort', filters.rating_sort);

    const response = await api.get(`/advertisements/all?${params.toString()}`);

    return response.data;
  },

  async getById(id: string): Promise<IAdvertisement> {
    const response = await api.get(`/advertisements/${id}`);
    return response.data;
  },

  buyAdvertisement: async (id: number): Promise<IAdvertisement> => {
    const response = await api.patch(`/advertisements/${id}/buy`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/advertisements/${id}`);
  },
};
