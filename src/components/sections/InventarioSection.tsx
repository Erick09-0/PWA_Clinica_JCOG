// src/components/sections/InventarioSection.tsx

import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Download, Edit, Trash2, Eye, Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useInventory } from '../../hooks/useInventory';
import { ProductDetailModal } from '../modals/ProductDetailModal';
import { CreateProductModal } from '../modals/CreateProductModal';
import { EditProductModal } from '../modals/EditProductModal';
import { DeleteProductModal } from '../modals/DeleteProductModal';
import type { Product } from '../../types/database.types';

const statusConfig = {
  good: { label: 'Óptimo', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
  low: { label: 'Bajo', color: 'bg-amber-500', textColor: 'text-amber-700', bgColor: 'bg-amber-50' },
  critical: { label: 'Crítico', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' }
};

export function InventarioSection() {
  const { 
    products, 
    loading, 
    error, 
    stats,
    searchProducts, 
    filterByCategory,
    fetchProducts,
    refreshStats
  } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Estados de los modales
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Manejar búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchProducts(query);
  };

  // Manejar filtro por categoría
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterByCategory(category);
  };

  // Abrir modal de detalles
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  // Abrir modal de edición
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  // Abrir modal de eliminación
  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  // Refrescar después de crear/editar
  const handleModalSuccess = () => {
    fetchProducts();
  };

  const handleRefresh = async () => {
    setSelectedCategory('all');
    setSearchQuery('');
    await fetchProducts();
    await refreshStats();
  };

  // Categorías disponibles
  const categories = ['all', 'Analgésicos', 'Antibióticos', 'Material Médico', 'Soluciones', 'Material de Curación', 'Antisépticos'];

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
              Gestión de Inventario
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">
              Administra todos los productos y materiales médicos
            </p>
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="gap-2 text-sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
              Actualizar datos
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button 
                onClick={() => setCreateModalOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg text-sm sm:text-base"
              >
                <Plus size={18} className="sm:w-5 sm:h-5 mr-2" />
                Agregar Producto
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Total Productos', value: stats.totalProducts, color: 'from-blue-500 to-blue-600' },
              { label: 'Stock Óptimo', value: stats.optimal, color: 'from-green-500 to-green-600' },
              { label: 'Stock Bajo', value: stats.lowStock, color: 'from-amber-500 to-orange-500' },
              { label: 'Stock Crítico', value: stats.critical, color: 'from-red-500 to-red-600' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
              >
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors">{stat.label}</div>
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Filters and Search */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 transition-colors"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {category === 'all' ? 'Todos' : category}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <Button variant="outline" className="whitespace-nowrap">
              <Download size={18} className="mr-2" />
              Exportar
            </Button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando productos...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-red-700 dark:text-red-400">Error: {error}</p>
          </div>
        )}

        {/* Products Table */}
        {!loading && !error && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 overflow-hidden transition-colors"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 dark:bg-slate-900/50 transition-colors">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {products.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {product.stock} / {product.min_stock}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {product.location}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <Badge 
                          className={`${statusConfig[product.status].bgColor} ${statusConfig[product.status].textColor} border-0`}
                        >
                          {statusConfig[product.status].label}
                        </Badge>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewDetails(product)}
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye size={16} className="text-blue-600 dark:text-blue-400" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(product)}
                            className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} className="text-indigo-600 dark:text-indigo-400" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No se encontraron productos</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modales */}
      <ProductDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        product={selectedProduct}
      />

      <CreateProductModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <EditProductModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        product={selectedProduct}
        onSuccess={handleModalSuccess}
      />

      <DeleteProductModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        product={selectedProduct}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}
