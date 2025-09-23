import { Link } from 'react-router-dom';
import type { IAdvertisement } from '@/types';

interface Props {
  advertisement: IAdvertisement;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
}

export const AdvertisementOwnerActions = ({ advertisement, onStatusChange, onDelete }: Props) => {
  const statusOptions = [
    { value: 'available', label: 'Available', color: 'bg-green-600 hover:bg-green-700' },
    { value: 'reserved', label: 'Reserved', color: 'bg-yellow-600 hover:bg-yellow-700' },
    { value: 'sold', label: 'Sold', color: 'bg-red-600 hover:bg-red-700' },
  ];

  const handleStatusSelect = (newStatus: string) => {
    if (newStatus === advertisement.status) return;
    onStatusChange(newStatus);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Link
          to={`/advertisement/edit/${advertisement.id}`}
          className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
        >
          Edit
        </Link>
        <button
          onClick={onDelete}
          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
        >
          Delete
        </button>
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Change Status:</label>
        <select
          value={advertisement.status}
          onChange={(e) => handleStatusSelect(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
