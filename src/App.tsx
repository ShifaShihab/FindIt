import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { HomePage } from './components/pages/HomePage';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ReportItemPage } from './components/pages/ReportItemPage';
import { SearchItemsPage } from './components/pages/SearchItemsPage';
import { AdminPage } from './components/pages/AdminPage';

function AppContent() {
  const { loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'login':
        return (
          <div className="min-h-screen bg-gray-50 py-12">
            <LoginForm
              onSuccess={() => setCurrentPage('home')}
              onSwitchToRegister={() => setCurrentPage('register')}
            />
          </div>
        );
      case 'register':
        return (
          <div className="min-h-screen bg-gray-50 py-12">
            <RegisterForm
              onSuccess={() => setCurrentPage('home')}
              onSwitchToLogin={() => setCurrentPage('login')}
            />
          </div>
        );
      case 'report':
        return <ReportItemPage onNavigate={setCurrentPage} />;
      case 'search':
        return <SearchItemsPage onNavigate={setCurrentPage} />;
      case 'admin':
        return <AdminPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
