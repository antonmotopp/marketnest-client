import { AdvertisementCard } from '@/components/features/advertisements';
import type { IAdvertisement } from '@/types';

interface AdvertisementsListProps {
  advertisements: IAdvertisement[];
  isLoading: boolean;
  error?: Error | null;
}

export const AdvertisementsList = ({
  advertisements,
  isLoading,
  error,
}: AdvertisementsListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading advertisements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Error loading advertisements. Please try again later.
      </div>
    );
  }

  if (!advertisements || advertisements.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <div className="text-xl mb-2">No advertisements found</div>
        <div>Try adjusting your search or filters</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {advertisements.map((advertisement) => (
        <AdvertisementCard advertisement={advertisement} key={advertisement.id} />
      ))}
    </div>
  );
};
