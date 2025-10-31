import { Package, TrendingDown, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

const stats = [
  {
    title: 'Total de Productos',
    value: '247',
    subtitle: '8 categorías',
    icon: Package,
    gradient: 'from-blue-500 to-blue-600',
    trend: '+12 este mes'
  },
  {
    title: 'Stock Bajo',
    value: '18',
    subtitle: 'Requieren atención',
    icon: TrendingDown,
    gradient: 'from-amber-500 to-orange-500',
    trend: '3 críticos'
  },
  {
    title: 'Por Vencer (30 días)',
    value: '6',
    subtitle: 'Próximos a caducar',
    icon: Clock,
    gradient: 'from-cyan-500 to-blue-500',
    trend: '2 este mes'
  },
  {
    title: 'Pedidos Pendientes',
    value: '4',
    subtitle: 'En proceso',
    icon: CheckCircle,
    gradient: 'from-blue-600 to-indigo-600',
    trend: 'Actualizado hoy'
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((stat, index) => (
        <motion.div 
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            delay: 0.4 + (index * 0.1), 
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
          }}
          whileHover={{ y: -6, boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.2)' }}
          className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_rgba(59,130,246,0.15)] transition-all cursor-pointer border border-white/40 dark:border-slate-700/30 overflow-hidden relative"
        >
          {/* Gradient Background */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-16 -mt-16`}></div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2 transition-colors">{stat.title}</div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                  className="text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-1"
                  style={{ 
                    backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                  }}
                >
                  <span className={`bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </span>
                </motion.div>
                <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{stat.subtitle}</div>
              </div>
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5 + (index * 0.1), type: 'spring', stiffness: 200, damping: 15 }}
                className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg`}
              >
                <stat.icon size={24} className="text-white" strokeWidth={2} />
              </motion.div>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.7 + (index * 0.1), duration: 0.8 }}
              className="h-1 bg-gradient-to-r bg-opacity-20 rounded-full mb-3"
              style={{ 
                backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
              }}
            >
              <div className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full w-3/4`}></div>
            </motion.div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 transition-colors">
              {stat.trend}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
