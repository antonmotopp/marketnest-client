import { Navigation } from '@/components/layout';

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <Navigation />
      </div>
    </header>
  );
};
