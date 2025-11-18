// src/components/sections/ConfigAlertas.tsx
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, RefreshCcw, Save, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { useAlertSettings } from '../../hooks/useAlertSettings';
import type { AlertSettings } from '../../types/database.types';

interface ConfigAlertasProps {
  onBack?: () => void;
}

export default function ConfigAlertas({ onBack }: ConfigAlertasProps) {
  const { settings, loading, saving, error, success, save, refresh } = useAlertSettings();
  const [formState, setFormState] = useState<AlertSettings>(settings);

  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  const handleChange = <K extends keyof AlertSettings>(field: K, value: AlertSettings[K]) => {
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
      className="p-6 bg-white/60 dark:bg-slate-800/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_rgba(31,41,55,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-white/40 dark:border-slate-700/30 space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Configuracion de Alertas
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Ajusta los umbrales de stock, notificaciones y automatizaciones segun tus necesidades.
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
          Recargar datos
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-600 dark:text-gray-400 gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Cargando configuracion...</span>
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
              Umbrales y reglas
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Umbral global de stock critico
              </label>
              <Input
                type="number"
                min={0}
                value={formState.stockCriticalThreshold}
                onChange={(event) => handleChange('stockCriticalThreshold', Number(event.target.value))}
                disabled={isBusy}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Si un producto esta por debajo de este valor o del minimo especifico, se marcara como critico.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Multiplicador de advertencia
              </label>
              <Input
                type="number"
                min={1}
                step={0.1}
                value={formState.stockWarningMultiplier}
                onChange={(event) => handleChange('stockWarningMultiplier', Number(event.target.value))}
                disabled={isBusy}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Define la distancia entre el stock critico y el punto en el que se muestran alertas preventivas.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dias de aviso antes de caducar
              </label>
              <Input
                type="number"
                min={1}
                value={formState.expiryWarningDays}
                onChange={(event) => handleChange('expiryWarningDays', Number(event.target.value))}
                disabled={isBusy}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Te avisaremos cuando un producto este dentro de este rango de vencimiento.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/60">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Generar pedidos automaticos</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Marca los productos criticos para crear tareas de reposicion y dar seguimiento rapido.
                </p>
              </div>
              <Switch
                checked={formState.autoOrderEnabled}
                onCheckedChange={(checked) => handleChange('autoOrderEnabled', checked)}
                disabled={isBusy}
              />
            </div>

            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/60">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Alertas por correo electronico</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recibe un resumen diario con inventario critico y productos proximos a vencer.
                </p>
              </div>
              <Switch
                checked={formState.notifyEmail}
                onCheckedChange={(checked) => handleChange('notifyEmail', checked)}
                disabled={isBusy}
              />
            </div>

            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/60">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Notificaciones push en la PWA</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Obten avisos inmediatos dentro de la aplicacion cuando algo requiera atencion.
                </p>
              </div>
              <Switch
                checked={formState.notifyPush}
                onCheckedChange={(checked) => handleChange('notifyPush', checked)}
                disabled={isBusy}
              />
            </div>
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
              Deshacer cambios
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white gap-2"
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar configuraciones
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
                Volver
              </Button>
            )}
          </div>
        </form>
      )}
    </motion.div>
  );
}
