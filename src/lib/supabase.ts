// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// 🔑 Estas variables las obtienes de tu proyecto en Supabase
// Ve a: Settings > API en tu dashboard de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan las credenciales de Supabase. Configura las variables de entorno.');
}

// Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'clinica-inventario-pwa',
    },
  },
});

// 🔧 Funciones de utilidad para debugging
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase.from('products').select('count');
    if (error) throw error;
    console.log('✅ Conexión a Supabase exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a Supabase:', error);
    return false;
  }
};