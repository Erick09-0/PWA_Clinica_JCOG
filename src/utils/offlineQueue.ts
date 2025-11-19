import type { ProductInsert } from '../types/database.types';

const STORAGE_KEY = 'offline-product-queue';

interface OfflineProductRecord {
  id: string;
  payload: ProductInsert;
  timestamp: string;
}

const readQueue = (): OfflineProductRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.error('Error leyendo cola offline:', error);
    return [];
  }
};

const writeQueue = (records: OfflineProductRecord[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error guardando cola offline:', error);
  }
};

export const enqueueOfflineProduct = (payload: ProductInsert) => {
  const queue = readQueue();
  queue.push({
    id: crypto.randomUUID(),
    payload,
    timestamp: new Date().toISOString(),
  });
  writeQueue(queue);
};

export const getOfflineProducts = () => readQueue();

export const removeOfflineProduct = (id: string) => {
  const queue = readQueue().filter((record) => record.id !== id);
  writeQueue(queue);
};
