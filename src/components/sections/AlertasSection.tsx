import { motion } from 'motion/react';
import { AlertTriangle, Clock, Package, Bell } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const alerts = [
  {
    id: 1,
    type: 'critical',
    icon: AlertTriangle,
    title: 'Stock Crítico',
    message: 'Guantes de Látex tiene solo 8 unidades (mínimo: 100)',
    product: 'Guantes de Látex',
    time: 'Hace 2 horas',
    action: 'Generar Pedido'
  },
  {
    id: 2,
    type: 'critical',
    icon: AlertTriangle,
    title: 'Stock Crítico',
    message: 'Paracetamol 500mg está por debajo del stock mínimo',
    product: 'Paracetamol 500mg',
    time: 'Hace 4 horas',
    action: 'Generar Pedido'
  },
  {
    id: 3,
    type: 'warning',
    icon: Clock,
    title: 'Próximo a Vencer',
    message: 'Suero Fisiológico 500ml vence en 15 días',
    product: 'Suero Fisiológico 500ml',
    time: 'Hace 1 día',
    action: 'Ver Detalles'
  },
  {
    id: 4,
    type: 'critical',
    icon: AlertTriangle,
    title: 'Stock Crítico',
    message: 'Vendas Elásticas 10cm por debajo del mínimo requerido',
    product: 'Vendas Elásticas 10cm',
    time: 'Hace 6 horas',
    action: 'Generar Pedido'
  },
  {
    id: 5,
    type: 'warning',
    icon: Clock,
    title: 'Próximo a Vencer',
    message: 'Alcohol 70% vence en 25 días',
    product: 'Alcohol 70%',
    time: 'Hace 2 días',
    action: 'Ver Detalles'
  },
  {
    id: 6,
    type: 'info',
    icon: Package,
    title: 'Pedido Pendiente',
    message: 'Pedido #12345 en proceso de entrega',
    product: 'Múltiples productos',
    time: 'Hace 3 horas',
    action: 'Seguimiento'
  },
];

const typeConfig = {
  critical: {
    gradient: 'from-red-500 to-rose-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: 'text-red-600'
  },
  warning: {
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    icon: 'text-amber-600'
  },
  info: {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: 'text-blue-600'
  }
};

export function AlertasSection() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Centro de Alertas</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">Notificaciones importantes que requieren tu atención</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        {[
          { label: 'Alertas Críticas', value: '3', icon: AlertTriangle, color: 'from-red-500 to-rose-600' },
          { label: 'Alertas Advertencia', value: '2', icon: Clock, color: 'from-amber-500 to-orange-500' },
          { label: 'Notificaciones', value: '1', icon: Bell, color: 'from-blue-500 to-blue-600' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
            className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
              <div className={`p-2.5 sm:p-3 bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl shadow-lg`}>
                <stat.icon size={20} className="sm:w-6 sm:h-6 text-white" strokeWidth={2} />
              </div>
              <div className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors text-center sm:text-left">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3 sm:space-y-4">
        {alerts.map((alert, index) => {
          const config = typeConfig[alert.type as keyof typeof typeConfig];
          const Icon = alert.icon;
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ x: 4, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              className={`bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border ${config.border}/30 dark:border-slate-700/30 transition-all`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, type: 'spring' }}
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${config.bg} dark:bg-opacity-20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0`}
                >
                  <Icon size={20} className={`sm:w-6 sm:h-6 ${config.icon}`} strokeWidth={2.5} />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors text-sm sm:text-base">{alert.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors">{alert.message}</p>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 transition-colors sm:ml-4 flex-shrink-0">{alert.time}</div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 sm:mt-4">
                    <div className="flex items-center gap-2">
                      <Package size={14} className="sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 transition-colors flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors truncate">{alert.product}</span>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                      <Button 
                        size="sm" 
                        className={`w-full sm:w-auto bg-gradient-to-r ${config.gradient} text-white shadow-md hover:shadow-lg text-xs sm:text-sm`}
                      >
                        {alert.action}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-4"
      >
        <Button variant="outline" className="gap-2 text-sm">
          Marcar todas como leídas
        </Button>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white gap-2 text-sm">
          Configurar Alertas
        </Button>
      </motion.div>
    </div>
  );
}
