import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';

export function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isRouteSection = location.pathname.startsWith('/routes');
  const isCollectionSection = location.pathname.startsWith('/collections');

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" strokeWidth="2" />
                <path strokeWidth="2" d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              </svg>
              <span className="text-xl font-bold text-gray-900">Peloton</span>
            </Link>

            <nav className="hidden md:flex space-x-1">
              <Link
                to="/routes"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isRouteSection
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                My Routes
              </Link>
              <Link
                to="/collections"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isCollectionSection
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Collections
              </Link>
              <Link
                to="/routes/new"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/routes/new')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Create Route
              </Link>
              <Link
                to="/layouts"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/layouts')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Layouts
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
