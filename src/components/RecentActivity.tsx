import { useEffect, useState } from 'react';
import { RefreshCw, Package, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { getRecentMovements, type RecentMovement } from '../services/activityService';

const typeConfig = {
  entrada: { icon: Package, gradient: 'from-blue-500 to-blue-600', label: 'Entrada' },
  salida: { icon: CheckCircle, gradient: 'from-cyan-500 to-blue-600', label: 'Salida' },
  alerta: { icon: AlertCircle, gradient: 'from-amber-500 to-orange-500', label: 'Alerta' },
  vencimiento: { icon: Clock, gradient: 'from-indigo-500 to-blue-600', label: 'Vencimiento' },
};

export function RecentActivity({ onViewHistory }: { onViewHistory?: () => void }) {
  const [activities, setActivities] = useState<RecentMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecentMovements(6);
      setActivities(data);
    } catch (err: any) {
      const message =
        err instanceof Error ? err.message : 'No se pudo obtener la actividad reciente.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl p-4 sm:p-6 lg:p-7 shadow border border-white/40 dark:border-slate-700/30"
    >
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.3 }}
          className="flex items-center gap-2 sm:gap-3 min-w-0"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.35, type: 'spring', stiffness: 200, damping: 15 }}
            className="p-2 sm:p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0"
          >
            <Clock size={18} className="sm:w-5 sm:h-5 text-white" strokeWidth={2} />
          </motion.div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1 text-sm sm:text-base">
              Actividad reciente
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              Últimos movimientos registrados
            </p>
          </div>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 sm:p-2.5 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl transition-all"
          onClick={fetchActivities}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={`sm:w-[18px] sm:h-[18px] text-blue-600 dark:text-blue-400 ${loading ? 'animate-spin' : ''}`}
          />
        </motion.button>
      </div>

      {error ? (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
          {error}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {loading && activities.length === 0 ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 rounded-2xl bg-gray-100 dark:bg-slate-700 animate-pulse"
                />
              ))
            ) : activities.length === 0 ? (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
                No hay actividad reciente registrada.
              </div>
            ) : (
              activities.map((activity, index) => {
                const config = typeConfig[activity.movement_type as keyof typeof typeConfig] || typeConfig.salida;
                const Icon = config.icon;
                const timeAgo = formatDistanceToNow(new Date(activity.created_at), {
                  addSuffix: true,
                  locale: es,
                });

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 1.5 + index * 0.1,
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                    }}
                    whileHover={{ x: 4, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    className="flex items-start gap-4 pb-3 border-b border-white/30 dark:border-slate-700/30 last:border-0 px-3 py-3 rounded-2xl transition-all hover:bg-white/40 dark:hover:bg-blue-950/20 backdrop-blur-md bg-white/20 dark:bg-slate-900/30"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 1.6 + index * 0.1,
                        type: 'spring',
                        stiffness: 200,
                        damping: 15,
                      }}
                      className={`w-11 h-11 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                    >
                      <Icon size={20} className="text-white" strokeWidth={2.5} />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white mb-0.5">
                        {config.label}: {activity.product_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.quantity} unidades • {activity.reason || 'Sin descripción'}
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 whitespace-nowrap font-medium">
                      {timeAgo}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9 }}
            className="mt-6 text-center"
          >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-5 py-2.5 rounded-xl shadow-lg transition-all"
          onClick={() => onViewHistory?.()}
        >
          Ver historial completo →
        </motion.button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
