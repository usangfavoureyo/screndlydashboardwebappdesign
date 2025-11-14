import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { DashboardOverview } from './components/DashboardOverview';
import { ChannelsPage } from './components/ChannelsPage';
import { PlatformsPage } from './components/PlatformsPage';
import { LogsPage } from './components/LogsPage';
import { SettingsPage } from './components/SettingsPage';
import { ThumbnailDesignerPage } from './components/ThumbnailDesignerPage';
import { Navigation } from './components/Navigation';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SplashScreen } from './components/SplashScreen';
import { ThemeProvider } from './components/ThemeProvider';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  if (isLoading) {
    return <SplashScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <ThemeProvider>
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <div className="min-h-screen bg-[#000000]">
          <Navigation
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            onLogout={handleLogout}
          />
          <main className="lg:ml-64 pb-16 lg:pb-0">
            <div className="p-4 sm:p-6 lg:p-8">
              {currentPage === 'dashboard' && <DashboardOverview />}
              {currentPage === 'channels' && <ChannelsPage />}
              {currentPage === 'platforms' && <PlatformsPage />}
              {currentPage === 'logs' && <LogsPage />}
              {currentPage === 'thumbnail' && <ThumbnailDesignerPage />}
              {currentPage === 'settings' && <SettingsPage />}
            </div>
          </main>
          <MobileBottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
        </div>
      )}
    </ThemeProvider>
  );
}