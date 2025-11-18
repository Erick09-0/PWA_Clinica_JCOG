// src/components/modals/CreateProductModal.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Package, Tag, MapPin, DollarSign, Calendar, TrendingDown, Plus, Loader2 } from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';
import { useToast } from '../../contexts/ToastContext';
import type { ProductInsert } from '../../types/database.types';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const categories = [
  'Analgésicos',
  'Antibióticos',
  'Material Médico',
  'Soluciones',
  'Material de Curación',
  'Antisépticos',
  'Otros'
];

export function CreateProductModal({ isOpen, onClose, onSuccess }: CreateProductModalProps) {
  const { createProduct } = useInventory();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductInsert>({
    name: '',
    category: 'Analgésicos',
    stock: 0,
    min_stock: 10,
    location: '',
    price: 0,
    expiry_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.name.trim()) {
      error('El nombre del producto es requerido');
      return;
    }
    
    if (formData.stock < 0) {
      error('El stock no puede ser negativo');
      return;
    }
    
    if (formData.min_stock < 0) {
      error('El stock mínimo no puede ser negativo');
      return;
    }
    
    if (formData.price < 0) {
      error('El precio no puede ser negativo');
      return;
    }

    setLoading(true);
    
    try {
      const result = await createProduct(formData);
      
      if (result) {
        success('Producto creado exitosamente');
        
        // Limpiar formulario
        setFormData({
          name: '',
          category: 'Analgésicos',
          stock: 0,
          min_stock: 10,
          location: '',
          price: 0,
          expiry_date: '',
        });
        
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      console.error('Error creating product:', err);
      error('Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ProductInsert, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl shadow-[0_8px_32px_rgba(31,41,55,0.12)] border border-white/40 dark:border-slate-700/30 pointer-events-auto"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-t-3xl">
                <div className="flex items-start justify-between">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Agregar Producto</h2>
                      <p className="text-sm opacity-80 mt-1">Completa la información del nuevo producto</p>
                    </div>
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Nombre del Producto */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-xl rounded-2xl p-4 border border-blue-100 dark:border-blue-800/30"
                >
                  <label className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                    <Package className="w-4 h-4" />
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Ej: Paracetamol 500mg"
                    className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-blue-200 dark:border-blue-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder:text-gray-400"
                  />
                </motion.div>

                {/* Grid 2 columnas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Categoría */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-xl rounded-2xl p-4 border border-purple-100 dark:border-purple-800/30"
                  >
                    <label className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
                      <Tag className="w-4 h-4" />
                      Categoría *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-purple-200 dark:border-purple-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Ubicación */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 backdrop-blur-xl rounded-2xl p-4 border border-indigo-100 dark:border-indigo-800/30"
                  >
                    <label className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                      <MapPin className="w-4 h-4" />
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="Ej: A-12"
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-indigo-200 dark:border-indigo-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </motion.div>
                </div>

                {/* Grid 3 columnas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Stock Actual */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-xl rounded-2xl p-4 border border-green-100 dark:border-green-800/30"
                  >
                    <label className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                      <Package className="w-4 h-4" />
                      Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-green-200 dark:border-green-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </motion.div>

                  {/* Stock Mínimo */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 backdrop-blur-xl rounded-2xl p-4 border border-amber-100 dark:border-amber-800/30"
                  >
                    <label className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                      <TrendingDown className="w-4 h-4" />
                      Stock Mín *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.min_stock}
                      onChange={(e) => handleChange('min_stock', parseInt(e.target.value) || 0)}
                      placeholder="10"
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-amber-200 dark:border-amber-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </motion.div>

                  {/* Precio */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 backdrop-blur-xl rounded-2xl p-4 border border-yellow-100 dark:border-yellow-800/30"
                  >
                    <label className="flex items-center gap-2 text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-2">
                      <DollarSign className="w-4 h-4" />
                      Precio *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-yellow-200 dark:border-yellow-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </motion.div>
                </div>

                {/* Fecha de Vencimiento */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 backdrop-blur-xl rounded-2xl p-4 border border-rose-100 dark:border-rose-800/30"
                >
                  <label className="flex items-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => handleChange('expiry_date', e.target.value)}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-rose-200 dark:border-rose-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-900 dark:text-white"
                  />
                </motion.div>

                {/* Botones */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
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
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Crear Producto
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}