// src/components/sections/InventarioSection.tsx
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useInventory } from "../../hooks/useInventory";
import { ProductDetailModal } from "../modals/ProductDetailModal";
import { CreateProductModal } from "../modals/CreateProductModal";
import { EditProductModal } from "../modals/EditProductModal";
import { DeleteProductModal } from "../modals/DeleteProductModal";
import type { Product } from "../../types/database.types";
import { useLanguage } from "../../contexts/LanguageContext";

export function InventarioSection() {
  const {
    products,
    loading,
    error,
    stats,
    searchProducts,
    filterByCategory,
    fetchProducts,
    refreshStats,
  } = useInventory();

  const { translate, formatNumber, formatCurrency } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: translate("Todos", "All") },
      {
        value: "Analgésicos",
        label: translate("Analgésicos", "Pain relievers"),
      },
      {
        value: "Antibióticos",
        label: translate("Antibióticos", "Antibiotics"),
      },
      {
        value: "Material Médico",
        label: translate("Material Médico", "Medical supplies"),
      },
      { value: "Soluciones", label: translate("Soluciones", "Solutions") },
      {
        value: "Material de Curación",
        label: translate("Material de Curación", "Dressings"),
      },
      {
        value: "Antisépticos",
        label: translate("Antisépticos", "Antiseptics"),
      },
      { value: "Otros", label: translate("Otros", "Other") },
    ],
    [translate],
  );

  const statusConfig = useMemo(
    () => ({
      good: {
        label: translate("Óptimo", "Optimal"),
        color: "bg-green-500",
        textColor: "text-green-700",
        bgColor: "bg-green-50",
      },
      low: {
        label: translate("Bajo", "Low"),
        color: "bg-amber-500",
        textColor: "text-amber-700",
        bgColor: "bg-amber-50",
      },
      critical: {
        label: translate("Crítico", "Critical"),
        color: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
      },
    }),
    [translate],
  );

  const statCards = useMemo(() => {
    if (!stats) return [];
    return [
      {
        label: translate("Total productos", "Total products"),
        value: formatNumber(stats.totalProducts),
        color: "from-blue-500 to-blue-600",
      },
      {
        label: translate("Stock óptimo", "Optimal stock"),
        value: formatNumber(stats.optimal),
        color: "from-green-500 to-green-600",
      },
      {
        label: translate("Stock bajo", "Low stock"),
        value: formatNumber(stats.lowStock),
        color: "from-amber-500 to-orange-500",
      },
      {
        label: translate("Stock crítico", "Critical stock"),
        value: formatNumber(stats.critical),
        color: "from-red-500 to-red-600",
      },
    ];
  }, [stats, translate, formatNumber]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchProducts(query);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterByCategory(category);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchProducts();
    refreshStats();
  };

  const handleRefresh = async () => {
    setSelectedCategory("all");
    setSearchQuery("");
    await fetchProducts();
    await refreshStats();
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
              {translate("Gestión de Inventario", "Inventory Management")}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">
              {translate(
                "Administra todos los productos y materiales médicos",
                "Manage every product and medical supply",
              )}
            </p>
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="gap-2 text-sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCcw className="w-4 h-4" />
              )}
              {translate("Actualizar datos", "Refresh data")}
            </Button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                onClick={() => setCreateModalOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg text-sm sm:text-base"
              >
                <Plus size={18} className="sm:w-5 sm:h-5 mr-2" />
                {translate("Agregar producto", "Add product")}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {!!statCards.length && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow border border-white/40 dark:border-slate-700/30 transition-colors"
              >
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors">
                  {stat.label}
                </div>
                <div
                  className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                >
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow border border-white/40 dark:border-slate-700/30 transition-colors"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={translate(
                  "Buscar productos...",
                  "Search products...",
                )}
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categoryOptions.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryFilter(category.value)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.value
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              {translate("Cargando productos...", "Loading products...")}
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-red-700 dark:text-red-400">
              {translate("Error:", "Error:")} {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow border border-white/40 dark:border-slate-700/30 overflow-hidden transition-colors"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 dark:bg-slate-900/50 transition-colors">
                  <tr>
                    {[
                      translate("Producto", "Product"),
                      translate("Categoría", "Category"),
                      translate("Stock", "Stock"),
                      translate("Ubicación", "Location"),
                      translate("Precio", "Price"),
                      translate("Estado", "Status"),
                      translate("Acciones", "Actions"),
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
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
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatNumber(product.stock)} /{" "}
                          {formatNumber(product.min_stock)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {product.location ||
                          translate("Sin ubicación", "No location")}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(product.price)}
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
                            title={translate("Ver detalles", "View details")}
                          >
                            <Eye
                              size={16}
                              className="text-blue-600 dark:text-blue-400"
                            />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(product)}
                            className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                            title={translate("Editar", "Edit")}
                          >
                            <Edit
                              size={16}
                              className="text-indigo-600 dark:text-indigo-400"
                            />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title={translate("Eliminar", "Delete")}
                          >
                            <Trash2
                              size={16}
                              className="text-red-600 dark:text-red-400"
                            />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {translate(
                    "No se encontraron productos",
                    "No products found",
                  )}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>

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
