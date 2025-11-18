// src/hooks/useAlerts.ts
// Hook que construye alertas dinámicas a partir de los productos almacenados en Supabase.

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Product, AlertSettings } from '../types/database.types';
import { getAllProducts } from '../services/inventoryService';
import {
  DEFAULT_ALERT_SETTINGS,
  fetchAlertSettings,
} from '../services/alertSettingsService';

const READ_ALERTS_STORAGE_KEY = 'clinica-alerts-read';
const DAY_IN_MS = 1000 * 60 * 60 * 24;

export interface InventoryAlert {
  id: number;
  type: 'critical' | 'warning' | 'info';
  icon: any;
  title: string;
  message: string;
  product: string;
  time: string;
  action: string;
  isRead?: boolean;
}

const getRelativeTime = (timestamp?: string): string => {
  if (!timestamp) return 'Hace pocos minutos';
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();

  const minuteMs = 1000 * 60;
  const hourMs = minuteMs * 60;
  const dayMs = hourMs * 24;

  if (diffMs < hourMs) {
    const minutes = Math.max(1, Math.floor(diffMs / minuteMs));
    return `Hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  }
  if (diffMs < dayMs) {
    const hours = Math.floor(diffMs / hourMs);
    return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
  }
  const days = Math.floor(diffMs / dayMs);
  return `Hace ${days} día${days !== 1 ? 's' : ''}`;
};

const formatDate = (date: Date): string =>
  date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

const generateAlertId = (productId: number, offset: number) => productId * 10 + offset;

const buildAlertsFromProducts = (
  products: Product[],
  settings: AlertSettings = DEFAULT_ALERT_SETTINGS
): InventoryAlert[] => {
  const now = new Date();
  const alerts: InventoryAlert[] = [];
  const stockCriticalThreshold = Math.max(
    0,
    settings.stockCriticalThreshold ?? DEFAULT_ALERT_SETTINGS.stockCriticalThreshold
  );
  const stockWarningMultiplier = Math.max(
    1,
    settings.stockWarningMultiplier ?? DEFAULT_ALERT_SETTINGS.stockWarningMultiplier
  );
  const expiryWarningDays = Math.max(
    1,
    settings.expiryWarningDays ?? DEFAULT_ALERT_SETTINGS.expiryWarningDays
  );

  products.forEach((product) => {
    const baseTimestamp = product.updated_at || product.created_at || now.toISOString();
    const minStock = Math.max(product.min_stock ?? 0, stockCriticalThreshold);

    if (
      product.stock <= 0 ||
      product.status === 'critical' ||
      product.stock <= minStock
    ) {
      alerts.push({
        id: generateAlertId(product.id, 1),
        type: 'critical',
        icon: null,
        title: 'Stock crítico',
        message: `${product.name} está por debajo del mínimo recomendado. Stock actual ${product.stock} unidades.`,
        product: product.name,
        time: getRelativeTime(baseTimestamp),
        action: settings.autoOrderEnabled ? 'Generar pedido' : 'Actualizar stock',
      });
    } else if (
      product.status === 'low' ||
      product.stock <= Math.ceil(minStock * stockWarningMultiplier)
    ) {
      alerts.push({
        id: generateAlertId(product.id, 2),
        type: 'warning',
        icon: null,
        title: 'Stock bajo',
        message: `${product.name} se acerca al mínimo establecido (${product.min_stock}).`,
        product: product.name,
        time: getRelativeTime(baseTimestamp),
        action: settings.autoOrderEnabled ? 'Programar pedido' : 'Planear pedido',
      });
    }

    if (product.expiry_date) {
      const expiryDate = new Date(product.expiry_date);
      if (!Number.isNaN(expiryDate.getTime())) {
        const daysDiff = Math.ceil((expiryDate.getTime() - now.getTime()) / DAY_IN_MS);

        if (daysDiff < 0) {
          const pastDays = Math.abs(daysDiff);
          alerts.push({
            id: generateAlertId(product.id, 3),
            type: 'critical',
            icon: null,
            title: 'Producto vencido',
            message: `${product.name} venció el ${formatDate(expiryDate)}.`,
            product: product.name,
            time: `Caducó hace ${pastDays} día${pastDays !== 1 ? 's' : ''}`,
            action: 'Retirar lote',
          });
        } else if (daysDiff <= expiryWarningDays) {
          alerts.push({
            id: generateAlertId(product.id, 4),
            type: 'warning',
            icon: null,
            title: 'Próximo a vencer',
            message: `${product.name} caduca el ${formatDate(expiryDate)}.`,
            product: product.name,
            time: `Caduca en ${daysDiff} día${daysDiff !== 1 ? 's' : ''}`,
            action: 'Priorizar consumo',
          });
        }
      }
    }
  });

  const severityOrder: Record<InventoryAlert['type'], number> = {
    critical: 0,
    warning: 1,
    info: 2,
  };

  return alerts.sort((a, b) => severityOrder[a.type] - severityOrder[b.type]);
};

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [settings, setSettings] = useState<AlertSettings>(DEFAULT_ALERT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const readAlertIdsRef = useRef<Set<number>>(new Set());
  const readStateHydrated = useRef<boolean>(false);

  const persistReadState = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const serialized = JSON.stringify(Array.from(readAlertIdsRef.current));
      window.localStorage.setItem(READ_ALERTS_STORAGE_KEY, serialized);
    } catch (storageError) {
      console.error('No se pudo guardar el estado de alertas leídas', storageError);
    }
  }, []);

  const hydrateReadState = useCallback(() => {
    if (readStateHydrated.current || typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(READ_ALERTS_STORAGE_KEY);
      if (stored) {
        const parsed: number[] = JSON.parse(stored);
        readAlertIdsRef.current = new Set(parsed);
      }
    } catch (storageError) {
      console.error('No se pudo leer el estado de alertas leídas', storageError);
    } finally {
      readStateHydrated.current = true;
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      hydrateReadState();

      const [products, fetchedSettings] = await Promise.all([
        getAllProducts(),
        fetchAlertSettings(),
      ]);

      setSettings(fetchedSettings);
      const generatedAlerts = buildAlertsFromProducts(products, fetchedSettings);

      setAlerts(
        generatedAlerts.map((alert) => ({
          ...alert,
          isRead: readAlertIdsRef.current.has(alert.id),
        }))
      );
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : 'Error obteniendo alertas';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [hydrateReadState]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const markAlertAsRead = useCallback(
    (alertId: number) => {
      if (readAlertIdsRef.current.has(alertId)) return;

      readAlertIdsRef.current.add(alertId);
      persistReadState();
      setAlerts((prev) =>
        prev.map((alert) => (alert.id === alertId ? { ...alert, isRead: true } : alert))
      );
    },
    [persistReadState]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      if (!alerts.length) return;

      alerts.forEach((alert) => readAlertIdsRef.current.add(alert.id));
      persistReadState();
      setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })));
    } catch (err: any) {
      const msg =
        err instanceof Error ? err.message : 'Error al marcar alertas como leídas';
      setError(msg);
    }
  }, [alerts, persistReadState]);

  return {
    alerts,
    settings,
    loading,
    error,
    refresh: fetchAlerts,
    markAllAsRead,
    markAlertAsRead,
  };
};
