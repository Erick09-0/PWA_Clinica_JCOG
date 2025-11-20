// src/components/modals/DeleteProductModal.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Trash2,
  AlertTriangle,
  Package,
  Tag,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { useInventory } from "../../hooks/useInventory";
import { useToast } from "../../contexts/ToastContext";
import type { Product } from "../../types/database.types";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "../ui/button";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess?: () => void;
}

export function DeleteProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: DeleteProductModalProps) {
  const { deleteProduct } = useInventory();
  const { success, error } = useToast();
  const { translate, formatNumber } = useLanguage();
  const [loading, setLoading] = useState(false);

  const statusConfig = {
    good: {
      label: translate("Óptimo", "Optimal"),
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-400",
    },
    low: {
      label: translate("Bajo", "Low"),
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-700 dark:text-amber-400",
    },
    critical: {
      label: translate("Crítico", "Critical"),
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-700 dark:text-red-400",
    },
  };

  const handleDelete = async () => {
    if (!product) return;
    setLoading(true);
    try {
      const deleteSuccess = await deleteProduct(product.id);
      if (deleteSuccess) {
        success(
          translate(
            "Producto eliminado exitosamente",
            "Product deleted successfully",
          ),
        );
        onSuccess?.();
        onClose();
      } else {
        error(
          translate(
            "Error al eliminar el producto",
            "Failed to delete product",
          ),
        );
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      error(
        translate("Error al eliminar el producto", "Failed to delete product"),
      );
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-3xl shadow border border-white/40 dark:border-slate-700/30 pointer-events-auto"
            >
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
                      <div className="text-xs opacity-80 mb-1">
                        {translate("ID", "ID")}: #{product.id}
                      </div>
                      <h2 className="text-2xl font-bold">
                        {translate("Eliminar producto", "Delete product")}
                      </h2>
                      <p className="text-sm opacity-80 mt-1">
                        {translate(
                          "Esta acción no se puede deshacer",
                          "This action cannot be undone",
                        )}
                      </p>
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

              <div className="p-6 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 backdrop-blur-xl rounded-2xl border border-red-100 dark:border-red-900/40 p-4 flex gap-3"
                >
                  <div className="p-2 rounded-xl bg-white/60 dark:bg-white/10 flex-shrink-0">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-sm text-red-800 dark:text-red-200">
                    <p className="font-semibold">
                      {translate(
                        "¿Estás seguro de eliminar este producto?",
                        "Are you sure you want to delete this product?",
                      )}
                    </p>
                    <p className="mt-1 opacity-80">
                      {translate(
                        "Los registros históricos se conservarán, pero el producto no estará disponible en inventario.",
                        "Historical records remain, but the product will no longer be available in inventory.",
                      )}
                    </p>
                  </div>
                </motion.div>

                <div className="bg-gray-50 dark:bg-slate-900/40 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {translate("Producto", "Product")}
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                    </div>
                    <BadgePill text={product.category} icon={Tag} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <p className="text-gray-500 dark:text-gray-400">
                        {translate("Stock actual", "Current stock")}
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatNumber(product.stock)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-500 dark:text-gray-400">
                        {translate("Stock mínimo", "Minimum stock")}
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatNumber(product.min_stock)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {product.location ||
                        translate("Sin ubicación", "No location")}
                    </span>
                  </div>

                  <div
                    className={`rounded-xl px-3 py-2 text-sm font-semibold ${statusConfig[product.status].bgColor} ${statusConfig[product.status].textColor}`}
                  >
                    {statusConfig[product.status].label}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  {translate("Cancelar", "Cancel")}
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {translate("Eliminar definitivamente", "Delete permanently")}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function BadgePill({
  text,
  icon: Icon,
}: {
  text: string;
  icon: typeof Package;
}) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 text-gray-700 dark:text-gray-100 text-xs border border-gray-200 dark:border-white/10">
      <Icon className="w-3.5 h-3.5" />
      {text}
    </div>
  );
}
