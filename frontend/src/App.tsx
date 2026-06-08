import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { UploadPage } from './features/content/pages/UploadPage';
import { GalleryPage } from './features/content/pages/GalleryPage';
import { VideoDetailPage } from './features/content/pages/VideoDetailPage';
import { AnalyticsDashboard } from './features/analytics/pages/AnalyticsDashboard';
import { GrowthProPage } from './features/growth/pages/GrowthProPage';
import { ConnectSocialPage } from './features/social/pages/ConnectSocialPage';
import { PublishPage } from './features/social/pages/PublishPage';
import { useAuthStore } from './store/auth';
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient();

function LandingPage() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  );
}

export function App(): JSX.Element {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content/gallery"
            element={
              <ProtectedRoute>
                <GalleryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content/:videoId"
            element={
              <ProtectedRoute>
                <VideoDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/growth"
            element={
              <ProtectedRoute>
                <GrowthProPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/social/connect"
            element={
              <ProtectedRoute>
                <ConnectSocialPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/social/publish/:videoId"
            element={
              <ProtectedRoute>
                <PublishPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
