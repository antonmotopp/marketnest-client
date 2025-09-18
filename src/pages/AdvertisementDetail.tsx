import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { formatDate } from '@/utils';
import { useAdvertisementDetail, useRequestHandler, useUser } from '@/hooks';
import { advertisementsApi } from '@/api';

type Params = {
  id: string;
};

export const AdvertisementDetail = () => {
  const { id } = useParams<Params>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const { requestHandler } = useRequestHandler();

  const {
    data: advertisement,
    isLoading: adLoading,
    error: adError,
    refetch,
  } = useAdvertisementDetail(id);
  const {
    data: owner,
    isLoading: ownerLoading,
    error: ownerError,
  } = useUser(advertisement?.user_id);

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
  const hasPhotos = photos.length > 0;

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToPhoto = (index: number) => {
    setCurrentPhotoIndex(index);
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
        refetch();
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/')} className="mb-6 text-gray-600 hover:text-gray-800">
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
            {hasPhotos ? (
              <>
                <img
                  src={photos[currentPhotoIndex]}
                  alt={advertisement.title}
                  className="w-full h-full object-contain"
                />

                {photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full hover:bg-opacity-70"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full hover:bg-opacity-70"
                    >
                      ›
                    </button>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentPhotoIndex + 1} / {photos.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No Image Available
              </div>
            )}
          </div>

          {photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => goToPhoto(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    index === currentPhotoIndex ? 'border-blue-500' : 'border-gray-300'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3">{advertisement.title}</h1>
              <div className="text-3xl font-bold text-blue-600 mb-4">${advertisement.price}</div>

              <div className="flex gap-3 text-sm">
                <span className="bg-gray-100 px-3 py-1 rounded-full capitalize">
                  {advertisement.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full capitalize ${
                    advertisement.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : advertisement.status === 'reserved'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {advertisement.status}
                </span>
              </div>
            </div>

            {isOwner && (
              <div className="flex gap-2 items-center">
                <Link
                  to={`/advertisement/edit/${advertisement.id}`}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Edit
                </Link>

                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {advertisement.description}
            </p>
          </div>

          {owner && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Seller</h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium">
                      {owner?.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{owner.username}</div>
                    <div className="text-sm text-gray-500">
                      Member since {formatDate(owner.created_at).year}
                    </div>
                  </div>
                </div>

                {!isOwner && advertisement.status === 'available' && (
                  <Link
                    to={`/messages/${owner.id}`}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Contact Seller
                  </Link>
                )}
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 border-t pt-4">
            Posted on {formatDate(advertisement.created_at).formatted}
          </div>
        </div>
      </div>
    </div>
  );
};
