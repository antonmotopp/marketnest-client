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
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-top-blue-600 rounded-full animate-spin mb-4"></div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Loading advertisements...</h3>
        <p className="text-gray-500">Please wait while we fetch the latest listings</p>

        <div className="w-full mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-900 mb-2">Error loading advertisements</h3>
          <p className="text-red-700 mb-4">
            We encountered an issue while fetching the data. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!advertisements || advertisements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-3">No advertisements found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any advertisements matching your current filters.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <div>• Try removing some filters</div>
            <div>• Check your search terms</div>
            <div>• Browse different categories</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {advertisements.map((advertisement, index) => (
          <div
            key={advertisement.id}
            className="transform transition-all duration-200 hover:scale-[1.02]"
            style={{
              animationDelay: `${index * 50}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards',
            }}
          >
            <AdvertisementCard advertisement={advertisement} />
          </div>
        ))}
      </div>
    </div>
  );
};
