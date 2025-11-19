import { supabase } from '../lib/supabase';
import {
  getAllProducts,
  getCriticalProducts,
  getExpiringProducts,
} from './inventoryService';
import type { Product, Movement } from '../types/database.types';

export interface ReportFilters {
  from?: string;
  to?: string;
  category?: string;
}

const applyDateFilter = (date: string | undefined, filters: ReportFilters) => {
  if (!date) return true;
  const target = new Date(date).getTime();
  const from = filters.from ? new Date(filters.from).getTime() : null;
  const to = filters.to ? new Date(filters.to).getTime() : null;

  if (from && target < from) return false;
  if (to) {
    // include the entire day of "to"
    const endOfDay = new Date(filters.to as string);
    endOfDay.setHours(23, 59, 59, 999);
    if (target > endOfDay.getTime()) return false;
  }
  return true;
};

export const getInventoryReportData = async (filters: ReportFilters) => {
  const products = await getAllProducts();
  return products
    .filter((product) => {
      const matchesCategory =
        !filters.category ||
        filters.category === 'all' ||
        (product.category || '').toLowerCase() === filters.category.toLowerCase();
      const matchesDate = applyDateFilter(product.updated_at || product.created_at, filters);
      return matchesCategory && matchesDate;
    })
    .map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      stock: product.stock,
      minStock: product.min_stock,
      location: product.location,
      price: product.price,
      value: product.stock * product.price,
      updated_at: product.updated_at,
    }));
};

export interface MovementReportRow extends Movement {
  product_name: string;
  category: string;
}

export const getMovementReportData = async (filters: ReportFilters) => {
  let query = supabase
    .from('movements')
    .select(
      `
      id,
      product_id,
      movement_type,
      quantity,
      reason,
      created_at,
      products:products(name, category)
    `
    )
    .order('created_at', { ascending: false });

  if (filters.from) {
    const fromISO = new Date(filters.from).toISOString();
    query = query.gte('created_at', fromISO);
  }
  if (filters.to) {
    const endOfDay = new Date(filters.to);
    endOfDay.setHours(23, 59, 59, 999);
    query = query.lte('created_at', endOfDay.toISOString());
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data || []).map((movement: any) => ({
    id: movement.id,
    product_id: movement.product_id,
    movement_type: movement.movement_type,
    quantity: movement.quantity,
    reason: movement.reason,
    created_at: movement.created_at,
    product_name: movement.products?.name || 'Producto',
    category: movement.products?.category || 'N/A',
  })) as MovementReportRow[];
};

export const getFinancialReportData = async (filters: ReportFilters) => {
  const products = await getInventoryReportData(filters);
  const byCategory = products.reduce<Record<
    string,
    { totalValue: number; totalStock: number }
  >>((acc, product) => {
    const key = product.category || 'Sin categoría';
    if (!acc[key]) {
      acc[key] = { totalValue: 0, totalStock: 0 };
    }
    acc[key].totalValue += product.value;
    acc[key].totalStock += product.stock;
    return acc;
  }, {});

  const totalValue = products.reduce((sum, product) => sum + product.value, 0);

  return {
    totalValue,
    rows: Object.entries(byCategory).map(([category, info]) => ({
      category,
      totalStock: info.totalStock,
      totalValue: info.totalValue,
      contribution:
        totalValue > 0 ? Number(((info.totalValue / totalValue) * 100).toFixed(2)) : 0,
    })),
  };
};

export const getCriticalProductsReportData = async (filters: ReportFilters) => {
  const [critical, expiring] = await Promise.all([
    getCriticalProducts(),
    getExpiringProducts(60),
  ]);

  const combined = [...critical, ...expiring];
  const map = new Map<number, Product>();

  combined.forEach((product) => {
    if (!map.has(product.id)) {
      map.set(product.id, product);
    }
  });

  return Array.from(map.values()).filter((product) => {
    const matchesCategory =
      !filters.category ||
      filters.category === 'all' ||
      (product.category || '').toLowerCase() === filters.category.toLowerCase();
    const matchesDate = applyDateFilter(product.updated_at || product.created_at, filters);
    return matchesCategory && matchesDate;
  });
};
