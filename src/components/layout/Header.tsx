import { Navigation } from '@/components/layout';

export const Header = () => {
  return (
    <header className="absolute top-0 w-full bg-white border-b border-gray-200 shadow-sm py-1">
      <div className="container mx-auto">
        <Navigation />
      </div>
    </header>
  );
};
