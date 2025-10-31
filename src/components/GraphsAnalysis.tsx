import { useState } from 'react';
import { TrendingUp, ChevronDown, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'motion/react';

const data = [
  { month: 'Ene', value: 145 },
  { month: 'Feb', value: 165 },
  { month: 'Mar', value: 132 },
  { month: 'Abr', value: 178 },
  { month: 'May', value: 210 },
  { month: 'Jun', value: 156 },
  { month: 'Jul', value: 189 },
  { month: 'Ago', value: 165 },
  { month: 'Sep', value: 195 },
];

export function GraphsAnalysis() {
  const [selectedPeriod, setSelectedPeriod] = useState('Últimos 9 meses');

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
          <div className="font-medium">{payload[0].value} productos</div>
          <div className="text-blue-200 text-xs">Valor: ${(payload[0].value * 45).toLocaleString()}</div>
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
      className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl p-4 sm:p-6 lg:p-7 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
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
            <h3 className="font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1 transition-colors text-sm sm:text-base">Movimiento de Inventario</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors hidden sm:block">Productos despachados por mes</p>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4 }}
          className="flex items-center gap-2 self-end sm:self-auto"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all flex items-center gap-1.5 sm:gap-2 text-blue-700 dark:text-blue-400"
          >
            <span className="hidden sm:inline">{selectedPeriod}</span>
            <span className="sm:hidden">9 meses</span>
            <ChevronDown size={14} className="sm:w-4 sm:h-4 text-blue-400 dark:text-blue-500" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 sm:p-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all"
          >
            <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px] text-blue-600 dark:text-blue-400 transition-colors" />
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="rounded-xl sm:rounded-2xl p-1 sm:p-4 transition-all duration-300"
      >
        <ResponsiveContainer width="100%" height={200} className="sm:!h-[220px]">
          <BarChart data={data} barGap={8} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 500 }}
              className="sm:text-xs"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6b7280' }}
              className="sm:text-xs"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar 
              dataKey="value" 
              radius={[8, 8, 8, 8]}
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.month === 'May' 
                    ? 'url(#colorGradient)' 
                    : '#e0f2fe'
                  } 
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}
        className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-slate-700 grid grid-cols-3 gap-2 sm:gap-4 text-center transition-colors"
      >
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium transition-colors">Promedio</div>
          <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">173</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium transition-colors">Más Alto</div>
          <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">210</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium transition-colors">Tendencia</div>
          <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">+12%</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
