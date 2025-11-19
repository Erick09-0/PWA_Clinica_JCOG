// src/types/database.types.ts

export type ProductStatus = 'good' | 'low' | 'critical';

export interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  min_stock: number;
  location: string;
  price: number;
  expiry_date: string;
  status: ProductStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Alert {
  id: number;
  product_id: number;
  alert_type: 'stock_low' | 'stock_critical' | 'expiry_soon' | 'expired';
  message: string;
  priority: 'high' | 'medium' | 'low';
  is_read: boolean;
  created_at: string;
}

export interface Movement {
  id: number;
  product_id: number;
  movement_type: 'entrada' | 'salida';
  quantity: number;
  reason: string;
  user_id?: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
  created_at?: string;
}

export interface AlertSettingsRow {
  id: number;
  stock_critical_threshold: number;
  stock_warning_multiplier: number;
  expiry_warning_days: number;
  auto_order_enabled: boolean;
  notify_email: boolean;
  notify_push: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AlertSettings {
  id: number;
  stockCriticalThreshold: number;
  stockWarningMultiplier: number;
  expiryWarningDays: number;
  autoOrderEnabled: boolean;
  notifyEmail: boolean;
  notifyPush: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Tipos para las inserciones (sin campos autogenerados)
export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'status'>;
export type AlertInsert = Omit<Alert, 'id' | 'created_at'>;
export type MovementInsert = Omit<Movement, 'id' | 'created_at'>;
export type CategoryInsert = Omit<Category, 'id' | 'created_at'>;

// Tipos para actualizaciones
export type ProductUpdate = Partial<ProductInsert>;
export type AlertUpdate = Partial<Omit<Alert, 'id' | 'created_at'>>;
export interface UserSettingsRow {
  user_id: string;
  full_name?: string;
  phone?: string;
  role?: string;
  currency?: string;
  timezone?: string;
  date_format?: string;
  language?: string;
  notify_stock_critical?: boolean;
  notify_expiring?: boolean;
  notify_pending_orders?: boolean;
  notify_daily_reports?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserSettings {
  userId: string;
  fullName: string;
  phone: string;
  role: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  language: string;
  notifyStockCritical: boolean;
  notifyExpiring: boolean;
  notifyPendingOrders: boolean;
  notifyDailyReports: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type AlertSettingsUpdate = Partial<Omit<AlertSettings, 'id'>>;
export type UserSettingsUpdate = Partial<Omit<UserSettings, 'userId'>>;
