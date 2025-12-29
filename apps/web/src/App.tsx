import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './components/Auth/AuthProvider';
import { AuthPage } from './components/Auth/AuthPage';
import { Header } from './components/common/Header';
import { RouteBuilder } from './components/RouteBuilder/RouteBuilder';
import { ProfileBuilder } from './components/LayoutBuilder/ProfileBuilder';
import { RoutesPage } from './components/Routes/RoutesPage';
import { RouteDetailPage } from './components/Routes/RouteDetailPage';
import { CollectionsPage } from './components/Collections/CollectionsPage';
import { CollectionDetailPage } from './components/Collections/CollectionDetailPage';
import {
  DocsLayout,
  DocsOverview,
  DocsGettingStarted,
  DocsFeatures,
  DocsFAQ,
  WidgetReference,
} from './components/Docs';

function HomePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome to Peloton
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Configure your bike computer from the comfort of your desk. Create routes,
        customize your data screen, and sync everything to your phone.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <a
          href="/routes"
          className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Route Builder</h2>
          </div>
          <p className="text-gray-600">
            Create cycling routes with turn-by-turn navigation. Export as GPX
            and sync to your phone.
          </p>
        </a>

        <a
          href="/layouts"
          className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Layout Builder</h2>
          </div>
          <p className="text-gray-600">
            Customize your data screen with drag-and-drop widgets. See your stats
            exactly how you want them.
          </p>
        </a>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : <AuthPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <HomePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/routes"
        element={
          <ProtectedRoute>
            <AppLayout>
              <RoutesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/routes/new"
        element={
          <ProtectedRoute>
            <AppLayout>
              <RouteBuilder />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/routes/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <RouteDetailPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/layouts"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfileBuilder />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/collections"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CollectionsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/collections/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CollectionDetailPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      {/* Public Documentation Routes */}
      <Route path="/docs" element={<DocsLayout />}>
        <Route index element={<DocsOverview />} />
        <Route path="getting-started" element={<DocsGettingStarted />} />
        <Route path="features" element={<DocsFeatures />} />
        <Route path="widgets" element={<WidgetReference />} />
        <Route path="faq" element={<DocsFAQ />} />
      </Route>
    </Routes>
  );
}
