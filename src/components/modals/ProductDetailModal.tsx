// src/components/modals/ProductDetailModal.tsx
import { motion, AnimatePresence } from 'motion/react';
import { X, Package, MapPin, DollarSign, Calendar, AlertCircle, Tag, TrendingUp, History } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Product } from '../../types/database.types';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const statusConfig = {
  good: { label: 'Óptimo', color: 'bg-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20', textColor: 'text-green-700 dark:text-green-400' },
  low: { label: 'Bajo', color: 'bg-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-900/20', textColor: 'text-amber-700 dark:text-amber-400' },
  critical: { label: 'Crítico', color: 'bg-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20', textColor: 'text-red-700 dark:text-red-400' }
};

export function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
  if (!product) return null;

  const totalValue = product.stock * product.price;
  const stockPercentage = (product.stock / (product.min_stock * 2)) * 100;
  
  // Calcular días restantes hasta vencimiento
  const daysUntilExpiry = product.expiry_date 
    ? Math.ceil((new Date(product.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

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
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl shadow-[0_8px_32px_rgba(31,41,55,0.12)] border border-white/40 dark:border-slate-700/30 pointer-events-auto"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-3xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center gap-3 mb-2"
                    >
                      <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs opacity-80 mb-1">ID: #{product.id}</div>
                        <h2 className="text-2xl font-bold">{product.name}</h2>
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Estado Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mt-3"
                >
                  <div className={`w-2 h-2 rounded-full ${statusConfig[product.status].color}`} />
                  <span className="text-sm font-medium">{statusConfig[product.status].label}</span>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Grid de información principal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Categoría */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-xl rounded-2xl p-4 border border-blue-100 dark:border-blue-800/30"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-500/10 rounded-xl">
                        <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Categoría</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{product.category}</p>
                  </motion.div>

                  {/* Ubicación */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-xl rounded-2xl p-4 border border-purple-100 dark:border-purple-800/30"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-500/10 rounded-xl">
                        <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Ubicación</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{product.location || 'No asignada'}</p>
                  </motion.div>

                  {/* Stock Actual */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-xl rounded-2xl p-4 border border-green-100 dark:border-green-800/30"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-500/10 rounded-xl">
                        <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">Stock Actual</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{product.stock} unidades</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Stock mínimo: {product.min_stock} uds</p>
                    
                    {/* Barra de progreso */}
                    <div className="mt-3 h-2 bg-green-200 dark:bg-green-900/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(stockPercentage, 100)}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className={`h-full rounded-full ${
                          product.status === 'critical' ? 'bg-red-500' :
                          product.status === 'low' ? 'bg-amber-500' :
                          'bg-green-500'
                        }`}
                      />
                    </div>
                  </motion.div>

                  {/* Precio Unitario */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 backdrop-blur-xl rounded-2xl p-4 border border-yellow-100 dark:border-yellow-800/30"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-yellow-500/10 rounded-xl">
                        <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Precio Unitario</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Valor total: ${totalValue.toFixed(2)}</p>
                  </motion.div>
                </div>

                {/* Fecha de Vencimiento */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`bg-gradient-to-br ${
                    daysUntilExpiry && daysUntilExpiry < 30 
                      ? 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-100 dark:border-red-800/30' 
                      : 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800/30'
                  } backdrop-blur-xl rounded-2xl p-4 border`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 ${daysUntilExpiry && daysUntilExpiry < 30 ? 'bg-red-500/10' : 'bg-blue-500/10'} rounded-xl`}>
                      <Calendar className={`w-5 h-5 ${daysUntilExpiry && daysUntilExpiry < 30 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
                    </div>
                    <span className={`text-sm font-medium ${daysUntilExpiry && daysUntilExpiry < 30 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                      Fecha de Vencimiento
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {product.expiry_date 
                        ? format(new Date(product.expiry_date), "dd 'de' MMMM 'de' yyyy", { locale: es })
                        : 'No especificada'
                      }
                    </p>
                    {daysUntilExpiry !== null && (
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                        daysUntilExpiry < 0 ? 'bg-red-500' :
                        daysUntilExpiry < 30 ? 'bg-red-500/20' : 
                        'bg-green-500/20'
                      }`}>
                        <AlertCircle className={`w-4 h-4 ${
                          daysUntilExpiry < 0 ? 'text-white' :
                          daysUntilExpiry < 30 ? 'text-red-600 dark:text-red-400' : 
                          'text-green-600 dark:text-green-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          daysUntilExpiry < 0 ? 'text-white' :
                          daysUntilExpiry < 30 ? 'text-red-600 dark:text-red-400' : 
                          'text-green-600 dark:text-green-400'
                        }`}>
                          {daysUntilExpiry < 0 
                            ? 'Vencido' 
                            : `${daysUntilExpiry} días restantes`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Información Adicional */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 dark:border-slate-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Información Adicional
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Proveedor:</span>
                      <p className="font-medium text-gray-900 dark:text-white mt-1">Farmacéutica Nacional S.A.</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Lote:</span>
                      <p className="font-medium text-gray-900 dark:text-white mt-1">LOT-2024-1AB</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Última actualización:</span>
                      <p className="font-medium text-gray-900 dark:text-white mt-1">
                        {product.updated_at 
                          ? format(new Date(product.updated_at), "dd/MM/yyyy HH:mm", { locale: es })
                          : 'No disponible'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Registro sanitario:</span>
                      <p className="font-medium text-gray-900 dark:text-white mt-1">RS-1234-MSA</p>
                    </div>
                  </div>
                </motion.div>

                {/* Botón de cerrar */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Cerrar
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}