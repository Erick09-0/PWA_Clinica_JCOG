import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ThemeProvider } from './contexts/ThemeContext';
import { SplashScreen } from './components/SplashScreen';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Alert } from './components/Alert';
import { StatsCards } from './components/StatsCards';
import { CriticalProducts } from './components/CriticalProducts';
import { GraphsAnalysis } from './components/GraphsAnalysis';
import { CategoryDistribution } from './components/CategoryDistribution';
import { RecentActivity } from './components/RecentActivity';
import { InventarioSection } from './components/sections/InventarioSection';
import { AlertasSection } from './components/sections/AlertasSection';
import { AnalisisSection } from './components/sections/AnalisisSection';
import { ReportesSection } from './components/sections/ReportesSection';
import { ConfiguracionSection } from './components/sections/ConfiguracionSection';
import { AyudaSection } from './components/sections/AyudaSection';

function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showSplash, setShowSplash] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if splash has been shown before in this session
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false); // Close mobile menu when section changes
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-4 sm:space-y-6">
            <Alert />
            <StatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <CriticalProducts />
              <CategoryDistribution />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <GraphsAnalysis />
              <RecentActivity />
            </div>
          </div>
        );
      case 'inventario':
        return <InventarioSection />;
      case 'alertas':
        return <AlertasSection />;
      case 'analisis':
        return <AnalisisSection />;
      case 'reportes':
        return <ReportesSection />;
      case 'configuracion':
        return <ConfiguracionSection />;
      case 'ayuda':
        return <AyudaSection />;
      case 'logout':
        alert('Cerrando sesión...');
        return null;
      default:
        return null;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>
      
      {!showSplash && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex h-screen bg-gradient-to-br from-gray-100/80 via-blue-50/60 to-cyan-100/80 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300"
        >
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={handleSectionChange}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          <div className="flex-1 overflow-auto">
            <Header 
              onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
            <main className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
