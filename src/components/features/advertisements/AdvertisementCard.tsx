import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { IAdvertisement } from '@/types';
import { formatDate } from '@/utils';
// import { useAuthStore } from '@/stores';
import { ratingsApi } from '@/api';

type Props = {
  advertisement: IAdvertisement;
};

export const AdvertisementCard = ({ advertisement }: Props) => {
  // const currentUser = useAuthStore((state) => state.user);
  const [sellerRating, setSellerRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'available':
        return {
          className: 'bg-emerald-500 text-white',
          icon: '✓',
          label: 'Available',
        };
      case 'reserved':
        return {
          className: 'bg-amber-500 text-white',
          icon: '⏳',
          label: 'Reserved',
        };
      case 'sold':
        return {
          className: 'bg-red-500 text-white',
          icon: '✗',
          label: 'Sold',
        };
      default:
        return {
          className: 'bg-gray-500 text-white',
          icon: '?',
          label: status,
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'electronics':
        return '📱';
      case 'furniture':
        return '🪑';
      case 'clothing':
        return '👕';
      case 'books':
        return '📚';
      case 'sports':
        return '⚽';
      case 'vehicles':
        return '🚗';
      default:
        return '📦';
    }
  };

  const statusConfig = getStatusConfig(advertisement.status);
  const categoryIcon = getCategoryIcon(advertisement.category);
  // const isOwner = advertisement.user_id === currentUser?.id;

  return (
    <Link
      to={`/advertisement/${advertisement.id}`}
      className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
    >
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {advertisement.photos.length > 0 ? (
          <>
            <img
              src={advertisement.photos[0]}
              alt={advertisement.title}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {imageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <svg
                  className="w-12 h-12 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">No image</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-medium">No Photo Available</span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <div
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${statusConfig.className}`}
          >
            <span>{statusConfig.icon}</span>
            <span>{statusConfig.label}</span>
          </div>
        </div>

        {/*{isOwner && (*/}
        {/*  <div className="absolute top-3 right-3">*/}
        {/*    <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-lg backdrop-blur-sm">*/}
        {/*      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">*/}
        {/*        <path d="M10 2L3 7v11a1 1 0 001 1h3v-8h6v8h3a1 1 0 001-1V7l-7-5z" />*/}
        {/*      </svg>*/}
        {/*      <span>Your Ad</span>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}

        {advertisement.photos.length > 1 && (
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center space-x-1 px-2 py-1 rounded-md bg-black bg-opacity-50 text-white text-xs">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{advertisement.photos.length}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {advertisement.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {advertisement.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-blue-600">
              ${advertisement.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">USD</span>
          </div>

          <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
            <span>{categoryIcon}</span>
            <span className="capitalize">{advertisement.category}</span>
          </div>
        </div>

        {sellerRating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-50 rounded-md">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(sellerRating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-medium text-yellow-700 ml-1">{sellerRating}</span>
              <span className="text-xs text-gray-500">({totalReviews})</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{formatDate(advertisement.created_at).formatted}</span>
          </div>

          <div className="flex items-center text-xs text-blue-600 font-medium group-hover:text-blue-700">
            <span>View Details</span>
            <svg
              className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};
