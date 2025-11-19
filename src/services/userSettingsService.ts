// src/services/userSettingsService.ts
import { supabase } from '../lib/supabase';
import type {
  UserSettings,
  UserSettingsRow,
  UserSettingsUpdate,
} from '../types/database.types';

export const DEFAULT_USER_SETTINGS: UserSettings = {
  userId: '',
  fullName: '',
  phone: '',
  role: 'Administrador',
  currency: 'MXN',
  timezone: 'America/Mexico_City',
  dateFormat: 'DD/MM/YYYY',
  language: 'es',
  notifyStockCritical: true,
  notifyExpiring: true,
  notifyPendingOrders: false,
  notifyDailyReports: true,
};

const mapRowToSettings = (row: UserSettingsRow): UserSettings => ({
  userId: row.user_id,
  fullName: row.full_name || DEFAULT_USER_SETTINGS.fullName,
  phone: row.phone || DEFAULT_USER_SETTINGS.phone,
  role: row.role || DEFAULT_USER_SETTINGS.role,
  currency: row.currency || DEFAULT_USER_SETTINGS.currency,
  timezone: row.timezone || DEFAULT_USER_SETTINGS.timezone,
  dateFormat: row.date_format || DEFAULT_USER_SETTINGS.dateFormat,
  language: row.language || DEFAULT_USER_SETTINGS.language,
  notifyStockCritical:
    row.notify_stock_critical ?? DEFAULT_USER_SETTINGS.notifyStockCritical,
  notifyExpiring: row.notify_expiring ?? DEFAULT_USER_SETTINGS.notifyExpiring,
  notifyPendingOrders:
    row.notify_pending_orders ?? DEFAULT_USER_SETTINGS.notifyPendingOrders,
  notifyDailyReports:
    row.notify_daily_reports ?? DEFAULT_USER_SETTINGS.notifyDailyReports,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapSettingsToRow = (
  userId: string,
  settings: UserSettings | UserSettingsUpdate
): Partial<UserSettingsRow> => ({
  user_id: userId,
  full_name: settings.fullName,
  phone: settings.phone,
  role: settings.role,
  currency: settings.currency,
  timezone: settings.timezone,
  date_format: settings.dateFormat,
  language: settings.language,
  notify_stock_critical: settings.notifyStockCritical,
  notify_expiring: settings.notifyExpiring,
  notify_pending_orders: settings.notifyPendingOrders,
  notify_daily_reports: settings.notifyDailyReports,
});

export const fetchUserSettings = async (
  userId: string
): Promise<UserSettings> => {
  if (!userId) {
    return { ...DEFAULT_USER_SETTINGS, userId: '' };
  }

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    return { ...DEFAULT_USER_SETTINGS, userId };
  }

  return mapRowToSettings(data);
};

export const saveUserSettings = async (
  userId: string,
  settings: UserSettings
): Promise<UserSettings> => {
  if (!userId) {
    throw new Error('No se encontró el usuario autenticado');
  }

  const payload = mapSettingsToRow(userId, settings);
  const { data, error } = await supabase
    .from('user_settings')
    .upsert(payload, { onConflict: 'user_id' })
    .select('*')
    .single();

  if (error) throw error;
  return mapRowToSettings(data);
};
