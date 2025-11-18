// src/hooks/useAnalytics.ts
import { useState, useEffect, useCallback } from 'react';
import {
  getInventoryAnalytics,
  type InventoryAnalytics,
} from '../services/analyticsService';

interface UseAnalyticsReturn {
  data: InventoryAnalytics | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const [data, setData] = useState<InventoryAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const analytics = await getInventoryAnalytics();
      setData(analytics);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : 'Error obteniendo estadísticas';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
};
