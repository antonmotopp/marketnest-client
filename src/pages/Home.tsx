import { useState } from 'react';
import { useAdvertisementsAll } from '@/hooks';
import { AdvertisementFilters, AdvertisementsList } from '@/components/features/advertisements';
import type { IAdvertisementFilters } from '@/types';

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSortBy('newest');
  };

  const filters: IAdvertisementFilters = {
    ...(searchQuery && { search: searchQuery }),
    ...(selectedCategory && { category: selectedCategory }),
    ...(selectedStatus && { status: selectedStatus }),
    sort_by: sortBy,
  };

  const { data: advertisements, isLoading, error } = useAdvertisementsAll(filters);

  return (
    <div className="space-y-6 w-full">
      <AdvertisementFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
      />

      <AdvertisementsList
        advertisements={advertisements || []}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};
