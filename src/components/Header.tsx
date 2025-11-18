import { Search, Bell, Sun, Moon, Menu, AlertTriangle, Clock, BellRing } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useAlerts } from '../hooks/useAlerts';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';

interface HeaderProps {
  onMenuClick?: () => void;
  onOpenAlerts?: () => void;
}

export function Header({ onMenuClick, onOpenAlerts }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { alerts, loading, markAlertAsRead, markAllAsRead } = useAlerts();
  const unreadAlerts = alerts.filter((alert) => !alert.isRead);
  const previewAlerts = unreadAlerts.slice(0, 4);
  const currentDate = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-gray-200/50 dark:border-slate-700/50 transition-colors duration-300"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Menu Button + User Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Menu Button */}
          <motion.button
            onClick={onMenuClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all"
          >
            <Menu size={24} className="text-gray-600 dark:text-gray-400" />
          </motion.button>

          {/* User Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-3 sm:gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-blue-100 dark:ring-blue-900">
                <AvatarImage src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop" />
                <AvatarFallback className="bg-blue-600 text-white font-semibold">DG</AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="hidden sm:block">
              <div className="font-semibold text-gray-900 dark:text-white transition-colors text-sm lg:text-base">Hola, Dr. García</div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize transition-colors hidden md:block">{currentDate}</div>
            </div>
          </motion.div>
        </div>

        {/* Search and Icons */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          {/* Search - Hidden on small mobile */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <motion.input 
              whileFocus={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              type="text"
              placeholder="Buscar medicamento..."
              className="pl-10 lg:pl-11 pr-4 lg:pr-5 py-2.5 lg:py-3 bg-gray-50 dark:bg-slate-900/50 border-0 rounded-xl w-48 lg:w-64 xl:w-96 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Search icon for mobile */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="md:hidden p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all"
          >
            <Search size={20} className="text-gray-600 dark:text-gray-400" />
          </motion.button>
          
          {/* Theme Toggle */}
          <motion.button 
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {theme === 'light' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun size={20} className="text-amber-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon size={20} className="text-blue-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <Popover>
            <PopoverTrigger asChild>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all relative"
              >
                <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                {unreadAlerts.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 px-1.5 py-0.5 bg-red-500 text-[10px] font-semibold text-white rounded-full"
                  >
                    {unreadAlerts.length}
                  </motion.span>
                )}
              </motion.button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 border-0 bg-transparent shadow-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 dark:border-slate-800/50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-100/60 dark:border-slate-800/60 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Alertas</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {loading ? 'Sincronizando...' : `${unreadAlerts.length} pendientes`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-600 dark:text-blue-400"
                    onClick={() => markAllAsRead()}
                    disabled={!unreadAlerts.length}
                  >
                    Marcar leído
                  </Button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100/70 dark:divide-slate-800/70">
                  {loading ? (
                    <div className="p-5 text-center text-sm text-gray-500 dark:text-gray-400">
                      Cargando alertas...
                    </div>
                  ) : previewAlerts.length > 0 ? (
                    previewAlerts.map((alert) => {
                      const Icon =
                        alert.type === 'critical'
                          ? AlertTriangle
                          : alert.type === 'warning'
                          ? Clock
                          : BellRing;
                      const gradient =
                        alert.type === 'critical'
                          ? 'from-red-500/90 to-rose-600/90'
                          : alert.type === 'warning'
                          ? 'from-amber-500/90 to-orange-500/90'
                          : 'from-blue-500/90 to-blue-600/90';
                      return (
                        <button
                          key={alert.id}
                          className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-gray-50/70 dark:hover:bg-slate-800/70 transition-colors"
                          onClick={() => markAlertAsRead(alert.id)}
                        >
                          <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}>
                            <Icon size={18} />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {alert.title}
                              </p>
                              <span className="text-[11px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                {alert.time}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                              {alert.message}
                            </p>
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1 truncate">
                              {alert.product}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-5 text-center text-sm text-gray-500 dark:text-gray-400">
                      No hay alertas pendientes
                    </div>
                  )}
                </div>

                <div className="px-4 py-3 bg-gray-50/60 dark:bg-slate-900/60 flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => markAllAsRead()}
                    disabled={!unreadAlerts.length}
                  >
                    Limpiar
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    onClick={() => {
                      markAllAsRead();
                      onOpenAlerts?.();
                    }}
                  >
                    Ver Centro de Alertas
                  </Button>
                </div>
              </motion.div>
            </PopoverContent>
          </Popover>
        </motion.div>
      </div>
    </motion.header>
  );
}
