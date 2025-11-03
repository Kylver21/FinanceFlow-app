/*
  # Actualizar RLS (Row Level Security) con Autenticación

  ## Descripción
  Este script actualiza las políticas de seguridad para que cada usuario
  solo pueda ver y modificar sus propios datos.

  ## Cambios
  1. Se eliminan las políticas permisivas antiguas
  2. Se crean nuevas políticas basadas en el user_id de auth.users
  3. Se agrega la columna user_id a todas las tablas si no existe
*/

-- ============================================
-- 1. Agregar columna user_id a todas las tablas
-- ============================================

-- Agregar user_id a categorias
ALTER TABLE categorias 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Agregar user_id a ingresos
ALTER TABLE ingresos 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Agregar user_id a gastos
ALTER TABLE gastos 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Agregar user_id a alertas
ALTER TABLE alertas 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- ============================================
-- 2. Crear índices para mejorar el rendimiento
-- ============================================

CREATE INDEX IF NOT EXISTS idx_categorias_user_id ON categorias(user_id);
CREATE INDEX IF NOT EXISTS idx_ingresos_user_id ON ingresos(user_id);
CREATE INDEX IF NOT EXISTS idx_gastos_user_id ON gastos(user_id);
CREATE INDEX IF NOT EXISTS idx_alertas_user_id ON alertas(user_id);

-- ============================================
-- 3. Eliminar políticas antiguas
-- ============================================

DROP POLICY IF EXISTS "Allow all access to categorias" ON categorias;
DROP POLICY IF EXISTS "Allow all access to ingresos" ON ingresos;
DROP POLICY IF EXISTS "Allow all access to gastos" ON gastos;
DROP POLICY IF EXISTS "Allow all access to alertas" ON alertas;

-- ============================================
-- 4. Crear nuevas políticas de seguridad
-- ============================================

-- Políticas para CATEGORIAS
CREATE POLICY "Users can view their own categorias"
  ON categorias FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categorias"
  ON categorias FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categorias"
  ON categorias FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categorias"
  ON categorias FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para INGRESOS
CREATE POLICY "Users can view their own ingresos"
  ON ingresos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ingresos"
  ON ingresos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ingresos"
  ON ingresos FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ingresos"
  ON ingresos FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para GASTOS
CREATE POLICY "Users can view their own gastos"
  ON gastos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gastos"
  ON gastos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gastos"
  ON gastos FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gastos"
  ON gastos FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para ALERTAS
CREATE POLICY "Users can view their own alertas"
  ON alertas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alertas"
  ON alertas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alertas"
  ON alertas FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alertas"
  ON alertas FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 5. Crear función para insertar categorías por defecto
-- ============================================

CREATE OR REPLACE FUNCTION create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  -- Categorías de Ingresos
  INSERT INTO categorias (nombre, tipo, icono, color, user_id) VALUES
    ('Sueldo', 'ingreso', 'Wallet', '#10b981', NEW.id),
    ('Propina', 'ingreso', 'HandCoins', '#84cc16', NEW.id),
    ('Freelance', 'ingreso', 'Briefcase', '#14b8a6', NEW.id),
    ('Otros Ingresos', 'ingreso', 'PlusCircle', '#06b6d4', NEW.id);

  -- Categorías de Gastos
  INSERT INTO categorias (nombre, tipo, icono, color, user_id) VALUES
    ('Transporte', 'gasto', 'Bus', '#ef4444', NEW.id),
    ('Comida', 'gasto', 'Utensils', '#f59e0b', NEW.id),
    ('Universidad', 'gasto', 'GraduationCap', '#8b5cf6', NEW.id),
    ('Streaming', 'gasto', 'Tv', '#ec4899', NEW.id),
    ('Suscripciones', 'gasto', 'CreditCard', '#f43f5e', NEW.id),
    ('Entretenimiento', 'gasto', 'Gamepad2', '#a855f7', NEW.id),
    ('Salud', 'gasto', 'Heart', '#3b82f6', NEW.id),
    ('Otros Gastos', 'gasto', 'MinusCircle', '#6b7280', NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger para ejecutar la función al registrarse un nuevo usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_categories();
