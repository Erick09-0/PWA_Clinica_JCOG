import { supabase } from '../lib/supabase';
import type { Movement } from '../types/database.types';

export interface RecentMovement extends Movement {
  product_name: string;
  category: string;
}

export const getRecentMovements = async (limit: number = 6): Promise<RecentMovement[]> => {
  const { data, error } = await supabase
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
    .order('created_at', { ascending: false })
    .limit(limit);

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
  }));
};
