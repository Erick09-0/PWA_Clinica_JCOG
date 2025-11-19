// src/hooks/useInventory.ts
import { useState, useEffect, useCallback } from 'react';
import * as inventoryService from '../services/inventoryService';
import type { Product, ProductInsert, ProductUpdate, ProductStatus } from '../types/database.types';
import { useToast } from '../contexts/ToastContext';
import { enqueueOfflineProduct, getOfflineProducts, removeOfflineProduct } from '../utils/offlineQueue';

interface UseInventoryReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  stats: {
    totalProducts: number;
    totalValue: number;
    lowStock: number;
    critical: number;
    optimal: number;
  } | null;
  
  // Funciones
  fetchProducts: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  filterByCategory: (category: string) => Promise<void>;
  filterByStatus: (status: ProductStatus) => Promise<void>;
  createProduct: (product: ProductInsert) => Promise<Product | null>;
  updateProduct: (id: number, updates: ProductUpdate) => Promise<Product | null>;
  deleteProduct: (id: number) => Promise<boolean>;
  updateStock: (id: number, newStock: number) => Promise<Product | null>;
  refreshStats: () => Promise<void>;
}

export const useInventory = (): UseInventoryReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UseInventoryReturn['stats']>(null);
  const { info: toastInfo, error: toastError } = useToast();

  // ============================================================
  // REFRESH STATS
  // ============================================================
  const refreshStats = useCallback(async () => {
    try {
      const statsData = await inventoryService.getInventoryStats();
      setStats({
        totalProducts: statsData.totalProducts,
        totalValue: statsData.totalValue,
        lowStock: statsData.lowStock,
        critical: statsData.critical,
        optimal: statsData.optimal,
      });
    } catch (err) {
      console.error('Error refreshing stats:', err);
    }
  }, []);

  // ============================================================
  // 📦 FETCH PRODUCTS
  // ============================================================
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryService.getAllProducts();
      setProducts(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // 🔍 SEARCH PRODUCTS
  // ============================================================
  const searchProducts = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (query.trim() === '') {
        await fetchProducts();
        return;
      }
      
      const data = await inventoryService.searchProducts(query);
      setProducts(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error buscando productos';
      setError(errorMsg);
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  // ============================================================
  // 🏷️ FILTER BY CATEGORY
  // ============================================================
  const filterByCategory = useCallback(async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (category === 'all' || category === '') {
        await fetchProducts();
        return;
      }
      
      const data = await inventoryService.getProductsByCategory(category);
      setProducts(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error filtrando por categoría';
      setError(errorMsg);
      console.error('Error filtering by category:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  // ============================================================
  // 📊 FILTER BY STATUS
  // ============================================================
  const filterByStatus = useCallback(async (status: ProductStatus) => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryService.getProductsByStatus(status);
      setProducts(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error filtrando por estado';
      setError(errorMsg);
      console.error('Error filtering by status:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // ➕ CREATE PRODUCT
  // ============================================================
  const createProduct = useCallback(async (product: ProductInsert): Promise<Product | null> => {
    const saveOffline = () => {
      enqueueOfflineProduct(product);
      toastInfo?.('Sin conexión. El producto se sincronizará automáticamente.');
      const offlineProduct = {
        ...product,
        id: Date.now(),
        status:
          product.stock <= product.min_stock
            ? 'critical'
            : product.stock <= product.min_stock * 1.5
            ? 'low'
            : 'good',
      } as Product;
      setProducts(prev => [offlineProduct, ...prev]);
      return offlineProduct;
    };

    try {
      setError(null);
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return saveOffline();
      }

      const newProduct = await inventoryService.createProduct(product);
      setProducts(prev => [newProduct, ...prev]);
      await refreshStats();
      return newProduct;
    } catch (err) {
      const isNetworkError =
        typeof navigator !== 'undefined' &&
        (!navigator.onLine ||
          (err instanceof Error && /fetch|Failed to fetch|NetworkError/i.test(err.message)));

      if (isNetworkError) {
        return saveOffline();
      }

      const errorMsg = err instanceof Error ? err.message : 'Error creando producto';
      setError(errorMsg);
      toastError?.(errorMsg);
      console.error('Error creating product:', err);
      return null;
    }
  }, [refreshStats, toastInfo, toastError]);

  // ============================================================
  // ✏️ UPDATE PRODUCT
  // ============================================================
  const updateProduct = useCallback(async (
    id: number,
    updates: ProductUpdate
  ): Promise<Product | null> => {
    try {
      setError(null);
      const updatedProduct = await inventoryService.updateProduct(id, updates);
      
      // Actualizar la lista local
      setProducts(prev => 
        prev.map(p => p.id === id ? updatedProduct : p)
      );
      
      // Refrescar estadísticas
      await refreshStats();
      
      return updatedProduct;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error actualizando producto';
      setError(errorMsg);
      console.error('Error updating product:', err);
      return null;
    }
  }, []);

  // ============================================================
  // 🗑️ DELETE PRODUCT
  // ============================================================
  const deleteProduct = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await inventoryService.deleteProduct(id);
      
      // Actualizar la lista local
      setProducts(prev => prev.filter(p => p.id !== id));
      
      // Refrescar estadísticas
      await refreshStats();
      
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error eliminando producto';
      setError(errorMsg);
      console.error('Error deleting product:', err);
      return false;
    }
  }, []);

  // ============================================================
  // 📦 UPDATE STOCK
  // ============================================================
  const updateStock = useCallback(async (
    id: number,
    newStock: number
  ): Promise<Product | null> => {
    try {
      setError(null);
      const updatedProduct = await inventoryService.updateStock(id, newStock);
      
      // Actualizar la lista local
      setProducts(prev => 
        prev.map(p => p.id === id ? updatedProduct : p)
      );
      
      // Refrescar estadísticas
      await refreshStats();
      
      return updatedProduct;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error actualizando stock';
      setError(errorMsg);
      console.error('Error updating stock:', err);
      return null;
    }
  }, []);

  // ============================================================
  // 📊 REFRESH STATS
  // ============================================================
  // SYNC OFFLINE PRODUCTS
  // ============================================================
  const syncOfflineProducts = useCallback(async () => {
    const queued = getOfflineProducts();
    if (!queued.length) return;
    let synced = 0;
    for (const record of queued) {
      try {
        await inventoryService.createProduct(record.payload);
        removeOfflineProduct(record.id);
        synced += 1;
      } catch (err) {
        console.error('Error sincronizando cola offline:', err);
        break;
      }
    }
    if (synced > 0) {
      await fetchProducts();
      await refreshStats();
      toastInfo?.(`${synced} producto(s) sincronizados desde modo offline.`);
    }
  }, [fetchProducts, refreshStats, toastInfo]);

  // ============================================================
  // 🎯 INITIAL LOAD
  // ============================================================
  useEffect(() => {
    fetchProducts();
    refreshStats();
  }, [fetchProducts, refreshStats]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (navigator.onLine) {
      syncOfflineProducts();
    }
    const handleOnline = () => {
      syncOfflineProducts();
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [syncOfflineProducts]);

  return {
    products,
    loading,
    error,
    stats,
    fetchProducts,
    searchProducts,
    filterByCategory,
    filterByStatus,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    refreshStats,
  };
};

// ============================================================
// 🎨 HOOK PARA PRODUCTOS CRÍTICOS
// ============================================================
export const useCriticalProducts = () => {
  const [criticalProducts, setCriticalProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCriticalProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryService.getCriticalProducts();
      setCriticalProducts(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error obteniendo productos críticos';
      setError(errorMsg);
      console.error('Error fetching critical products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCriticalProducts();
  }, [fetchCriticalProducts]);

  return {
    criticalProducts,
    loading,
    error,
    refresh: fetchCriticalProducts,
  };
};

// ============================================================
// 📋 HOOK PARA CATEGORÍAS
// ============================================================
export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await inventoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};

