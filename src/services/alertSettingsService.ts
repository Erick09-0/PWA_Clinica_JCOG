// src/services/alertSettingsService.ts
import { supabase } from '../lib/supabase';
import type { AlertSettings, AlertSettingsRow } from '../types/database.types';

export const DEFAULT_ALERT_SETTINGS: AlertSettings = {
  id: 1,
  stockCriticalThreshold: 5,
  stockWarningMultiplier: 1.5,
  expiryWarningDays: 30,
  autoOrderEnabled: false,
  notifyEmail: true,
  notifyPush: false,
  createdAt: undefined,
  updatedAt: undefined,
};

const mapRowToSettings = (row: AlertSettingsRow): AlertSettings => ({
  id: row.id,
  stockCriticalThreshold:
    row.stock_critical_threshold ?? DEFAULT_ALERT_SETTINGS.stockCriticalThreshold,
  stockWarningMultiplier:
    row.stock_warning_multiplier ?? DEFAULT_ALERT_SETTINGS.stockWarningMultiplier,
  expiryWarningDays:
    row.expiry_warning_days ?? DEFAULT_ALERT_SETTINGS.expiryWarningDays,
  autoOrderEnabled: row.auto_order_enabled ?? DEFAULT_ALERT_SETTINGS.autoOrderEnabled,
  notifyEmail: row.notify_email ?? DEFAULT_ALERT_SETTINGS.notifyEmail,
  notifyPush: row.notify_push ?? DEFAULT_ALERT_SETTINGS.notifyPush,
  createdAt: row.created_at || undefined,
  updatedAt: row.updated_at || undefined,
});

const mapSettingsToRow = (settings: AlertSettings): AlertSettingsRow => ({
  id: settings.id ?? DEFAULT_ALERT_SETTINGS.id,
  stock_critical_threshold: settings.stockCriticalThreshold,
  stock_warning_multiplier: settings.stockWarningMultiplier,
  expiry_warning_days: settings.expiryWarningDays,
  auto_order_enabled: settings.autoOrderEnabled,
  notify_email: settings.notifyEmail,
  notify_push: settings.notifyPush,
  created_at: settings.createdAt,
  updated_at: settings.updatedAt,
});

export const fetchAlertSettings = async (): Promise<AlertSettings> => {
  try {
    const { data, error } = await supabase
      .from('alert_settings')
      .select('*')
      .order('id', { ascending: true })
      .limit(1);

    if (error) throw error;
    if (!data || data.length === 0) {
      return DEFAULT_ALERT_SETTINGS;
    }

    return mapRowToSettings(data[0]);
  } catch (error) {
    console.error('Error obteniendo configuraciones de alertas:', error);
    throw error;
  }
};

export const persistAlertSettings = async (
  settings: AlertSettings
): Promise<AlertSettings> => {
  try {
    const payload = mapSettingsToRow({
      ...settings,
      updatedAt: new Date().toISOString(),
    });

    const { data, error } = await supabase
      .from('alert_settings')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return mapRowToSettings(data);
  } catch (error) {
    console.error('Error guardando configuraciones de alertas:', error);
    throw error;
  }
};
