import { Link } from 'react-router-dom';

interface Props {
  hasFilter: boolean;
  filterType?: string;
}

export const MyAdvertisementsEmptyState = ({ hasFilter, filterType }: Props) => {
  return (
    <div className="text-center py-16  rounded-lg">
      <div className="max-w-sm mx-auto">
        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>

        <h3 className="text-xl font-medium text-gray-900 mb-2">
          {hasFilter ? `No ${filterType} advertisements` : 'No advertisements yet'}
        </h3>

        <p className="text-gray-500 mb-6">
          {hasFilter
            ? `You don't have any ${filterType} advertisements. Try changing the filter or create a new one.`
            : 'Start selling by creating your first advertisement and reach potential buyers.'}
        </p>

        {!hasFilter && (
          <Link
            to="/create-advertisement"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create Your First Ad
          </Link>
        )}
      </div>
    </div>
  );
};
