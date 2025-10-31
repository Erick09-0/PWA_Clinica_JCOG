import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, RefreshCw } from 'lucide-react';

const data = [
  { name: 'Analgésicos', value: 45, color: '#3b82f6' },
  { name: 'Antibióticos', value: 30, color: '#06b6d4' },
  { name: 'Material Médico', value: 55, color: '#6366f1' },
  { name: 'Sueros y Soluciones', value: 40, color: '#0ea5e9' },
  { name: 'Material de Curación', value: 35, color: '#8b5cf6' },
  { name: 'Otros', value: 42, color: '#60a5fa' },
];

export function CategoryDistribution() {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="bg-gradient-to-r from-gray-900 to-blue-900 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs space-y-1 shadow-xl border border-blue-400"
        >
          <div className="font-semibold text-blue-300">
            {payload[0].name}
          </div>
          <div className="font-medium">{payload[0].value} productos</div>
          <div className="text-blue-200 text-xs">
            {((payload[0].value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}% del total
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-4 px-2 sm:px-0">
        {payload.map((entry: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + (index * 0.05) }}
            className="flex items-center gap-1.5 sm:gap-2"
          >
            <div 
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium transition-colors truncate">{entry.value}</span>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl p-4 sm:p-6 lg:p-7 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
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
            <h3 className="font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1 transition-colors text-sm sm:text-base truncate">Distribución por Categorías</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors hidden sm:block">Inventario organizado por tipo de producto</p>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all"
          >
            <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px] text-blue-600 dark:text-blue-400 transition-colors" />
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1 }}
        className="rounded-xl sm:rounded-2xl p-1 sm:p-4 transition-all duration-300"
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} verticalAlign="bottom" height={80} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-100 dark:border-slate-700 grid grid-cols-3 gap-2 sm:gap-4 transition-colors"
      >
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium transition-colors">Total Productos</div>
          <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            247
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium transition-colors">Categorías</div>
          <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            6
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium transition-colors">Más Stock</div>
          <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Material
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
