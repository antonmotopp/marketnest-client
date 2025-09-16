import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores';

export const Navigation = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  const navigations = [
    { title: 'Home', link: '/' },
    { title: 'Create Ad', link: '/create' },
  ];

  const profileMenuItems = [
    { title: 'My Profile', link: '/profile' },
    { title: 'My Ads', link: '/my-ads' },
    { title: 'Messages', link: '/messages' },
    { title: 'Settings', link: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <div className="flex justify-between items-center py-4">
      <Link to="/" className="flex items-center">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <span className="ml-2 text-xl font-bold text-gray-900">Marketplace</span>
      </Link>

      <div className="flex-1 max-w-lg mx-8">
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search products..."
        />
      </div>

      <div className="flex gap-8 items-center">
        {navigations.map(({ title, link }) => (
          <Link
            to={link}
            key={title}
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            {title}
          </Link>
        ))}

        {isAuthenticated ? (
          <div
            className="relative"
            onMouseEnter={() => setIsProfileOpen(true)}
            onMouseLeave={() => setIsProfileOpen(false)}
          >
            <div className="flex items-center cursor-pointer gap-2 hover:text-blue-600 transition-colors">
              <span className="font-medium">{user?.username}</span>

              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                <span className="text-gray-700 font-medium text-sm">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 top-full w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {profileMenuItems.map(({ title, link }) => (
                  <Link
                    key={title}
                    to={link}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {title}
                  </Link>
                ))}

                <div className="border-t border-gray-100 mt-2">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
