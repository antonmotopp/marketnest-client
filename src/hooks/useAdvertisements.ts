import { useQuery } from '@tanstack/react-query';
import { advertisementsApi } from '@/api';
import type { IAdvertisementFilters } from '@/types';

export const useAdvertisementsAll = (filters: IAdvertisementFilters = {}) => {
  return useQuery({
    queryKey: ['advertisements', filters],
    queryFn: () => advertisementsApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdvertisementById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['advertisement', id],
    queryFn: () => advertisementsApi.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
