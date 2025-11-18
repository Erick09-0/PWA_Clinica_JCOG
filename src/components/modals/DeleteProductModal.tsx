// src/components/modals/DeleteProductModal.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, AlertTriangle, Package, Tag, TrendingDown, Loader2 } from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';
import { useToast } from '../../contexts/ToastContext';
import type { Product } from '../../types/database.types';

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess?: () => void;
}

const statusConfig = {
  good: { label: 'Óptimo', bgColor: 'bg-green-50 dark:bg-green-900/20', textColor: 'text-green-700 dark:text-green-400' },
  low: { label: 'Bajo', bgColor: 'bg-amber-50 dark:bg-amber-900/20', textColor: 'text-amber-700 dark:text-amber-400' },
  critical: { label: 'Crítico', bgColor: 'bg-red-50 dark:bg-red-900/20', textColor: 'text-red-700 dark:text-red-400' }
};

export function DeleteProductModal({ isOpen, onClose, product, onSuccess }: DeleteProductModalProps) {
  const { deleteProduct } = useInventory();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!product) return;

    setLoading(true);

    try {
      const deleteSuccess = await deleteProduct(product.id);

      if (deleteSuccess) {
        success('Producto eliminado exitosamente');
        onSuccess?.();
        onClose();
      } else {
        showError('Error al eliminar el producto');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      showError('Error al eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop con blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl shadow-[0_8px_32px_rgba(31,41,55,0.12)] border border-white/40 dark:border-slate-700/30 pointer-events-auto"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-3xl">
                <div className="flex items-start justify-between">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs opacity-80 mb-1">ID: #{product.id}</div>
                      <h2 className="text-2xl font-bold">Eliminar Producto</h2>
                      <p className="text-sm opacity-80 mt-1">Esta acción no se puede deshacer</p>
                    </div>
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    disabled={loading}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Mensaje de advertencia */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 backdrop-blur-xl rounded-2xl p-4 border border-red-200 dark:border-red-800/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-500/10 rounded-xl mt-0.5">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-1">
                        ¿Estás seguro de eliminar este producto?
                      </h3>
                      <p className="text-sm text-red-600 dark:text-red-500">
                        Esta acción eliminará permanentemente el producto del inventario. Esta operación no se puede deshacer.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Información del producto */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 dark:border-slate-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Información del Producto
                  </h3>
                  
                  <div className="space-y-3">
                    {/* Nombre */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-xl rounded-xl p-3 border border-blue-100 dark:border-blue-800/30">
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Nombre</div>
                      <div className="text-base font-bold text-gray-900 dark:text-white">{product.name}</div>
                    </div>

                    {/* Grid de información */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Categoría */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-xl rounded-xl p-3 border border-purple-100 dark:border-purple-800/30">
                        <div className="flex items-center gap-2 mb-1">
                          <Tag className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Categoría</div>
                        </div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{product.category}</div>
                      </div>

                      {/* Estado */}
                      <div className={`backdrop-blur-xl rounded-xl p-3 border ${statusConfig[product.status].bgColor} border-0`}>
                        <div className={`text-xs font-medium mb-1 ${statusConfig[product.status].textColor}`}>Estado</div>
                        <div className={`text-sm font-semibold ${statusConfig[product.status].textColor}`}>
                          {statusConfig[product.status].label}
                        </div>
                      </div>
                    </div>

                    {/* Stock */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-xl rounded-xl p-3 border border-green-100 dark:border-green-800/30">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingDown className="w-3 h-3 text-green-600 dark:text-green-400" />
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium">Stock Actual / Mínimo</div>
                      </div>
                      <div className="text-base font-bold text-gray-900 dark:text-white">
                        {product.stock} / {product.min_stock} unidades
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Botones */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-3 pt-4"
                >
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-all disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        Eliminar
                      </>
                    )}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

