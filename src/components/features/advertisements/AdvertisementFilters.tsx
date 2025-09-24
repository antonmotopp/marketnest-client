interface AdvertisementFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  ratingSort: string;
  onRatingSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

export const AdvertisementFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  ratingSort,
  onRatingSortChange,
  onClearFilters,
}: AdvertisementFiltersProps) => {
  const hasActiveFilters =
    searchQuery || selectedCategory || selectedStatus || sortBy !== 'newest' || ratingSort !== '';

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Search</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search advertisements..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <svg
            className="absolute left-3 top-3.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <div className="space-y-2">
          {[
            { value: '', label: 'All Statuses', color: 'bg-gray-100 text-gray-800' },
            { value: 'available', label: 'Available', color: 'bg-green-100 text-green-800' },
            { value: 'reserved', label: 'Reserved', color: 'bg-yellow-100 text-yellow-800' },
            { value: 'sold', label: 'Sold', color: 'bg-red-100 text-red-800' },
          ].map((status) => (
            <label key={status.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="status"
                value={status.value}
                checked={selectedStatus === status.value}
                onChange={(e) => onStatusChange(e.target.value)}
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                {status.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">
          Sort Options
        </h3>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            By Date
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            By Rating
          </label>
          <select
            value={ratingSort}
            onChange={(e) => onRatingSortChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">No Rating Sort</option>
            <option value="rating_high">Best Rated First</option>
            <option value="rating_low">Lowest Rated First</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onClearFilters}
            className="w-full px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear All Filters
          </button>
        </div>
      )}

      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs font-medium text-blue-700 mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-1">
            {searchQuery && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Search: {searchQuery}
              </span>
            )}
            {selectedCategory && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Category: {selectedCategory}
              </span>
            )}
            {selectedStatus && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Status: {selectedStatus}
              </span>
            )}
            {sortBy !== 'newest' && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Sort: {sortBy}
              </span>
            )}
            {ratingSort && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Rating: {ratingSort}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
