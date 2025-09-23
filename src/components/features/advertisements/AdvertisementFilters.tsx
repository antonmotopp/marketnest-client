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
    <div className="flex gap-4 items-center flex-wrap">
      <input
        type="text"
        placeholder="Search advertisements..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="furniture">Furniture</option>
        <option value="other">Other</option>
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Statuses</option>
        <option value="available">Available</option>
        <option value="reserved">Reserved</option>
        <option value="sold">Sold</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      <select
        value={ratingSort}
        onChange={(e) => onRatingSortChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">No Rating Sort</option>
        <option value="rating_high">Best Rated First</option>
        <option value="rating_low">Lowest Rated First</option>
      </select>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 whitespace-nowrap"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};
