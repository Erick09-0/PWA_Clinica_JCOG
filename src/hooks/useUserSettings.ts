// src/hooks/useUserSettings.ts
import { useState, useEffect, useCallback } from 'react';
import {
  DEFAULT_USER_SETTINGS,
  fetchUserSettings,
  saveUserSettings,
} from '../services/userSettingsService';
import type { UserSettings } from '../types/database.types';

interface UseUserSettingsReturn {
  settings: UserSettings;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  refresh: () => Promise<void>;
  update: (updates: Partial<UserSettings>) => void;
  persist: () => Promise<void>;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

export const useUserSettings = (userId?: string | null): UseUserSettingsReturn => {
  const [settings, setSettings] = useState<UserSettings>({
    ...DEFAULT_USER_SETTINGS,
    userId: userId || '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserSettings(userId);
      setSettings(data);
    } catch (err: any) {
      const message =
        err instanceof Error ? err.message : 'Error obteniendo configuraciones';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      setSettings((prev) => ({ ...prev, userId }));
      refresh();
    }
  }, [userId, refresh]);

  const update = useCallback((updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const persist = useCallback(async () => {
    if (!userId) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const saved = await saveUserSettings(userId, settings);
      setSettings(saved);
      setSuccess('Configuración actualizada correctamente');
    } catch (err: any) {
      const message =
        err instanceof Error ? err.message : 'Error guardando configuraciones';
      setError(message);
    } finally {
      setSaving(false);
    }
  }, [settings, userId]);

  return {
    settings,
    loading,
    saving,
    error,
    success,
    refresh,
    update,
    persist,
    setSettings,
  };
};
