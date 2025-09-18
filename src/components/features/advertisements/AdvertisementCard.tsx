import { Link } from 'react-router-dom';
import type { IAdvertisement } from '@/types';
import { formatDate } from '@/utils';
import { useAuthStore } from '@/stores';

type Props = {
  advertisement: IAdvertisement;
};

export const AdvertisementCard = ({ advertisement }: Props) => {
  const currentUser = useAuthStore((state) => state.user);

  return (
    <Link
      key={advertisement.id}
      to={`/advertisement/${advertisement.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
    >
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {advertisement.photos.length ? (
          <img
            src={advertisement.photos[0]}
            alt={advertisement.title}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-gray-500">No Image</span>
        )}
      </div>

      {advertisement.user_id === currentUser?.id && (
        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md shadow">
          Your ad
        </span>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{advertisement.title}</h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{advertisement.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">${advertisement.price}</span>
          <span className="text-sm text-gray-500 capitalize">{advertisement.category}</span>
        </div>

        <div className="mt-2 text-xs text-gray-400">
          {formatDate(advertisement.created_at).formatted}
        </div>
      </div>
    </Link>
  );
};
