/*
  # Esquema de Base de Datos para Aplicación de Finanzas Personales

  ## Descripción
  Este esquema crea las tablas necesarias para una aplicación de control de finanzas personales,
  permitiendo registrar ingresos, gastos, categorías y alertas de suscripciones.

  ## 1. Nuevas Tablas

  ### `categorias`
  - `id` (uuid, primary key) - Identificador único
  - `nombre` (text) - Nombre de la categoría (ej: "Transporte", "Comida", "Sueldo")
  - `tipo` (text) - Tipo: "ingreso" o "gasto"
  - `icono` (text) - Nombre del ícono de lucide-react
  - `color` (text) - Color hex para la categoría
  - `created_at` (timestamptz) - Fecha de creación

  ### `ingresos`
  - `id` (uuid, primary key) - Identificador único
  - `descripcion` (text) - Descripción del ingreso
  - `monto` (numeric) - Cantidad de dinero
  - `categoria_id` (uuid) - Relación con categorías
  - `fecha` (date) - Fecha del ingreso
  - `es_recurrente` (boolean) - Si es un ingreso recurrente
  - `frecuencia` (text) - Frecuencia: "semanal", "quincenal", "mensual"
  - `created_at` (timestamptz) - Fecha de registro

  ### `gastos`
  - `id` (uuid, primary key) - Identificador único
  - `descripcion` (text) - Descripción del gasto
  - `monto` (numeric) - Cantidad de dinero
  - `categoria_id` (uuid) - Relación con categorías
  - `fecha` (date) - Fecha del gasto
  - `es_fijo` (boolean) - Si es un gasto fijo/recurrente
  - `metodo_pago` (text) - Método: "efectivo", "yape", "plin", "tarjeta", "banco"
  - `created_at` (timestamptz) - Fecha de registro

  ### `alertas`
  - `id` (uuid, primary key) - Identificador único
  - `nombre` (text) - Nombre de la suscripción/servicio
  - `monto` (numeric) - Costo de la suscripción
  - `dia_cobro` (integer) - Día del mes del cobro (1-31)
  - `categoria_id` (uuid) - Relación con categorías
  - `activa` (boolean) - Si la alerta está activa
  - `ultima_alerta` (date) - Última vez que se mostró la alerta
  - `created_at` (timestamptz) - Fecha de creación

  ## 2. Seguridad

  Se habilita Row Level Security (RLS) en todas las tablas.
  Por ahora, las políticas permiten acceso completo para facilitar el desarrollo inicial.
  En el futuro, cuando se implemente autenticación, se restringirá el acceso por usuario.

  ## 3. Datos Iniciales

  Se insertan categorías predefinidas comunes para facilitar el uso inicial de la app.
*/

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('ingreso', 'gasto')),
  icono text DEFAULT 'Circle',
  color text DEFAULT '#6366f1',
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de ingresos
CREATE TABLE IF NOT EXISTS ingresos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  descripcion text NOT NULL,
  monto numeric(10, 2) NOT NULL CHECK (monto > 0),
  categoria_id uuid REFERENCES categorias(id) ON DELETE SET NULL,
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  es_recurrente boolean DEFAULT false,
  frecuencia text CHECK (frecuencia IN ('semanal', 'quincenal', 'mensual')),
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de gastos
CREATE TABLE IF NOT EXISTS gastos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  descripcion text NOT NULL,
  monto numeric(10, 2) NOT NULL CHECK (monto > 0),
  categoria_id uuid REFERENCES categorias(id) ON DELETE SET NULL,
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  es_fijo boolean DEFAULT false,
  metodo_pago text DEFAULT 'efectivo' CHECK (metodo_pago IN ('efectivo', 'yape', 'plin', 'tarjeta', 'banco')),
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de alertas
CREATE TABLE IF NOT EXISTS alertas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  monto numeric(10, 2) NOT NULL CHECK (monto > 0),
  dia_cobro integer NOT NULL CHECK (dia_cobro BETWEEN 1 AND 31),
  categoria_id uuid REFERENCES categorias(id) ON DELETE SET NULL,
  activa boolean DEFAULT true,
  ultima_alerta date,
  created_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingresos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para desarrollo inicial (sin autenticación)
-- Estas se actualizarán cuando se implemente auth

CREATE POLICY "Allow all access to categorias"
  ON categorias FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to ingresos"
  ON ingresos FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to gastos"
  ON gastos FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to alertas"
  ON alertas FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insertar categorías predefinidas

-- Categorías de Ingresos
INSERT INTO categorias (nombre, tipo, icono, color) VALUES
  ('Sueldo', 'ingreso', 'Wallet', '#10b981'),
  ('Propina', 'ingreso', 'HandCoins', '#84cc16'),
  ('Freelance', 'ingreso', 'Briefcase', '#14b8a6'),
  ('Otros Ingresos', 'ingreso', 'PlusCircle', '#06b6d4')
ON CONFLICT DO NOTHING;

-- Categorías de Gastos
INSERT INTO categorias (nombre, tipo, icono, color) VALUES
  ('Transporte', 'gasto', 'Bus', '#ef4444'),
  ('Comida', 'gasto', 'Utensils', '#f59e0b'),
  ('Universidad', 'gasto', 'GraduationCap', '#8b5cf6'),
  ('Streaming', 'gasto', 'Tv', '#ec4899'),
  ('Suscripciones', 'gasto', 'CreditCard', '#f43f5e'),
  ('Entretenimiento', 'gasto', 'Gamepad2', '#a855f7'),
  ('Salud', 'gasto', 'Heart', '#3b82f6'),
  ('Otros Gastos', 'gasto', 'MinusCircle', '#6b7280')
ON CONFLICT DO NOTHING;