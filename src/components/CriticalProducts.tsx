import { Search, Filter, AlertTriangle, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { Badge } from './ui/badge';

const products = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    category: 'Analgésicos',
    stock: 15,
    minStock: 50,
    status: 'critical',
    location: 'Estante A-12',
  },
  {
    id: 2,
    name: 'Guantes de Látex',
    category: 'Material Médico',
    stock: 8,
    minStock: 100,
    status: 'critical',
    location: 'Almacén B-3',
  },
  {
    id: 3,
    name: 'Vendas Elásticas 10cm',
    category: 'Material de Curación',
    stock: 22,
    minStock: 30,
    status: 'low',
    location: 'Estante C-5',
  },
  {
    id: 4,
    name: 'Suero Fisiológico 500ml',
    category: 'Soluciones',
    stock: 35,
    minStock: 80,
    status: 'low',
    location: 'Refrigerador 1',
  },
];

const statusConfig = {
  critical: {
    label: 'Crítico',
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-200'
  },
  low: {
    label: 'Bajo',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200'
  }
};

export function CriticalProducts() {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl p-5 sm:p-6 lg:p-7 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors text-base sm:text-lg">Productos Críticos</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors">Productos con stock bajo que requieren atención inmediata</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.95 }}
          className="flex items-center gap-2"
        >
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 sm:p-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all"
          >
            <Search size={18} className="text-blue-600 dark:text-blue-400 transition-colors" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 sm:p-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all"
          >
            <Filter size={18} className="text-blue-600 dark:text-blue-400 transition-colors" />
          </motion.button>
        </motion.div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {products.map((product, index) => {
          const status = statusConfig[product.status as keyof typeof statusConfig];
          const stockPercentage = (product.stock / product.minStock) * 100;
          
          return (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + (index * 0.1) }}
              whileHover={{ x: 4, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              className={`flex items-start sm:items-center gap-3 sm:gap-4 pb-3 sm:pb-4 border-b ${status.borderColor}/20 dark:border-slate-700/30 last:border-0 rounded-2xl transition-all cursor-pointer px-2 sm:px-3 py-2 sm:py-3 border border-white/30 bg-white/30 dark:bg-slate-900/30 backdrop-blur-lg`}
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.1 + (index * 0.1), type: 'spring', stiffness: 200, damping: 15 }}
                className={`w-10 h-10 sm:w-12 sm:h-12 ${status.bgColor} dark:bg-opacity-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}
              >
                {product.status === 'critical' ? (
                  <AlertTriangle size={20} className={`sm:w-6 sm:h-6 ${status.textColor}`} strokeWidth={2.5} />
                ) : (
                  <Package size={20} className={`sm:w-6 sm:h-6 ${status.textColor}`} strokeWidth={2} />
                )}
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                  <div className="font-semibold text-gray-900 dark:text-white transition-colors text-sm sm:text-base">{product.name}</div>
                  <div className={`bg-gradient-to-r ${status.color} text-white text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg font-semibold shadow-sm w-fit`}>
                    {status.label}
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 transition-colors">{product.category} • {product.location}</div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 sm:h-2 overflow-hidden transition-colors">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stockPercentage}%` }}
                    transition={{ delay: 1.3 + (index * 0.1), duration: 0.8, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${status.color} rounded-full shadow-sm`}
                  />
                </div>
              </div>
              
              <div className="text-right flex-shrink-0">
                <div className={`text-xl sm:text-2xl font-bold ${status.textColor}`}>{product.stock}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors">de {product.minStock}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors"
      >
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors">
          Mostrando 4 de 18 productos con stock bajo
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-lg transition-all"
        >
          Ver todos →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
