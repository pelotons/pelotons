import { Link, useLocation, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/docs', label: 'Overview', exact: true },
  { path: '/docs/getting-started', label: 'Getting Started' },
  { path: '/docs/features', label: 'Features' },
  { path: '/docs/widgets', label: 'Widget Reference' },
  { path: '/docs/faq', label: 'FAQ & Support' },
];

export function DocsLayout() {
  const location = useLocation();

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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

            <div className="flex items-center space-x-4">
              <Link
                to="/docs"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Documentation
              </Link>
              <Link
                to="/auth"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="sticky top-24 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path, item.exact)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-gray-200">
                <Link
                  to="/auth"
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50"
                >
                  Get Started Free
                </Link>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Peloton is open source software licensed under GPL-3.0
            </p>
            <div className="flex space-x-6">
              <a
                href="https://github.com/your-org/peloton"
                className="text-sm text-gray-500 hover:text-gray-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <Link to="/docs/faq" className="text-sm text-gray-500 hover:text-gray-700">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
