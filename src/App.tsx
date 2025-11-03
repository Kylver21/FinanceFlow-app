import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanzasProvider } from './context/FinanzasContext';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Ingresos } from './pages/Ingresos';
import { Gastos } from './pages/Gastos';
import { Reportes } from './pages/Reportes';
import { Alertas } from './pages/Alertas';
import { Categorias } from './pages/Categorias';
import { AuthPage } from './pages/AuthPage';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'ingresos':
        return <Ingresos />;
      case 'gastos':
        return <Gastos />;
      case 'reportes':
        return <Reportes />;
      case 'alertas':
        return <Alertas />;
      case 'categorias':
        return <Categorias />;
      default:
        return <Dashboard />;
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado, mostrar página de login
  if (!user) {
    return <AuthPage />;
  }

  // Usuario autenticado, mostrar la aplicación
  return (
    <FinanzasProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          {renderPage()}
        </main>
      </div>
    </FinanzasProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
