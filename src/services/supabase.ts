import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Categoria {
  id: string;
  nombre: string;
  tipo: 'ingreso' | 'gasto';
  icono: string;
  color: string;
  created_at: string;
}

export interface Ingreso {
  id: string;
  descripcion: string;
  monto: number;
  categoria_id: string;
  fecha: string;
  es_recurrente: boolean;
  frecuencia: 'semanal' | 'quincenal' | 'mensual' | null;
  created_at: string;
  categorias?: Categoria;
}

export interface Gasto {
  id: string;
  descripcion: string;
  monto: number;
  categoria_id: string;
  fecha: string;
  es_fijo: boolean;
  metodo_pago: 'efectivo' | 'yape' | 'plin' | 'tarjeta' | 'banco';
  created_at: string;
  categorias?: Categoria;
}

export interface Alerta {
  id: string;
  nombre: string;
  monto: number;
  dia_cobro: number;
  categoria_id: string;
  activa: boolean;
  ultima_alerta: string | null;
  created_at: string;
  categorias?: Categoria;
}
