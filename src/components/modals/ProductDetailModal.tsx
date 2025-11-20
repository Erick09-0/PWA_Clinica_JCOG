// src/components/modals/ProductDetailModal.tsx
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Package,
  MapPin,
  DollarSign,
  Calendar,
  AlertCircle,
  Tag,
  TrendingUp,
  History,
} from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { Product } from "../../types/database.types";
import { useLanguage } from "../../contexts/LanguageContext";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ProductDetailModal({
  isOpen,
  onClose,
  product,
}: ProductDetailModalProps) {
  const { translate, formatCurrency, formatNumber, language } = useLanguage();
  const locale = language === "en" ? enUS : es;

  if (!product) return null;

  const totalValue = product.stock * product.price;
  const stockPercentage = (product.stock / (product.min_stock * 2)) * 100;
  const daysUntilExpiry = product.expiry_date
    ? Math.ceil(
        (new Date(product.expiry_date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const statusConfig = {
    good: {
      label: translate("Óptimo", "Optimal"),
      color: "bg-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-400",
    },
    low: {
      label: translate("Bajo", "Low"),
      color: "bg-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-700 dark:text-amber-400",
    },
    critical: {
      label: translate("Crítico", "Critical"),
      color: "bg-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-700 dark:text-red-400",
    },
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
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-3xl shadow border border-white/40 dark:border-slate-700/30 pointer-events-auto"
            >
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
                        <div className="text-xs opacity-80 mb-1">
                          {translate("ID", "ID")}: #{product.id}
                        </div>
                        <h2 className="text-2xl font-bold">{product.name}</h2>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mt-3"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${statusConfig[product.status].color}`}
                      />
                      <span className="text-sm font-medium">
                        {statusConfig[product.status].label}
                      </span>
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
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    icon={Tag}
                    label={translate("Categoría", "Category")}
                    value={product.category}
                  />
                  <InfoCard
                    icon={MapPin}
                    label={translate("Ubicación", "Location")}
                    value={
                      product.location ||
                      translate("Sin ubicación", "No location")
                    }
                  />
                  <InfoCard
                    icon={DollarSign}
                    label={translate("Precio unitario", "Unit price")}
                    value={formatCurrency(product.price)}
                  />
                  <InfoCard
                    icon={TrendingUp}
                    label={translate("Valor total", "Total value")}
                    value={formatCurrency(totalValue)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-slate-900/40 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {translate("Nivel de stock", "Stock level")}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatNumber(product.stock)} /{" "}
                        {formatNumber(product.min_stock * 2)}
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(100, Math.max(0, stockPercentage))}%`,
                        }}
                        className={`h-full bg-gradient-to-r ${statusConfig[product.status].color}`}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-900/40 rounded-2xl p-4 space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {translate("Fecha de caducidad", "Expiry date")}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {product.expiry_date
                        ? format(new Date(product.expiry_date), "PPP", {
                            locale,
                          })
                        : translate("Sin caducidad", "No expiry")}
                    </div>
                    {daysUntilExpiry !== null && (
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          daysUntilExpiry <= 15
                            ? "bg-red-100 text-red-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        <History className="w-3 h-3" />
                        {translate(
                          `Vence en ${daysUntilExpiry} días`,
                          `Expires in ${daysUntilExpiry} days`,
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 flex items-start gap-3">
                  <div className="p-2 bg-white/60 dark:bg-white/10 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-semibold mb-1">
                      {translate(
                        "Historial y seguimiento",
                        "History and traceability",
                      )}
                    </p>
                    <p className="opacity-80">
                      {translate(
                        "Este producto forma parte de los reportes de rotación, stock crítico y caducidades proactivas.",
                        "This product feeds rotation reports, critical stock alerts and expiry forecasts.",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-50 dark:bg-slate-900/40 rounded-2xl p-4"
    >
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <div className="text-lg font-semibold text-gray-900 dark:text-white">
        {value}
      </div>
    </motion.div>
  );
}
