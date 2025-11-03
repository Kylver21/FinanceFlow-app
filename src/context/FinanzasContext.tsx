import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, Categoria, Ingreso, Gasto, Alerta } from '../services/supabase';
import { useAuth } from './AuthContext';

interface FinanzasContextType {
  categorias: Categoria[];
  ingresos: Ingreso[];
  gastos: Gasto[];
  alertas: Alerta[];
  loading: boolean;
  refreshData: () => Promise<void>;
  // Categorías
  addCategoria: (categoria: Omit<Categoria, 'id' | 'created_at'>) => Promise<void>;
  updateCategoria: (id: string, updates: Partial<Categoria>) => Promise<void>;
  deleteCategoria: (id: string) => Promise<void>;
  addIngreso: (ingreso: Omit<Ingreso, 'id' | 'created_at'>) => Promise<void>;
  addGasto: (gasto: Omit<Gasto, 'id' | 'created_at'>) => Promise<void>;
  updateGasto: (id: string, updates: Partial<Gasto>) => Promise<void>;
  addAlerta: (alerta: Omit<Alerta, 'id' | 'created_at'>) => Promise<void>;
  deleteIngreso: (id: string) => Promise<void>;
  deleteGasto: (id: string) => Promise<void>;
  deleteAlerta: (id: string) => Promise<void>;
  updateAlerta: (id: string, updates: Partial<Alerta>) => Promise<void>;
}

const FinanzasContext = createContext<FinanzasContextType | undefined>(undefined);

export const FinanzasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategorias = async () => {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nombre');

    if (error) {
      console.error('Error fetching categorias:', error);
      return;
    }

    setCategorias(data || []);
  };

  const fetchIngresos = async () => {
    const { data, error } = await supabase
      .from('ingresos')
      .select('*, categorias(*)')
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error fetching ingresos:', error);
      return;
    }

    setIngresos(data || []);
  };

  const fetchGastos = async () => {
    const { data, error } = await supabase
      .from('gastos')
      .select('*, categorias(*)')
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error fetching gastos:', error);
      return;
    }

    setGastos(data || []);
  };

  const fetchAlertas = async () => {
    const { data, error } = await supabase
      .from('alertas')
      .select('*, categorias(*)')
      .order('dia_cobro');

    if (error) {
      console.error('Error fetching alertas:', error);
      return;
    }

    setAlertas(data || []);
  };

  // CRUD Categorías
  const addCategoria = async (
    categoria: Omit<Categoria, 'id' | 'created_at'>
  ) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    const { error } = await supabase.from('categorias').insert([{
      ...categoria,
      user_id: user.id
    }]);
    if (error) {
      console.error('Error adding categoria:', error);
      throw error;
    }
    await fetchCategorias();
  };

  const updateCategoria = async (
    id: string,
    updates: Partial<Categoria>
  ) => {
    const { error } = await supabase
      .from('categorias')
      .update(updates)
      .eq('id', id);
    if (error) {
      console.error('Error updating categoria:', error);
      throw error;
    }
    await fetchCategorias();
  };

  const deleteCategoria = async (id: string) => {
    const { error } = await supabase.from('categorias').delete().eq('id', id);
    if (error) {
      console.error('Error deleting categoria:', error);
      throw error;
    }
    await fetchCategorias();
    // Opcional: actualizar listas relacionadas para reflejar ON DELETE SET NULL
    await Promise.all([fetchIngresos(), fetchGastos(), fetchAlertas()]);
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      fetchCategorias(),
      fetchIngresos(),
      fetchGastos(),
      fetchAlertas(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addIngreso = async (ingreso: Omit<Ingreso, 'id' | 'created_at'>) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    const { error } = await supabase
      .from('ingresos')
      .insert([{ ...ingreso, user_id: user.id }]);

    if (error) {
      console.error('Error adding ingreso:', error);
      throw error;
    }

    await fetchIngresos();
  };

  const addGasto = async (gasto: Omit<Gasto, 'id' | 'created_at'>) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    const { error} = await supabase
      .from('gastos')
      .insert([{ ...gasto, user_id: user.id }]);

    if (error) {
      console.error('Error adding gasto:', error);
      throw error;
    }

    await fetchGastos();
  };

  const updateGasto = async (id: string, updates: Partial<Gasto>) => {
    const { error } = await supabase
      .from('gastos')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating gasto:', error);
      throw error;
    }

    await fetchGastos();
  };

  const addAlerta = async (alerta: Omit<Alerta, 'id' | 'created_at'>) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    const { error } = await supabase
      .from('alertas')
      .insert([{ ...alerta, user_id: user.id }]);

    if (error) {
      console.error('Error adding alerta:', error);
      throw error;
    }

    await fetchAlertas();
  };

  const deleteIngreso = async (id: string) => {
    const { error } = await supabase
      .from('ingresos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting ingreso:', error);
      throw error;
    }

    await fetchIngresos();
  };

  const deleteGasto = async (id: string) => {
    const { error } = await supabase
      .from('gastos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting gasto:', error);
      throw error;
    }

    await fetchGastos();
  };

  const deleteAlerta = async (id: string) => {
    const { error } = await supabase
      .from('alertas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting alerta:', error);
      throw error;
    }

    await fetchAlertas();
  };

  const updateAlerta = async (id: string, updates: Partial<Alerta>) => {
    const { error } = await supabase
      .from('alertas')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating alerta:', error);
      throw error;
    }

    await fetchAlertas();
  };

  return (
    <FinanzasContext.Provider
      value={{
        categorias,
        ingresos,
        gastos,
        alertas,
        loading,
        refreshData,
        addCategoria,
        updateCategoria,
        deleteCategoria,
        addIngreso,
        addGasto,
        updateGasto,
        addAlerta,
        deleteIngreso,
        deleteGasto,
        deleteAlerta,
        updateAlerta,
      }}
    >
      {children}
    </FinanzasContext.Provider>
  );
};

export const useFinanzas = () => {
  const context = useContext(FinanzasContext);
  if (context === undefined) {
    throw new Error('useFinanzas must be used within a FinanzasProvider');
  }
  return context;
};
