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

  if (adLoading || ownerLoading) {
    return <div className="flex justify-center items-center min-h-64">Loading...</div>;
  }

  if (adError || ownerError || !advertisement) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Advertisement not found</h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Back to Home
        </button>
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
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/')} className="mb-6 text-gray-600 hover:text-gray-800">
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AdvertisementPhotoGallery photos={photos} title={advertisement.title} />

        <div className="space-y-6">
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

          <div>
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {advertisement.description}
            </p>
          </div>

          {owner && (
            <AdvertisementSellerInfo
              owner={owner}
              isOwner={isOwner}
              advertisementStatus={advertisement.status}
              advertisementId={advertisement.id}
            />
          )}

          <div className="text-sm text-gray-500 border-t pt-4">
            Posted on {formatDate(advertisement.created_at).formatted}
          </div>
        </div>
      </div>
    </div>
  );
};
