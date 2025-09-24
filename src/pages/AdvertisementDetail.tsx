import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { formatDate } from '@/utils';
import { useAdvertisementById, useAdvertisementsAll, useRequestHandler, useUser } from '@/hooks';
import { advertisementsApi } from '@/api';
import {
  AdvertisementHeader,
  AdvertisementOwnerActions,
  AdvertisementPhotoGallery,
  AdvertisementSellerInfo,
} from '@/components/features/advertisements';
import { useMutation } from '@tanstack/react-query';

type Params = {
  id: string;
};

export const AdvertisementDetail = () => {
  const { id } = useParams<Params>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const { requestHandler } = useRequestHandler();

  const {
    data: advertisement,
    isLoading: adLoading,
    error: adError,
    refetch: refetchOne,
  } = useAdvertisementById(id);
  const {
    data: owner,
    isLoading: ownerLoading,
    error: ownerError,
  } = useUser(advertisement?.user_id);
  const { refetch: refetchAll } = useAdvertisementsAll();

  const buyMutation = useMutation({
    mutationFn: advertisementsApi.buyAdvertisement,
    onSuccess: () => {
      refetchOne();
      refetchAll();
    },
  });

  const handleBuyNow = async () => {
    if (!advertisement) return;

    const confirmed = window.confirm(
      `Are you sure you want to buy "${advertisement.title}" for $${advertisement.price}?`
    );

    if (confirmed) {
      buyMutation.mutate(advertisement.id);
    }
  };

  if (adLoading || ownerLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-4 bg-gray-300 rounded w-2"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="h-10 bg-gray-200 rounded mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded w-48 mb-6"></div>
                  <div className="flex gap-3">
                    <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                    <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (adError || ownerError || !advertisement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-4 border border-red-100">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Oops! Not Found</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The advertisement you're looking for doesn't exist or has been removed. It might have
            been sold or deleted by the owner.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Browse All Listings
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.id === owner?.id;
  const photos = advertisement.photos || [];

  const handleStatusChange = async (newStatus: string) => {
    const confirmMessage =
      newStatus === 'sold'
        ? 'Are you sure you want to mark this as SOLD? This action is final.'
        : `Mark this advertisement as ${newStatus.toUpperCase()}?`;

    if (!window.confirm(confirmMessage)) return;

    await requestHandler(() => advertisementsApi.updateStatus(advertisement.id, newStatus), {
      successMessage: `Advertisement marked as ${newStatus}`,
      onSuccess: () => {
        refetchOne();
        refetchAll();
      },
    });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this advertisement? This action cannot be undone.'
    );

    if (!confirmed) return;

    await requestHandler(() => advertisementsApi.delete(advertisement.id), {
      successMessage: 'Advertisement deleted successfully',
      onSuccess: () => {
        navigate('/my-ads');
      },
    });
  };

  return (
    <div className="min-h-screen">
      <div className="border-b-2 border-b-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center space-x-3 text-sm">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 group"
            >
              <svg
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="font-medium">All Listings</span>
            </button>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-semibold truncate max-w-md">
              {advertisement.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <AdvertisementPhotoGallery photos={photos} title={advertisement.title} />
          </div>

          <div className="space-y-8">
            <AdvertisementHeader
              advertisement={advertisement}
              actions={
                isOwner ? (
                  <AdvertisementOwnerActions
                    advertisement={advertisement}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ) : null
              }
            />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Description</h2>
              </div>
              <div className="prose prose-gray prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                  {advertisement.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {owner && (
              <AdvertisementSellerInfo
                owner={owner}
                isOwner={isOwner}
                advertisementStatus={advertisement.status}
                advertisementId={advertisement.id}
                onBuyNow={handleBuyNow}
              />
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0h6M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Posted on {formatDate(advertisement.created_at).formatted}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
