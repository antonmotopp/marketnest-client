import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { IAdvertisement } from '@/types';
import { formatDate } from '@/utils';
import { useAuthStore } from '@/stores';
import { ratingsApi } from '@/api';

type Props = {
  advertisement: IAdvertisement;
};

export const AdvertisementCard = ({ advertisement }: Props) => {
  const currentUser = useAuthStore((state) => state.user);
  const [sellerRating, setSellerRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  useEffect(() => {
    const fetchSellerRating = async () => {
      try {
        const ratings = await ratingsApi.getUserRatings(advertisement.user_id);
        if (ratings.length > 0) {
          const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
          setSellerRating(Math.round(avg * 10) / 10);
          setTotalReviews(ratings.length);
        }
      } catch (error) {
        console.error('Error fetching seller rating:', error);
      }
    };
    fetchSellerRating();
  }, [advertisement.user_id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

      <span
        className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-md shadow capitalize ${getStatusBadge(
          advertisement.status
        )}`}
      >
        {advertisement.status}
      </span>

      {advertisement.user_id === currentUser?.id && (
        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md shadow">
          Your ad
        </span>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{advertisement.title}</h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{advertisement.description}</p>

        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-blue-600">${advertisement.price}</span>
          <span className="text-sm text-gray-500 capitalize">{advertisement.category}</span>
        </div>

        {sellerRating && (
          <div className="flex items-center text-sm text-yellow-600 mb-2">
            <span className="mr-1">★</span>
            <span>{sellerRating}</span>
            <span className="text-gray-400 ml-1">({totalReviews} reviews)</span>
          </div>
        )}

        <div className="text-xs text-gray-400">
          {formatDate(advertisement.created_at).formatted}
        </div>
      </div>
    </Link>
  );
};
