import { useAdvertisementsList } from '@/hooks';
import { AdvertisementCard } from '@/components/features/advertisements';
import { useAuthStore } from '@/stores';

export const MyAdvertisements = () => {
  const currentUser = useAuthStore((state) => state.user);
  const {
    data: advertisements,
    isLoading,
    error,
  } = useAdvertisementsList({ user_id: currentUser?.id.toString() });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Error loading products. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {advertisements && advertisements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {advertisements.map((advertisement) => (
            <AdvertisementCard advertisement={advertisement} key={advertisement.id} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          <div className="text-xl mb-2">No products found</div>
          <div>Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  );
};
