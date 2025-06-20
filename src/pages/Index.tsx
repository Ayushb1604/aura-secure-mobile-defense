
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from '@/components/AuthPage';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SecurityProvider } from '@/components/SecurityProvider';
import { MainLayout } from '@/components/MainLayout';
import { Dashboard } from '@/components/Dashboard';
import { AntivirusPage } from '@/components/pages/AntivirusPage';
import { VPNPage } from '@/components/pages/VPNPage';
import { SafeZonePage } from '@/components/pages/SafeZonePage';
import { ChatPage } from '@/components/pages/ChatPage';
import { SettingsPage } from '@/components/pages/SettingsPage';
import { ThreatMonitor } from '@/components/ThreatMonitor';
import { PrivacyDashboard } from '@/components/PrivacyDashboard';
import { AuthProvider } from '@/hooks/useAuth';

const Index = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'antivirus':
        return <AntivirusPage />;
      case 'vpn':
        return <VPNPage />;
      case 'safezone':
        return <SafeZonePage />;
      case 'chat':
        return <ChatPage />;
      case 'settings':
        return <SettingsPage />;
      case 'threats':
        return <ThreatMonitor />;
      case 'privacy':
        return <PrivacyDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SecurityProvider>
      <MainLayout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </MainLayout>
    </SecurityProvider>
  );
};

export default Index;
