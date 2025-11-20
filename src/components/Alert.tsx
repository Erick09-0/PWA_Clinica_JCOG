import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import {
  getCriticalProducts,
  getExpiringProducts,
  getInventoryStats,
} from "../services/inventoryService";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useLanguage } from "../contexts/LanguageContext";

type InsightSeverity = "critical" | "warning" | "success" | "info";

interface InsightMessage {
  severity: InsightSeverity;
  title: string;
  message: string;
  actionLabel: string;
}

const severityStyles: Record<
  InsightSeverity,
  { container: string; gradient: string; text: string }
> = {
  critical: {
    container:
      "from-red-50/70 to-rose-50/70 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/60 dark:border-red-900/40",
    gradient: "from-red-500 to-rose-500",
    text: "text-red-900 dark:text-red-100",
  },
  warning: {
    container:
      "from-amber-50/70 to-orange-50/70 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/60 dark:border-amber-900/40",
    gradient: "from-amber-500 to-orange-500",
    text: "text-amber-900 dark:text-amber-100",
  },
  info: {
    container:
      "from-blue-50/70 to-cyan-50/70 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/60 dark:border-blue-900/40",
    gradient: "from-blue-500 to-cyan-500",
    text: "text-blue-900 dark:text-blue-100",
  },
  success: {
    container:
      "from-emerald-50/70 to-green-50/70 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200/60 dark:border-emerald-900/40",
    gradient: "from-emerald-500 to-green-500",
    text: "text-emerald-900 dark:text-emerald-100",
  },
};

export function Alert({
  onNavigate,
}: {
  onNavigate: (section: string) => void;
}) {
  const { translate, language } = useLanguage();
  const dateLocale = language === "en" ? enUS : es;

  const [insight, setInsight] = useState<InsightMessage>({
    severity: "info",
    title: translate("Analizando inventario...", "Analysing inventory..."),
    message: translate(
      "Revisando evolución de stock, vencimientos y movimientos recientes.",
      "Reviewing stock evolution, expiries and recent movements.",
    ),
    actionLabel: translate("Ver inventario", "View inventory"),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const computeInsight = async () => {
      try {
        setLoading(true);
        const [critical, expiring, stats] = await Promise.all([
          getCriticalProducts(),
          getExpiringProducts(45),
          getInventoryStats(),
        ]);

        if (critical.length > 0) {
          const names = critical
            .slice(0, 3)
            .map((product) => product.name)
            .join(", ");
          setInsight({
            severity: "critical",
            title: translate(
              `Stock crítico en ${critical.length} producto${critical.length === 1 ? "" : "s"}`,
              `${critical.length} critical product${critical.length === 1 ? "" : "s"}`,
            ),
            message: translate(
              `${names}${critical.length > 3 ? " y más" : ""} necesitan reposición inmediata.`,
              `${names}${critical.length > 3 ? " and more" : ""} require immediate restock.`,
            ),
            actionLabel: translate(
              "Ver productos críticos",
              "View critical products",
            ),
          });
          return;
        }

        if (expiring.length > 0) {
          const nextExpiry = expiring
            .filter((product) => product.expiry_date)
            .sort(
              (a, b) =>
                new Date(a.expiry_date).getTime() -
                new Date(b.expiry_date).getTime(),
            )[0];
          const nextExpiryText =
            nextExpiry?.expiry_date &&
            formatDistanceToNow(new Date(nextExpiry.expiry_date), {
              addSuffix: true,
              locale: dateLocale,
            });
          setInsight({
            severity: "warning",
            title: translate(
              `Hay ${expiring.length} producto${expiring.length === 1 ? "" : "s"} por vencer`,
              `${expiring.length} product${expiring.length === 1 ? "" : "s"} about to expire`,
            ),
            message: nextExpiryText
              ? translate(
                  `El lote más cercano caduca ${nextExpiryText}. Planifica su rotación.`,
                  `Nearest batch expires ${nextExpiryText}. Adjust rotation.`,
                )
              : translate(
                  "Revisa los lotes para evitar pérdidas por caducidad.",
                  "Review batches to avoid expiration losses.",
                ),
            actionLabel: translate(
              "Priorizar vencimientos",
              "Prioritize expiries",
            ),
          });
          return;
        }

        if ((stats.lowStock ?? 0) > 0) {
          setInsight({
            severity: "info",
            title: translate(
              `Hay ${stats.lowStock} producto${stats.lowStock === 1 ? "" : "s"} con stock bajo`,
              `${stats.lowStock} product${stats.lowStock === 1 ? "" : "s"} with low stock`,
            ),
            message: translate(
              "Sugiere planificar pedidos para mantener inventario óptimo.",
              "Plan replenishment to keep optimal inventory.",
            ),
            actionLabel: translate("Planear reposición", "Plan restock"),
          });
          return;
        }

        setInsight({
          severity: "success",
          title: translate("Inventario estable", "Inventory stable"),
          message: translate(
            "No hay alertas activas. Aprovecha para revisar tendencias o planificar nuevas compras.",
            "No active alerts. Review trends or plan upcoming purchases.",
          ),
          actionLabel: translate("Explorar panel", "Explore dashboard"),
        });
      } catch (err: any) {
        setInsight({
          severity: "info",
          title: translate(
            "No se pudo analizar el inventario",
            "Inventory analysis unavailable",
          ),
          message:
            err instanceof Error
              ? err.message
              : translate(
                  "Vuelve a intentarlo en unos momentos.",
                  "Try again shortly.",
                ),
          actionLabel: translate("Reintentar", "Retry"),
        });
      } finally {
        setLoading(false);
      }
    };

    computeInsight();
  }, [translate, dateLocale]);

  const styles = severityStyles[insight.severity];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className={`bg-gradient-to-r ${styles.container} backdrop-blur-2xl rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] transition-all`}
    >
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.4,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          whileHover={{ rotate: 10, scale: 1.08 }}
          className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${styles.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
        >
          {insight.severity === "success" ? (
            <CheckCircle size={22} className="text-white" strokeWidth={2.5} />
          ) : insight.severity === "info" ? (
            <Lightbulb size={22} className="text-white" strokeWidth={2.5} />
          ) : (
            <AlertTriangle size={22} className="text-white" strokeWidth={2.5} />
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex-1"
        >
          <div
            className={`font-semibold ${styles.text} mb-1 text-sm sm:text-base`}
          >
            {loading
              ? translate("Revisando inventario...", "Reviewing inventory...")
              : insight.title}
          </div>
          <div className={`text-xs sm:text-sm ${styles.text} opacity-80`}>
            {insight.message}
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full sm:w-auto"
      >
        <Button
          className={`w-full sm:w-auto bg-gradient-to-r ${styles.gradient} text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl shadow-lg transition-all`}
          disabled={loading}
          onClick={() => {
            if (
              insight.severity === "critical" ||
              insight.severity === "warning"
            ) {
              onNavigate?.("inventario");
            } else if (insight.severity === "info") {
              onNavigate?.("alertas");
            } else {
              onNavigate?.("analisis");
            }
          }}
        >
          {insight.actionLabel}
        </Button>
      </motion.div>
    </motion.div>
  );
}
