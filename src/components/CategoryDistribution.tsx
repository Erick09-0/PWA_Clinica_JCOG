import { useMemo } from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';

export function CategoryDistribution() {
  const { data, loading, error, refresh } = useAnalytics();
  const distribution = data?.categoryDistribution ?? [];
  const totalProducts = data?.totals.totalProducts ?? 0;
  const categoryCount = distribution.length;
  const topCategory = distribution[0]?.name ?? 'N/D';

  const colors = useMemo(
    () =>
      distribution.map((entry, index) => ({
        ...entry,
        color: entry.color || `hsl(${(index * 50) % 360}, 70%, 50%)`,
      })),
    [distribution]
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const total = distribution.reduce((sum, entry) => sum + entry.value, 0);
      const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
      return (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="bg-gradient-to-r from-gray-900 to-blue-900 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs space-y-1 shadow-xl border border-blue-400"
        >
          <div className="font-semibold text-blue-300">{item.name}</div>
          <div className="font-medium">{item.value} productos</div>
          <div className="text-blue-200 text-xs">{percentage}% del total</div>
        </motion.div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-4 px-2 sm:px-0">
      {payload.map((entry: any, index: number) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 + index * 0.05 }}
          className="flex items-center gap-1.5 sm:gap-2"
        >
          <div
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium truncate">
            {entry.value}
          </span>
        </motion.div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl p-4 sm:p-6 lg:p-7 shadow border border-white/40 dark:border-slate-700/30"
    >
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="flex items-center gap-2 sm:gap-3 min-w-0"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.95, type: 'spring', stiffness: 200, damping: 15 }}
            className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0"
          >
            <TrendingUp size={18} className="sm:w-5 sm:h-5 text-white" strokeWidth={2} />
          </motion.div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1 text-sm sm:text-base truncate">
              Distribución por categorías
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              Inventario organizado por tipo de producto
            </p>
          </div>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all"
          onClick={() => refresh()}
          disabled={loading}
        >
          {loading ? (
            <RefreshCw size={16} className="animate-spin text-blue-600 dark:text-blue-400" />
          ) : (
            <RefreshCw size={16} className="text-blue-600 dark:text-blue-400" />
          )}
        </motion.button>
      </div>

      {error ? (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
          {error}
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
            className="rounded-xl sm:rounded-2xl p-1 sm:p-4 transition-all duration-300"
          >
            {distribution.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
                Aún no hay datos para mostrar.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={colors}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {colors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} verticalAlign="bottom" height={80} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-100 dark:border-slate-700 grid grid-cols-3 gap-2 sm:gap-4"
          >
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Total productos</div>
              <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {totalProducts || '—'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Categorías</div>
              <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {categoryCount}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Mayor stock</div>
              <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {topCategory}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
