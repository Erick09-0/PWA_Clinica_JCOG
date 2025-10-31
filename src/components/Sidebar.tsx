import { 
  LayoutDashboard, 
  Package, 
  AlertCircle, 
  TrendingUp, 
  FileText, 
  Settings, 
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function Sidebar({ activeSection, onSectionChange, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'inventario', icon: Package, label: 'Inventario' },
    { id: 'alertas', icon: AlertCircle, label: 'Alertas', badge: 3 },
    { id: 'analisis', icon: TrendingUp, label: 'Análisis' },
    { id: 'reportes', icon: FileText, label: 'Reportes' },
    { id: 'configuracion', icon: Settings, label: 'Configuración' },
    { id: 'ayuda', icon: HelpCircle, label: 'Ayuda' },
    { id: 'logout', icon: LogOut, label: 'Cerrar Sesión', danger: true },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="px-3 mb-6 lg:mb-8"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Package size={22} className="text-white" strokeWidth={2.5} />
          </motion.div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white transition-colors text-sm leading-tight">Clínica Juan Carlos</div>
            <div className="font-semibold text-gray-900 dark:text-white transition-colors text-sm leading-tight">Ojeda Gallardo</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors mt-1">Sistema de Inventario</div>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = item.id === activeSection;
            const Icon = item.icon;
            
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (index * 0.05) }}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSectionChange(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : item.danger 
                      ? 'text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }
                `}
              >
                <motion.div
                  whileHover={{ 
                    rotate: item.id === 'configuracion' ? 180 : 0,
                    scale: 1.2 
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Icon 
                    size={20} 
                    strokeWidth={2} 
                    className={isActive ? 'text-white' : item.danger ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}
                  />
                </motion.div>
                <span className={`flex-1 text-left font-medium ${item.danger && !isActive ? 'text-red-500' : ''}`}>
                  {item.label}
                </span>
                {item.badge && !isActive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-semibold"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-auto pt-4 border-t border-gray-200 dark:border-slate-700 transition-colors"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="px-4 py-4 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30 backdrop-blur rounded-2xl border border-gray-200/50 dark:border-slate-700/50 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            {/* Avatar con gradiente */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">DG</span>
              </div>
              {/* Indicador de estado activo */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"></div>
            </div>
            
            {/* Info del usuario */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-white transition-colors truncate">
                Dr. García
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                Administrador
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex w-64 xl:w-72 2xl:w-80 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl flex-col px-3 py-6 border-r border-gray-200/50 dark:border-slate-700/50 shadow-sm transition-colors duration-300"
      >
        <SidebarContent />
      </motion.div>

      {/* Mobile Sidebar - Slide in from left */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            
            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 sm:w-80 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl flex flex-col px-3 py-6 border-r border-gray-200/50 dark:border-slate-700/50 shadow-2xl z-50"
            >
              {/* Close button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                <X size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
              
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
