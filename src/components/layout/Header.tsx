import { Navigation } from '@/components/layout';

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-8">
        <Navigation />
      </div>
    </header>
  );
};
