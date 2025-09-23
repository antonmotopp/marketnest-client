import { useState } from 'react';
import { useAdvertisementsAll } from '@/hooks';
import { useAuthStore } from '@/stores';
import {
  MyAdvertisementsEmptyState,
  MyAdvertisementsFilters,
  MyAdvertisementsHeader,
  MyAdvertisementsList,
} from '@/components/features/my-advertisements';

export const MyAdvertisements = () => {
  const currentUser = useAuthStore((state) => state.user);
  const [statusFilter, setStatusFilter] = useState('');

  const {
    data: advertisements,
    isLoading,
    error,
  } = useAdvertisementsAll({
    user_id: currentUser?.id.toString(),
    ...(statusFilter && { status: statusFilter }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading your advertisements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Error loading your advertisements. Please try again later.
      </div>
    );
  }

  const adCount = advertisements?.length || 0;

  return (
    <div className="space-y-6 w-full">
      <MyAdvertisementsHeader adCount={adCount} />

      <MyAdvertisementsFilters statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />

      {advertisements?.length ? (
        <MyAdvertisementsList advertisements={advertisements} />
      ) : (
        <MyAdvertisementsEmptyState hasFilter={!!statusFilter} filterType={statusFilter} />
      )}
    </div>
  );
};
