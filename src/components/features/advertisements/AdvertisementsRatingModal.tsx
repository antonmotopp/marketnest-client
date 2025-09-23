import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ratingsApi } from '@/api';
import type { IRatingCreate } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  advertisementId: number;
  reviewedUserId: number;
  reviewedUsername: string;
}

export const AdvertisementsRatingModal = ({
  isOpen,
  onClose,
  advertisementId,
  reviewedUserId,
  reviewedUsername,
}: Props) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const queryClient = useQueryClient();

  const createRatingMutation = useMutation({
    mutationFn: ratingsApi.createRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      onClose();
      setRating(5);
      setComment('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (comment.trim().length === 0) {
      alert('Please add a comment');
      return;
    }

    const ratingData: IRatingCreate = {
      reviewed_user_id: reviewedUserId,
      advertisement_id: advertisementId,
      rating,
      comment: comment.trim(),
    };

    createRatingMutation.mutate(ratingData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Rate {reviewedUsername}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-2xl transition-colors ${
                    star <= (hoveredRating || rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 h-24 resize-none"
              placeholder="Share your experience with this user..."
              maxLength={500}
              required
            />
            <div className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={createRatingMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={createRatingMutation.isPending}
            >
              {createRatingMutation.isPending ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>

        {createRatingMutation.isError && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Failed to submit rating. Please try again.
          </div>
        )}
      </div>
    </div>
  );
};
