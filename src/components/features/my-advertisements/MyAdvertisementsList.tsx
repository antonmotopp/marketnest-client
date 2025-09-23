import { AdvertisementCard } from '@/components/features/advertisements';
import type { IAdvertisement } from '@/types';

interface Props {
  advertisements: IAdvertisement[];
}

export const MyAdvertisementsList = ({ advertisements }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {advertisements.map((advertisement) => (
        <AdvertisementCard advertisement={advertisement} key={advertisement.id} />
      ))}
    </div>
  );
};
