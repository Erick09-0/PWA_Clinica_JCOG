import { useEffect, useMemo, useState } from "react";
import { Package, TrendingDown, Clock, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { differenceInCalendarDays, formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import {
  getInventoryStats,
  getExpiringProducts,
  getCriticalProducts,
} from "../services/inventoryService";
import { useLanguage } from "../contexts/LanguageContext";

interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  lowStock: number;
  critical: number;
  optimal: number;
  byCategory: Record<string, number>;
}

export function StatsCards() {
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [expiringCount, setExpiringCount] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);
  const [nextExpiryInDays, setNextExpiryInDays] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { translate, formatCurrency, formatNumber, language } = useLanguage();
  const dateLocale = language === "en" ? enUS : es;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsData, expiringProducts, criticalProducts] =
          await Promise.all([
            getInventoryStats(),
            getExpiringProducts(30),
            getCriticalProducts(),
          ]);
        setStats(statsData);
        setExpiringCount(expiringProducts.length);
        setCriticalCount(criticalProducts.length);

        const nextExpiry = expiringProducts
          .filter((product) => product.expiry_date)
          .sort(
            (a, b) =>
              new Date(a.expiry_date).getTime() -
              new Date(b.expiry_date).getTime(),
          )[0];
        if (nextExpiry?.expiry_date) {
          setNextExpiryInDays(
            Math.max(
              0,
              differenceInCalendarDays(
                new Date(nextExpiry.expiry_date),
                new Date(),
              ),
            ),
          );
        } else {
          setNextExpiryInDays(null);
        }

        setLastUpdated(new Date());
      } catch (err: any) {
        const message =
          err instanceof Error
            ? err.message
            : translate(
                "No se pudieron obtener los datos.",
                "Unable to fetch the data.",
              );
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [translate]);

  const cards = useMemo(() => {
    const totalProducts = stats?.totalProducts ?? 0;
    const categoryCount = Object.keys(stats?.byCategory || {}).length;
    const stockAttention = (stats?.lowStock ?? 0) + (stats?.critical ?? 0);
    const pendingOrders = Math.max(
      criticalCount,
      Math.round((stats?.lowStock || 0) * 0.4),
    );
    const healthyRatio =
      totalProducts > 0 ? (stats?.optimal ?? 0) / totalProducts : 0;

    return [
      {
        id: "total",
        title: translate("Total de productos", "Total products"),
        value: totalProducts ? formatNumber(totalProducts) : "—",
        subtitle:
          categoryCount > 0
            ? translate(
                `${categoryCount} categorías registradas`,
                `${categoryCount} categories tracked`,
              )
            : translate("Sin categorías registradas", "No categories tracked"),
        icon: Package,
        gradient: "from-blue-500 to-blue-600",
        progress: healthyRatio,
        trend: stats
          ? translate(
              `Inventario valuado en ${formatCurrency(stats.totalValue)}`,
              `Inventory valued at ${formatCurrency(stats.totalValue)}`,
            )
          : translate("Calculando valuación...", "Calculating valuation..."),
      },
      {
        id: "low-stock",
        title: translate("Stock bajo", "Low stock"),
        value: formatNumber(stockAttention),
        subtitle: translate(
          `${criticalCount} críticos, ${stats?.lowStock ?? 0} en observación`,
          `${criticalCount} critical, ${stats?.lowStock ?? 0} under watch`,
        ),
        icon: TrendingDown,
        gradient: "from-amber-500 to-orange-500",
        progress: totalProducts > 0 ? stockAttention / totalProducts : 0,
        trend:
          healthyRatio > 0
            ? translate(
                `Stock sano: ${Math.round(healthyRatio * 100)}%`,
                `Healthy stock: ${Math.round(healthyRatio * 100)}%`,
              )
            : translate("Sin datos recientes", "No recent data"),
      },
      {
        id: "expiring",
        title: translate("Por vencer (30 días)", "Expiring (30 days)"),
        value: formatNumber(expiringCount),
        subtitle:
          nextExpiryInDays !== null
            ? translate(
                `Próximo vencimiento en ${nextExpiryInDays} días`,
                `Next expiry in ${nextExpiryInDays} days`,
              )
            : translate("Sin vencimientos próximos", "No upcoming expiries"),
        icon: Clock,
        gradient: "from-cyan-500 to-blue-500",
        progress: totalProducts > 0 ? expiringCount / totalProducts : 0,
        trend:
          nextExpiryInDays !== null
            ? translate(
                `Ajusta rotación para ${
                  nextExpiryInDays <= 7 ? "esta semana" : "este mes"
                }`,
                `Adjust rotation for ${
                  nextExpiryInDays <= 7 ? "this week" : "this month"
                }`,
              )
            : translate(
                "Todo está dentro de la vida útil",
                "Everything within shelf life",
              ),
      },
      {
        id: "orders",
        title: translate("Pedidos recomendados", "Recommended orders"),
        value: pendingOrders ? formatNumber(pendingOrders) : "0",
        subtitle: translate(
          "Sugerido según stock y vencimientos",
          "Suggested from stock & expiries",
        ),
        icon: CheckCircle,
        gradient: "from-blue-600 to-indigo-600",
        progress: totalProducts > 0 ? pendingOrders / totalProducts : 0,
        trend: lastUpdated
          ? translate(
              `Actualizado ${formatDistanceToNow(lastUpdated, {
                addSuffix: true,
                locale: dateLocale,
              })}`,
              `Updated ${formatDistanceToNow(lastUpdated, {
                addSuffix: true,
                locale: dateLocale,
              })}`,
            )
          : translate("Sincronizando...", "Synchronising..."),
      },
    ];
  }, [
    stats,
    expiringCount,
    criticalCount,
    nextExpiryInDays,
    lastUpdated,
    translate,
    formatNumber,
    formatCurrency,
    dateLocale,
  ]);

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-sm text-red-700 dark:text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {(loading && !stats ? Array.from({ length: 4 }) : cards).map(
        (card, index) => (
          <motion.div
            key={card ? card.id : `skeleton-${index}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.4 + index * 0.1,
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              y: -6,
              boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.2)",
            }}
            className="bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 shadow border border-white/40 dark:border-slate-700/30 relative overflow-hidden"
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card?.gradient ?? "from-slate-400 to-slate-500"} opacity-5 rounded-full -mr-16 -mt-16`}
            />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2 transition-colors">
                    {card?.title ?? translate("Cargando...", "Loading...")}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-1"
                  >
                    <span
                      className={`bg-gradient-to-r ${card?.gradient ?? "from-slate-500 to-slate-600"} bg-clip-text text-transparent`}
                    >
                      {loading && !stats ? "—" : card?.value}
                    </span>
                  </motion.div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                    {card?.subtitle ?? translate("Sin datos", "No data")}
                  </div>
                </div>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.5 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className={`p-3 bg-gradient-to-br ${card?.gradient ?? "from-slate-500 to-slate-600"} rounded-2xl shadow-lg`}
                >
                  {card?.icon ? (
                    <card.icon
                      size={24}
                      className="text-white"
                      strokeWidth={2}
                    />
                  ) : (
                    <Package size={24} className="text-white" strokeWidth={2} />
                  )}
                </motion.div>
              </div>
              <div className="h-1 bg-gray-100 dark:bg-slate-700 rounded-full mb-3 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${card?.gradient ?? "from-slate-500 to-slate-600"}`}
                  style={{
                    width: `${Math.min(100, Math.round((card?.progress ?? 0) * 100))}%`,
                  }}
                />
              </div>
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 transition-colors">
                {card?.trend ??
                  translate("Procesando datos...", "Processing data...")}
              </div>
            </div>
          </motion.div>
        ),
      )}
    </div>
  );
}
