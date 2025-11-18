// src/hooks/useAlertSettings.ts
import { useState, useEffect, useCallback } from 'react';
import {
  DEFAULT_ALERT_SETTINGS,
  fetchAlertSettings,
  persistAlertSettings,
} from '../services/alertSettingsService';
import type { AlertSettings } from '../types/database.types';

interface UseAlertSettings {
  settings: AlertSettings;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  refresh: () => Promise<void>;
  save: (updates: Partial<AlertSettings>) => Promise<AlertSettings | null>;
}

export const useAlertSettings = (): UseAlertSettings => {
  const [settings, setSettings] = useState<AlertSettings>(DEFAULT_ALERT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAlertSettings();
      setSettings(data);
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'Error obteniendo configuración';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(
    async (updates: Partial<AlertSettings>): Promise<AlertSettings | null> => {
      try {
        setSaving(true);
        setError(null);
        setSuccess(null);
        const payload = {
          ...settings,
          ...updates,
        };
        const result = await persistAlertSettings(payload);
        setSettings(result);
        setSuccess('Configuración actualizada correctamente');
        return result;
      } catch (err: any) {
        const message = err instanceof Error ? err.message : 'Error al guardar configuración';
        setError(message);
        return null;
      } finally {
        setSaving(false);
      }
    },
    [settings]
  );

  return {
    settings,
    loading,
    saving,
    error,
    success,
    refresh,
    save,
  };
};
