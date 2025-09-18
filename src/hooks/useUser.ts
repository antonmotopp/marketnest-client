import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api';

export const useUser = (userId: string | number | undefined) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getById(userId!.toString()),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });
};
