import { useEffect, useState } from 'react';
import { Search, Filter, AlertTriangle, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { getCriticalProducts, getExpiringProducts } from '../services/inventoryService';

type StatusType = 'critical' | 'low';

const statusConfig: Record<
  StatusType,
  { label: string; color: string; bgColor: string; textColor: string; borderColor: string }
> = {
  critical: {
    label: 'Crítico',
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
  },
  low: {
    label: 'Bajo',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200',
  },
};

export function CriticalProducts() {
  const [products, setProducts] = useState<
    Array<{
      id: number;
      name: string;
      category: string;
      stock: number;
      minStock: number;
      status: StatusType;
      location: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const [critical, expiring] = await Promise.all([
          getCriticalProducts(),
          getExpiringProducts(45),
        ]);

        const enriched = [
          ...critical.map((product) => ({
            id: product.id,
            name: product.name,
            category: product.category,
            stock: product.stock,
            minStock: product.min_stock,
            location: product.location || 'Sin ubicación',
            status: 'critical' as StatusType,
          })),
          ...expiring
            .filter((product) => product.status !== 'critical')
            .map((product) => ({
              id: product.id,
              name: product.name,
              category: product.category,
              stock: product.stock,
              minStock: product.min_stock,
              location: product.location || 'Sin ubicación',
              status: 'low' as StatusType,
            })),
        ];

        setProducts(enriched.slice(0, 6));
      } catch (err: any) {
        const message =
          err instanceof Error ? err.message : 'No se pudieron obtener los productos críticos.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 lg:p-7 shadow border border-white/40 dark:border-slate-700/30 transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-base sm:text-lg">
            Productos críticos
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Niveles de stock que requieren atención inmediata
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.95 }}
          className="flex items-center gap-2"
        >
        </motion.div>
      </div>

      {error ? (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
          {error}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {loading && products.length === 0 ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-20 rounded-2xl bg-gray-100 dark:bg-slate-700 animate-pulse"
              />
            ))
          ) : products.length === 0 ? (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
              No hay productos críticos en este momento.
            </div>
          ) : (
            products.map((product, index) => {
              const status = statusConfig[product.status];
              const stockPercentage = Math.min(
                100,
                Math.round((product.stock / (product.minStock || 1)) * 100)
              );

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  whileHover={{ x: 4, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  className={`flex items-start gap-3 sm:gap-4 pb-3 border-b ${status.borderColor}/20 dark:border-slate-700/30 last:border-0 rounded-2xl px-2 sm:px-3 py-2 sm:py-3 border border-white/30 bg-white/30 dark:bg-slate-900/30 backdrop-blur-lg`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.1 + index * 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 ${status.bgColor} dark:bg-opacity-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}
                  >
                    {product.status === 'critical' ? (
                      <AlertTriangle size={20} className={status.textColor} strokeWidth={2.5} />
                    ) : (
                      <Package size={20} className={status.textColor} strokeWidth={2} />
                    )}
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                        {product.name}
                      </div>
                      <div className={`bg-gradient-to-r ${status.color} text-white text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg font-semibold shadow-sm`}>
                        {status.label}
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {product.category} • {product.location}
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stockPercentage}%` }}
                        transition={{ delay: 1.3 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                        className={`h-full bg-gradient-to-r ${status.color} rounded-full`}
                      />
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className={`text-xl sm:text-2xl font-bold ${status.textColor}`}>
                      {product.stock}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      de {product.minStock}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </motion.div>
  );
}
