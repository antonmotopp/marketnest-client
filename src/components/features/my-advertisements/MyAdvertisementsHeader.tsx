import { Link } from 'react-router-dom';

interface Props {
  adCount: number;
}

export const MyAdvertisementsHeader = ({ adCount }: Props) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Advertisements</h1>
        <p className="text-gray-600">
          {adCount} advertisement{adCount !== 1 ? 's' : ''} total
        </p>
      </div>

      <Link
        to="/create-advertisement"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create New Ad
      </Link>
    </div>
  );
};
