// src/components/modals/CreateProductModal.tsx
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Package,
  Tag,
  MapPin,
  DollarSign,
  Calendar,
  TrendingDown,
  Plus,
  Loader2,
} from "lucide-react";
import { useInventory } from "../../hooks/useInventory";
import { useToast } from "../../contexts/ToastContext";
import type { ProductInsert } from "../../types/database.types";
import { useLanguage } from "../../contexts/LanguageContext";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const rawCategories = [
  "Analgésicos",
  "Antibióticos",
  "Material Médico",
  "Soluciones",
  "Material de Curación",
  "Antisépticos",
  "Otros",
] as const;

const categoryLabelsEn: Record<(typeof rawCategories)[number], string> = {
  Analgésicos: "Pain relievers",
  Antibióticos: "Antibiotics",
  "Material Médico": "Medical supplies",
  Soluciones: "Solutions",
  "Material de Curación": "Dressings",
  Antisépticos: "Antiseptics",
  Otros: "Other",
};

export function CreateProductModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateProductModalProps) {
  const { createProduct } = useInventory();
  const { success, error } = useToast();
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductInsert>({
    name: "",
    category: "Analgésicos",
    stock: 0,
    min_stock: 10,
    location: "",
    price: 0,
    expiry_date: "",
  });

  const categoryOptions = useMemo(
    () =>
      rawCategories.map((value) => ({
        value,
        label: translate(value, categoryLabelsEn[value]),
      })),
    [translate],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      error(
        translate(
          "El nombre del producto es requerido",
          "Product name is required",
        ),
      );
      return;
    }
    if (formData.stock < 0) {
      error(
        translate("El stock no puede ser negativo", "Stock cannot be negative"),
      );
      return;
    }
    if (formData.min_stock < 0) {
      error(
        translate(
          "El stock mínimo no puede ser negativo",
          "Min stock cannot be negative",
        ),
      );
      return;
    }
    if (formData.price < 0) {
      error(
        translate(
          "El precio no puede ser negativo",
          "Price cannot be negative",
        ),
      );
      return;
    }

    setLoading(true);
    try {
      const result = await createProduct(formData);
      if (result) {
        success(
          translate(
            "Producto creado exitosamente",
            "Product created successfully",
          ),
        );
        setFormData({
          name: "",
          category: "Analgésicos",
          stock: 0,
          min_stock: 10,
          location: "",
          price: 0,
          expiry_date: "",
        });
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      console.error("Error creating product:", err);
      error(
        translate("Error al crear el producto", "Failed to create product"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ProductInsert, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-3xl shadow border border-white/40 dark:border-slate-700/30 pointer-events-auto"
            >
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
                      <p className="text-xs opacity-80">
                        {translate("Nuevo registro", "New entry")}
                      </p>
                      <h2 className="text-2xl font-bold">
                        {translate("Agregar producto", "Add product")}
                      </h2>
                      <p className="text-sm opacity-80 mt-1">
                        {translate(
                          "Completa los detalles del producto para sumarlo al inventario.",
                          "Fill out the product details to add it to the inventory.",
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

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      {translate("Nombre del producto", "Product name")} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder={translate(
                        "Ej. Ibuprofeno 400mg",
                        "e.g. Ibuprofen 400mg",
                      )}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      {translate("Categoría", "Category")}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    >
                      {categoryOptions.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Plus className="w-4 h-4" />
                      {translate("Stock", "Stock")} *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) =>
                        handleChange("stock", parseInt(e.target.value) || 0)
                      }
                      placeholder="0"
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 border border-green-200 dark:border-green-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <TrendingDown className="w-4 h-4" />
                      {translate("Stock mínimo", "Minimum stock")} *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.min_stock}
                      onChange={(e) =>
                        handleChange("min_stock", parseInt(e.target.value) || 0)
                      }
                      placeholder="10"
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 border border-amber-200 dark:border-amber-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {translate("Ubicación", "Location")}
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder={translate("Ej. Anaquel A4", "e.g. Shelf A4")}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {translate("Precio unitario", "Unit price")}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        handleChange("price", parseFloat(e.target.value) || 0)
                      }
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {translate("Fecha de caducidad", "Expiry date")}
                    </label>
                    <input
                      type="date"
                      value={formData.expiry_date || ""}
                      onChange={(e) =>
                        handleChange("expiry_date", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="flex flex-col sm:flex-row justify-end gap-3 pt-4"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                  >
                    {translate("Cancelar", "Cancel")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    {translate("Guardar producto", "Save product")}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
