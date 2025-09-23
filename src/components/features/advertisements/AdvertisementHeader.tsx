import type { ReactNode } from 'react';
import type { IAdvertisement } from '@/types';

interface Props {
  advertisement: IAdvertisement;
  actions?: ReactNode;
}

export const AdvertisementHeader = ({ advertisement, actions }: Props) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-3">{advertisement.title}</h1>
        <div className="text-3xl font-bold text-blue-600 mb-4">${advertisement.price}</div>

        <div className="flex gap-3 text-sm">
          <span className="bg-gray-100 px-3 py-1 rounded-full capitalize">
            {advertisement.category}
          </span>
          <span
            className={`px-3 py-1 rounded-full capitalize ${
              advertisement.status === 'available'
                ? 'bg-green-100 text-green-800'
                : advertisement.status === 'reserved'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}
          >
            {advertisement.status}
          </span>
        </div>
      </div>

      {actions}
    </div>
  );
};
