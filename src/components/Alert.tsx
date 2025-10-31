import { Button } from './ui/button';
import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

export function Alert() {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/40 dark:border-amber-800/30 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(245,158,11,0.05)] hover:shadow-[0_12px_48px_rgba(245,158,11,0.12)] transition-all"
    >
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
          whileHover={{ rotate: 10, scale: 1.1 }}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
        >
          <AlertTriangle size={20} className="sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex-1"
        >
          <div className="font-semibold text-amber-900 dark:text-amber-100 mb-1 transition-colors text-sm sm:text-base">¡Atención! Stock crítico detectado</div>
          <div className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 transition-colors">
            Tienes <span className="font-semibold">3 productos</span> con niveles de inventario por debajo del mínimo requerido.
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full sm:w-auto"
      >
        <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl shadow-lg transition-all hover:shadow-xl font-medium text-sm">
          Ver Detalles
        </Button>
      </motion.div>
    </motion.div>
  );
}
