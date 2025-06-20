
import { useState } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SecurityProvider } from '@/components/SecurityProvider';
import { MainLayout } from '@/components/MainLayout';
import { Dashboard } from '@/components/Dashboard';
import { AntivirusPage } from '@/components/pages/AntivirusPage';
import { VPNPage } from '@/components/pages/VPNPage';
import { SafeZonePage } from '@/components/pages/SafeZonePage';
import { ChatPage } from '@/components/pages/ChatPage';
import { SettingsPage } from '@/components/pages/SettingsPage';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

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
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <SecurityProvider>
        <MainLayout currentPage={currentPage} onPageChange={setCurrentPage}>
          {renderPage()}
        </MainLayout>
      </SecurityProvider>
    </ThemeProvider>
  );
};

export default Index;
