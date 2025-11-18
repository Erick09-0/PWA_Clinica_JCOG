// src/services/analyticsService.ts
import { supabase } from '../lib/supabase';
import { getAllProducts } from './inventoryService';
import type { Product, Movement } from '../types/database.types';

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const CATEGORY_COLORS = ['#3b82f6', '#06b6d4', '#6366f1', '#0ea5e9', '#8b5cf6', '#14b8a6', '#f97316', '#e11d48'];

export interface MonthlyMovementPoint {
  month: string;
  ingresos: number;
  egresos: number;
  stock: number;
}

export interface CategoryDistributionPoint {
  name: string;
  value: number;
  color: string;
}

export interface TopProductPoint {
  id: number;
  name: string;
  sales: number;
  trend: number;
}

export interface InventoryAnalytics {
  totals: {
    totalValue: number;
    totalProducts: number;
    totalStock: number;
    avgRotation: number;
    avgStockDays: number;
  };
  monthlyMovements: MonthlyMovementPoint[];
  categoryDistribution: CategoryDistributionPoint[];
  topProducts: TopProductPoint[];
}

const buildMonthBuckets = (months: number, referenceDate: Date) => {
  const startDate = new Date(referenceDate);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(1);

  const buckets: Array<MonthlyMovementPoint & { key: string }> = [];
  for (let i = 0; i < months; i++) {
    const bucketDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    const key = `${bucketDate.getFullYear()}-${bucketDate.getMonth()}`;
    buckets.push({
      key,
      month: MONTH_LABELS[bucketDate.getMonth()],
      ingresos: 0,
      egresos: 0,
      stock: 0,
    });
  }

  return buckets;
};

const fillCategoryDistribution = (products: Product[]): CategoryDistributionPoint[] => {
  const map = new Map<string, number>();

  products.forEach((product) => {
    const category = product.category || 'Sin categoría';
    map.set(category, (map.get(category) || 0) + product.stock);
  });

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], index) => ({
      name,
      value,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));
};

const computeTopProducts = (
  products: Product[],
  movements: Pick<Movement, 'product_id' | 'movement_type' | 'quantity' | 'created_at'>[]
): TopProductPoint[] => {
  const now = new Date();
  const currentWindow = new Date(now);
  currentWindow.setDate(currentWindow.getDate() - 30);
  const previousWindow = new Date(currentWindow);
  previousWindow.setDate(previousWindow.getDate() - 30);

  const productNames = new Map<number, string>();
  products.forEach((product) => {
    productNames.set(product.id, product.name);
  });

  const currentSales = new Map<number, number>();
  const previousSales = new Map<number, number>();

  movements.forEach((movement) => {
    if (movement.movement_type !== 'salida') return;
    const createdAt = new Date(movement.created_at);
    const quantity = movement.quantity || 0;
    const currentValue = currentSales.get(movement.product_id) || 0;
    const previousValue = previousSales.get(movement.product_id) || 0;

    if (createdAt >= currentWindow) {
      currentSales.set(movement.product_id, currentValue + quantity);
    } else if (createdAt >= previousWindow && createdAt < currentWindow) {
      previousSales.set(movement.product_id, previousValue + quantity);
    }
  });

  let topProducts = Array.from(currentSales.entries())
    .map(([productId, sales]) => {
      const previous = previousSales.get(productId) || 0;
      let trend = 0;
      if (previous === 0) {
        trend = sales > 0 ? 100 : 0;
      } else {
        trend = ((sales - previous) / previous) * 100;
      }
      return {
        id: productId,
        name: productNames.get(productId) || 'Producto sin nombre',
        sales,
        trend: Math.round(trend),
      };
    })
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  if (topProducts.length === 0) {
    topProducts = products
      .slice()
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 5)
      .map((product) => ({
        id: product.id,
        name: product.name,
        sales: product.stock,
        trend: 0,
      }));
  }

  return topProducts;
};

export const getInventoryAnalytics = async (): Promise<InventoryAnalytics> => {
  const monthsToShow = 6;
  const fromDate = new Date();
  fromDate.setHours(0, 0, 0, 0);
  fromDate.setMonth(fromDate.getMonth() - (monthsToShow - 1), 1);

  const [products, movementsResponse] = await Promise.all([
    getAllProducts(),
    supabase
      .from('movements')
      .select('id, product_id, movement_type, quantity, created_at')
      .gte('created_at', fromDate.toISOString())
      .order('created_at', { ascending: true }),
  ]);

  if (movementsResponse.error) {
    throw movementsResponse.error;
  }

  const movements =
    (movementsResponse.data as Pick<
      Movement,
      'product_id' | 'movement_type' | 'quantity' | 'created_at'
    >[]) || [];

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalValue = products.reduce((sum, product) => sum + product.stock * product.price, 0);

  const monthBuckets = buildMonthBuckets(monthsToShow, fromDate);
  const bucketMap = new Map(monthBuckets.map((bucket) => [bucket.key, bucket]));

  movements.forEach((movement) => {
    const createdAt = new Date(movement.created_at);
    const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
    const bucket = bucketMap.get(key);
    if (!bucket) return;

    const quantity = movement.quantity || 0;
    if (movement.movement_type === 'entrada') {
      bucket.ingresos += quantity;
    } else if (movement.movement_type === 'salida') {
      bucket.egresos += quantity;
    }
  });

  const baseStock =
    monthBuckets.length > 0 ? Math.round(totalStock / monthBuckets.length) : totalStock;
  let runningStock = baseStock;

  monthBuckets.forEach((bucket) => {
    runningStock = Math.max(0, runningStock + bucket.ingresos - bucket.egresos);
    bucket.stock = runningStock;
  });

  const totalEgresos = monthBuckets.reduce((sum, bucket) => sum + bucket.egresos, 0);
  const avgRotation =
    monthBuckets.length > 0 ? Math.round(totalEgresos / monthBuckets.length) : 0;
  const avgDailyOutflow =
    monthBuckets.length > 0 ? totalEgresos / (monthBuckets.length * 30) : 0;
  const avgStockDays =
    avgDailyOutflow > 0 ? Math.round(totalStock / avgDailyOutflow) : totalStock ? 30 : 0;

  return {
    totals: {
      totalValue,
      totalProducts: products.length,
      totalStock,
      avgRotation,
      avgStockDays,
    },
    monthlyMovements: monthBuckets.map(({ key, ...rest }) => rest),
    categoryDistribution: fillCategoryDistribution(products),
    topProducts: computeTopProducts(products, movements),
  };
};
