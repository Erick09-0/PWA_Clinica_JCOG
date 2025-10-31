import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950"
      onAnimationComplete={() => {
        setTimeout(onComplete, 2500);
      }}
    >
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.1 }}
          transition={{ duration: 2, delay: 0.2, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full blur-3xl"
        />
      </div>

      {/* Content - Centered vertically with better spacing */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-20">
        
        {/* Logo/Icon - Top section with more margin */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.8, 
            type: 'spring', 
            stiffness: 200, 
            damping: 15 
          }}
          className="relative mb-12"
        >
          {/* Outer ring */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 -m-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: 'linear' 
              }}
              className="w-40 h-40 rounded-full border-2 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"
            />
          </motion.div>

          {/* Main icon container - Larger */}
          <div className="relative w-28 h-28 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
            
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            >
              <Activity size={40} className="text-white" strokeWidth={2.5} />
            </motion.div>
          </div>
        </motion.div>

        {/* Text content - Middle section with better spacing */}
        <div className="text-center space-y-4 max-w-md px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 dark:from-blue-400 dark:via-blue-500 dark:to-indigo-400 bg-clip-text text-transparent leading-tight">
              Clínica Juan Carlos<br />Ojeda Gallardo
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="pt-2"
          >
            <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
              Sistema de Control de Inventarios Médicos
            </p>
          </motion.div>

          {/* Loading indicator - More space from text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="pt-8"
          >
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                className="w-2.5 h-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="w-2.5 h-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="w-2.5 h-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Version badge - Fixed at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-16"
        >
          <div className="px-5 py-2.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-full border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Versión 1.0
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
