import { api } from '@/lib';
import type { IUser } from '@/types';

export const usersApi = {
  async getById(userId: string): Promise<IUser> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
};
