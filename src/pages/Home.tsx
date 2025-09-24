import { useState } from 'react';
import { useAdvertisementsAll } from '@/hooks';
import { AdvertisementFilters, AdvertisementsList } from '@/components/features/advertisements';
import type { IAdvertisementFilters } from '@/types';

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [ratingSort, setRatingSort] = useState('');

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSortBy('newest');
    setRatingSort('');
  };

  const filters: IAdvertisementFilters = {
    ...(searchQuery && { search: searchQuery }),
    ...(selectedCategory && { category: selectedCategory }),
    ...(selectedStatus && { status: selectedStatus }),
    sort_by: sortBy,
    ...(ratingSort && { rating_sort: ratingSort }),
  };

  const { data: advertisements, isLoading, error } = useAdvertisementsAll(filters);

  return (
    <div className="min-h-screen">
      <div className="flex">
        <div className="w-80 rounded-lg bg-white shadow-lg border-r border-gray-200 max-h-min sticky top-10">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                />
              </svg>
              Filters
            </h2>

            <AdvertisementFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              sortBy={sortBy}
              ratingSort={ratingSort}
              onRatingSortChange={setRatingSort}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="pl-6">
            <AdvertisementsList
              advertisements={advertisements || []}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
