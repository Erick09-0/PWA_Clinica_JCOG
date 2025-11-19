import { useMemo } from 'react';
import { TrendingUp, RefreshCw, Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { motion } from 'motion/react';
import { useAnalytics } from '../hooks/useAnalytics';

export function GraphsAnalysis() {
  const { data, loading, error, refresh } = useAnalytics();
  const chartData = data?.monthlyMovements ?? [];

  const summary = useMemo(() => {
    if (!chartData.length) {
      return { avg: 0, max: 0, trend: 0 };
    }
    const total = chartData.reduce((sum, point) => sum + point.egresos, 0);
    const avg = total / chartData.length;
    const max = Math.max(...chartData.map((point) => point.egresos));
    const last = chartData[chartData.length - 1]?.egresos ?? 0;
    const prev = chartData[chartData.length - 2]?.egresos ?? last;
    const trend = prev ? ((last - prev) / prev) * 100 : 0;
    return { avg: Math.round(avg), max, trend: Math.round(trend) };
  }, [chartData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="bg-gradient-to-r from-gray-900 to-blue-900 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs space-y-1 shadow-xl border border-blue-400"
        >
          <div className="font-semibold text-blue-300">{payload[0].payload.month}</div>
          <div className="font-medium">{payload[0].value} movimientos</div>
          <div className="text-blue-200 text-xs">
            Stock: {payload[0].payload.stock} | Ingresos: {payload[0].payload.ingresos}
          </div>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl p-4 sm:p-6 lg:p-7 shadow border border-white/40 dark:border-slate-700/30"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
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
            className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0"
          >
            <TrendingUp size={18} className="sm:w-5 sm:h-5 text-white" strokeWidth={2} />
          </motion.div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1 text-sm sm:text-base">
              Movimiento de inventario
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              Tendencia mensual de entradas y salidas
            </p>
          </div>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 sm:p-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all"
          onClick={() => refresh()}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="rounded-xl sm:rounded-2xl p-1 sm:p-4 transition-all duration-300"
          >
            {chartData.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
                No hay movimientos suficientes para mostrar.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220} className="sm:!h-[240px]">
                <BarChart
                  data={chartData.map((point) => ({
                    month: point.month,
                    ingresos: point.ingresos,
                    egresos: point.egresos,
                    stock: point.stock,
                    value: point.egresos,
                  }))}
                  barGap={8}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 500 }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" radius={[8, 8, 8, 8]} animationBegin={0} animationDuration={800}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === chartData.length - 1 ? 'url(#colorGradient)' : '#e0f2fe'}
                      />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-slate-700 grid grid-cols-3 gap-2 sm:gap-4 text-center"
          >
            {[
              { label: 'Promedio', value: summary.avg },
              { label: 'Máximo', value: summary.max },
              { label: 'Tendencia', value: `${summary.trend > 0 ? '+' : ''}${summary.trend}%` },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">{item.label}</div>
                <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {Number.isFinite(item.value) ? item.value : '—'}
                </div>
              </div>
            ))}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
