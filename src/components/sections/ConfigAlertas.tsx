// src/components/sections/ConfigAlertas.tsx
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, RefreshCcw, Save, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { useAlertSettings } from "../../hooks/useAlertSettings";
import type { AlertSettings } from "../../types/database.types";
import { useLanguage } from "../../contexts/LanguageContext";

interface ConfigAlertasProps {
  onBack?: () => void;
}

export default function ConfigAlertas({ onBack }: ConfigAlertasProps) {
  const { settings, loading, saving, error, success, save, refresh } =
    useAlertSettings();
  const [formState, setFormState] = useState<AlertSettings>(settings);
  const { translate } = useLanguage();

  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  const handleChange = <K extends keyof AlertSettings>(
    field: K,
    value: AlertSettings[K],
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await save(formState);
    if (result) {
      onBack?.();
    }
  };

  const isBusy = loading || saving;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow border border-white/40 dark:border-slate-700/30 space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {translate("Configuración de alertas", "Alerts configuration")}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {translate(
              "Ajusta los umbrales de stock, notificaciones y automatizaciones según tus necesidades.",
              "Adjust stock thresholds, notifications, and automations according to your needs.",
            )}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="gap-2 text-sm"
          onClick={() => refresh()}
          disabled={isBusy}
        >
          <RefreshCcw className="w-4 h-4" />
          {translate("Recargar datos", "Reload data")}
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-600 dark:text-gray-400 gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>
            {translate("Cargando configuración...", "Loading settings...")}
          </span>
        </div>
      ) : (
        <form className="space-y-8" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-sm text-emerald-700 dark:text-emerald-300">
              {success}
            </div>
          )}

          <section className="space-y-4">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
              {translate("Umbrales y reglas", "Thresholds and rules")}
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {translate(
                  "Umbral global de stock crítico",
                  "Global critical stock threshold",
                )}
              </label>
              <Input
                type="number"
                min={0}
                value={formState.stockCriticalThreshold}
                onChange={(event) =>
                  handleChange(
                    "stockCriticalThreshold",
                    Number(event.target.value),
                  )
                }
                disabled={isBusy}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {translate(
                  "Si un producto está por debajo de este valor o del mínimo específico, se marcará como crítico.",
                  "If a product falls below this value or its specific minimum, it will be flagged as critical.",
                )}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {translate(
                  "Multiplicador de advertencia",
                  "Warning multiplier",
                )}
              </label>
              <Input
                type="number"
                min={1}
                step={0.1}
                value={formState.stockWarningMultiplier}
                onChange={(event) =>
                  handleChange(
                    "stockWarningMultiplier",
                    Number(event.target.value),
                  )
                }
                disabled={isBusy}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {translate(
                  "Define la distancia entre el stock crítico y el punto en el que se muestran alertas preventivas.",
                  "Defines the distance between the critical stock and the point where preventive alerts are shown.",
                )}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {translate(
                  "Días de aviso antes de caducar",
                  "Alert days before expiry",
                )}
              </label>
              <Input
                type="number"
                min={1}
                value={formState.expiryWarningDays}
                onChange={(event) =>
                  handleChange("expiryWarningDays", Number(event.target.value))
                }
                disabled={isBusy}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {translate(
                  "Te avisaremos cuando un producto esté dentro de este rango de vencimiento.",
                  "We'll notify you when a product falls within this expiry window.",
                )}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <ToggleRow
              title={translate(
                "Generar pedidos automáticos",
                "Generate automatic orders",
              )}
              description={translate(
                "Marca los productos críticos para crear tareas de reposición y dar seguimiento rápido.",
                "Mark critical products to create restock tasks and track them quickly.",
              )}
              checked={formState.autoOrderEnabled}
              onChange={(checked) => handleChange("autoOrderEnabled", checked)}
              disabled={isBusy}
            />

            <ToggleRow
              title={translate(
                "Alertas por correo electrónico",
                "Email alerts",
              )}
              description={translate(
                "Recibe un resumen diario con inventario crítico y productos próximos a vencer.",
                "Receive a daily summary with critical inventory and upcoming expiries.",
              )}
              checked={formState.notifyEmail}
              onChange={(checked) => handleChange("notifyEmail", checked)}
              disabled={isBusy}
            />

            <ToggleRow
              title={translate(
                "Notificaciones push en la PWA",
                "Push notifications in the PWA",
              )}
              description={translate(
                "Obtén avisos inmediatos dentro de la aplicación cuando algo requiera atención.",
                "Get instant in-app alerts when something needs attention.",
              )}
              checked={formState.notifyPush}
              onChange={(checked) => handleChange("notifyPush", checked)}
              disabled={isBusy}
            />
          </section>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => setFormState(settings)}
              disabled={isBusy}
            >
              <RefreshCcw className="w-4 h-4" />
              {translate("Deshacer cambios", "Undo changes")}
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white gap-2"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {translate("Guardar configuraciones", "Save settings")}
            </Button>
            {onBack && (
              <Button
                type="button"
                variant="ghost"
                className="gap-2"
                onClick={onBack}
                disabled={isBusy}
              >
                <ArrowLeft className="w-4 h-4" />
                {translate("Volver", "Go back")}
              </Button>
            )}
          </div>
        </form>
      )}
    </motion.div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
  disabled,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/60">
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
