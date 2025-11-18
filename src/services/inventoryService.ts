// src/services/inventoryService.ts
import { supabase } from '../lib/supabase';
import type { Product, ProductInsert, ProductUpdate, ProductStatus } from '../types/database.types';

// ============================================================
// 📦 PRODUCTOS - CRUD COMPLETO
// ============================================================

/**
 * Obtener todos los productos
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ Error obteniendo productos:', error);
    throw error;
  }
};

/**
 * Obtener un producto por ID
 */
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`❌ Error obteniendo producto ${id}:`, error);
    throw error;
  }
};

/**
 * Buscar productos por nombre o categoría
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ Error buscando productos:', error);
    throw error;
  }
};

/**
 * Filtrar productos por categoría
 */
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ Error filtrando por categoría:', error);
    throw error;
  }
};

/**
 * Filtrar productos por estado (good, low, critical)
 */
export const getProductsByStatus = async (status: ProductStatus): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', status)
      .order('stock', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ Error filtrando por estado:', error);
    throw error;
  }
};

/**
 * Obtener productos con stock crítico
 */
export const getCriticalProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'critical')
      .order('stock', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ Error obteniendo productos críticos:', error);
    throw error;
  }
};

/**
 * Obtener productos con stock bajo
 */
export const getLowStockProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('status', ['low', 'critical'])
      .order('stock', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ Error obteniendo productos con stock bajo:', error);
    throw error;
  }
};

/**
 * Crear un nuevo producto
 */
export const createProduct = async (product: ProductInsert): Promise<Product> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    console.log('✅ Producto creado:', data);
    return data;
  } catch (error) {
    console.error('❌ Error creando producto:', error);
    throw error;
  }
};

/**
 * Actualizar un producto
 */
export const updateProduct = async (
  id: number,
  updates: ProductUpdate
): Promise<Product> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    console.log('✅ Producto actualizado:', data);
    return data;
  } catch (error) {
    console.error('❌ Error actualizando producto:', error);
    throw error;
  }
};

/**
 * Eliminar un producto
 */
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    console.log(`✅ Producto ${id} eliminado`);
  } catch (error) {
    console.error('❌ Error eliminando producto:', error);
    throw error;
  }
};

/**
 * Actualizar stock de un producto
 */
export const updateStock = async (
  id: number,
  newStock: number
): Promise<Product> => {
  try {
    // Primero obtenemos el producto para calcular el nuevo estado
    const product = await getProductById(id);
    if (!product) throw new Error('Producto no encontrado');

    // Calcular nuevo estado basado en stock y min_stock
    let newStatus: ProductStatus = 'good';
    if (newStock <= 0) {
      newStatus = 'critical';
    } else if (newStock <= product.min_stock) {
      newStatus = 'critical';
    } else if (newStock <= product.min_stock * 1.5) {
      newStatus = 'low';
    }

    // Actualizar stock y estado
    const { data, error } = await supabase
      .from('products')
      .update({ 
        stock: newStock,
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    console.log('✅ Stock actualizado:', data);
    return data;
  } catch (error) {
    console.error('❌ Error actualizando stock:', error);
    throw error;
  }
};

// ============================================================
// 📊 ESTADÍSTICAS Y REPORTES
// ============================================================

/**
 * Obtener estadísticas generales del inventario
 */
export const getInventoryStats = async () => {
  try {
    const products = await getAllProducts();

    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
    const lowStock = products.filter(p => p.status === 'low').length;
    const critical = products.filter(p => p.status === 'critical').length;
    const optimal = products.filter(p => p.status === 'good').length;

    // Productos por categoría
    const byCategory = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalProducts,
      totalValue,
      lowStock,
      critical,
      optimal,
      byCategory,
    };
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    throw error;
  }
};

/**
 * Obtener categorías únicas
 */
export const getCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category');

    if (error) throw error;
    
    // Extraer categorías únicas
    const uniqueCategories = [...new Set(data?.map(p => p.category) || [])];
    return uniqueCategories;
  } catch (error) {
    console.error('❌ Error obteniendo categorías:', error);
    throw error;
  }
};

/**
 * Obtener productos próximos a vencer
 */
export const getExpiringProducts = async (daysAhead: number = 30): Promise<Product[]> => {
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gte('expiry_date', today.toISOString())
      .lte('expiry_date', futureDate.toISOString())
      .order('expiry_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ Error obteniendo productos por vencer:', error);
    throw error;
  }
};

/**
 * Crear múltiples productos (importación masiva)
 */
export const bulkCreateProducts = async (products: ProductInsert[]): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select();

    if (error) throw error;
    console.log(`✅ ${data?.length} productos creados en lote`);
    return data || [];
  } catch (error) {
    console.error('❌ Error creando productos en lote:', error);
    throw error;
  }
};