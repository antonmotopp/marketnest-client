import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { formatDate } from '@/utils';
import type { IUser, IRating } from '@/types';
import { ratingsApi } from '@/api';
import { useAuthStore } from '@/stores';
import { AdvertisementsRatingModal } from '@/components/features/advertisements';

interface Props {
  owner: IUser;
  isOwner: boolean;
  advertisementStatus: string;
  advertisementId: number;
  sellerRatings: IRating[];
  averageRating: number;
  onBuyNow: any;
}

export const AdvertisementSellerInfo = ({
  owner,
  isOwner,
  advertisementStatus,
  advertisementId,
  sellerRatings,
  averageRating,
  onBuyNow,
}: Props) => {
  const currentUser = useAuthStore((state) => state.user);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [canRate, setCanRate] = useState(false);

  useEffect(() => {
    const checkCanRate = async () => {
      if (advertisementStatus === 'sold' && currentUser && currentUser.id !== owner.id) {
        try {
          const userRatings = await ratingsApi.getRatingsByUser(currentUser.id);
          const hasRated = userRatings.some(
            (r) => r.advertisement_id === advertisementId && r.reviewed_user_id === owner.id
          );
          setCanRate(!hasRated);
        } catch (error) {
          console.error('Error checking rating status:', error);
        }
      }
    };
    checkCanRate();
  }, [advertisementStatus, currentUser, owner.id, advertisementId]);

  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold mb-3">Seller</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium">{owner.username.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <div className="font-medium">{owner.username}</div>
              <div className="text-sm text-gray-500">
                Member since {formatDate(owner.created_at).year}
              </div>
              {sellerRatings.length > 0 && (
                <div className="flex items-center text-sm text-yellow-600 mt-1">
                  <span className="mr-1">★</span>
                  <span>{averageRating}</span>
                  <span className="text-gray-400 ml-1">({sellerRatings.length} reviews)</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {!isOwner && advertisementStatus === 'available' && (
              <>
                <button
                  onClick={() => onBuyNow()}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Buy Now
                </button>
                <Link
                  to={`/advertisement/${advertisementId}/messages/${owner.id}`}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-center"
                >
                  Contact Seller
                </Link>
              </>
            )}

            {canRate && (
              <button
                onClick={() => setShowRatingModal(true)}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
              >
                Rate Seller
              </button>
            )}
          </div>
        </div>

        {sellerRatings.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Recent Reviews</h4>
            <div className="space-y-3 overflow-y-auto">
              {sellerRatings.slice(0, 3).map((rating) => (
                <div key={rating.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-yellow-600">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < rating.rating ? 'text-yellow-600' : 'text-gray-300'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(rating.created_at).formatted}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{rating.comment}</p>
                </div>
              ))}
            </div>
            {sellerRatings.length > 3 && (
              <p className="text-sm text-gray-500 mt-2">
                + {sellerRatings.length - 3} more reviews
              </p>
            )}
          </div>
        )}
      </div>

      <AdvertisementsRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        advertisementId={advertisementId}
        reviewedUserId={owner.id}
        reviewedUsername={owner.username}
      />
    </div>
  );
};
