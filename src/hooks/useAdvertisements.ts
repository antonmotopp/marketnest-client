import { useQuery } from '@tanstack/react-query';
import { advertisementsApi, type AdvertisementFilters } from '@/api';

export const useAdvertisementsList = (filters: AdvertisementFilters = {}) => {
  return useQuery({
    queryKey: ['advertisements', filters],
    queryFn: () => advertisementsApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdvertisementDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ['advertisement', id],
    queryFn: () => advertisementsApi.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
