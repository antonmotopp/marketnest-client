interface Props {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export const MyAdvertisementsFilters = ({ statusFilter, onStatusFilterChange }: Props) => {
  return (
    <div className="flex items-center gap-4">
      <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
        Filter by status:
      </label>
      <select
        id="status-filter"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Statuses</option>
        <option value="available">Available</option>
        <option value="reserved">Reserved</option>
        <option value="sold">Sold</option>
      </select>
    </div>
  );
};
