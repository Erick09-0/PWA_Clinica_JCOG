// src/components/ui/Toast.tsx
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast, type Toast as ToastType } from '../../contexts/ToastContext';

const toastConfig = {
  success: {
    icon: CheckCircle2,
    bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    borderColor: 'border-green-200 dark:border-green-800/30',
    iconBg: 'bg-green-500',
    textColor: 'text-green-700 dark:text-green-400',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  error: {
    icon: XCircle,
    bgGradient: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
    borderColor: 'border-red-200 dark:border-red-800/30',
    iconBg: 'bg-red-500',
    textColor: 'text-red-700 dark:text-red-400',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  warning: {
    icon: AlertTriangle,
    bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800/30',
    iconBg: 'bg-amber-500',
    textColor: 'text-amber-700 dark:text-amber-400',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  info: {
    icon: Info,
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800/30',
    iconBg: 'bg-blue-500',
    textColor: 'text-blue-700 dark:text-blue-400',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
};

function ToastItem({ toast }: { toast: ToastType }) {
  const { removeToast } = useToast();
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ type: 'spring', duration: 0.4 }}
      className={`
        bg-gradient-to-br ${config.bgGradient} 
        backdrop-blur-2xl backdrop-saturate-150 
        rounded-2xl p-4 
        border ${config.borderColor}
        shadow-[0_8px_32px_rgba(31,41,55,0.12),0_1px_2px_rgba(0,0,0,0.05)]
        min-w-[320px] max-w-[420px]
        flex items-start gap-3
        pointer-events-auto
      `}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
        className={`p-2 ${config.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}
      >
        <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
      </motion.div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${config.textColor} break-words`}>
          {toast.message}
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => removeToast(toast.id)}
        className={`
          p-1.5 rounded-lg 
          hover:bg-white/20 dark:hover:bg-black/20 
          transition-colors flex-shrink-0
          ${config.textColor}
        `}
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[9999] pointer-events-none flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

