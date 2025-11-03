# 🚀 Guía Completa de Configuración - FinanceFlow

## 📋 Tabla de Contenidos
1. [Configuración de Supabase](#configuración-de-supabase)
2. [Habilitar Autenticación](#habilitar-autenticación)
3. [Ejecutar Migraciones](#ejecutar-migraciones)
4. [Variables de Entorno](#variables-de-entorno)
5. [Deploy en Vercel](#deploy-en-vercel)
6. [Pruebas Locales](#pruebas-locales)

---

## 1. Configuración de Supabase

### Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"** o **"New Project"**
3. Completa los datos:
   - **Name**: FinanceFlow (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (guárdala bien)
   - **Region**: Elige la más cercana a tus usuarios
   - **Pricing Plan**: Free (gratuito)
4. Haz clic en **"Create new project"**
5. Espera 2-3 minutos mientras se crea el proyecto

### Paso 2: Obtener Credenciales

Una vez creado el proyecto:

1. En el dashboard de Supabase, ve a **Settings** (⚙️) en la barra lateral
2. Clic en **API**
3. Copia estas dos claves:

```env
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGc...
```

---

## 2. Habilitar Autenticación

### Paso 1: Configurar Email Auth

1. En Supabase Dashboard, ve a **Authentication** → **Providers**
2. Busca **Email** y asegúrate que esté habilitado (switch en verde)
3. Configuración recomendada:
   - ✅ **Enable Email provider**
   - ✅ **Confirm email** (opcional, desactiva si quieres pruebas rápidas)
   - ❌ **Secure email change** (puede dejarse desactivado en desarrollo)

### Paso 2: Configurar Email Templates (Opcional)

1. Ve a **Authentication** → **Email Templates**
2. Aquí puedes personalizar:
   - **Confirm signup**: Email de confirmación de registro
   - **Magic Link**: Email con enlace mágico
   - **Change Email Address**: Cambio de email
   - **Reset Password**: Recuperación de contraseña

**Consejo**: En desarrollo, puedes desactivar la confirmación de email para probar más rápido.

### Paso 3: Desactivar Confirmación de Email (Desarrollo)

1. Ve a **Authentication** → **Settings**
2. Busca **"Enable email confirmations"**
3. Desactívalo temporalmente para desarrollo
4. **¡IMPORTANTE!**: Reactívalo antes de producción

---

## 3. Ejecutar Migraciones

### Opción A: SQL Editor (Recomendado)

1. En Supabase Dashboard, ve a **SQL Editor** (icono de código)
2. Haz clic en **"New query"**

3. **Primera migración**: Copia y pega el contenido de:
   ```
   supabase/migrations/20251005064451_create_finanzas_schema.sql
   ```
   - Haz clic en **"Run"** o presiona `Ctrl + Enter`

4. **Segunda migración**: Crea una nueva query y pega:
   ```
   supabase/migrations/20251103000000_add_auth_rls.sql
   ```
   - Haz clic en **"Run"** o presiona `Ctrl + Enter`

### Opción B: Supabase CLI (Avanzado)

Si tienes instalado Supabase CLI:

```bash
# Inicializar Supabase localmente
supabase init

# Vincular con tu proyecto
supabase link --project-ref <your-project-ref>

# Ejecutar migraciones
supabase db push
```

### ✅ Verificar Migraciones

1. Ve a **Table Editor** en Supabase
2. Deberías ver estas tablas:
   - ✅ `categorias`
   - ✅ `ingresos`
   - ✅ `gastos`
   - ✅ `alertas`

3. Ve a **Authentication** → **Policies**
4. Deberías ver políticas RLS para cada tabla

---

## 4. Variables de Entorno

### Desarrollo Local

1. En la raíz del proyecto, crea `.env`:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. Reemplaza con tus valores reales de Supabase
3. ⚠️ **Nunca** subas el `.env` a GitHub (ya está en `.gitignore`)

### Verificar Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

---

## 5. Deploy en Vercel

### Paso 1: Subir a GitHub

```bash
# Inicializar Git (si no lo has hecho)
git init

# Agregar archivos
git add .

# Hacer commit
git commit -m "feat: Añadir autenticación con Supabase"

# Agregar repositorio remoto
git remote add origin https://github.com/Kylver21/Finanzas-app.git

# Subir a GitHub
git push -u origin main
```

### Paso 2: Importar en Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Haz clic en **"New Project"**
3. Importa tu repositorio de GitHub
4. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (raíz)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Paso 3: Configurar Variables de Entorno

En la configuración del proyecto en Vercel:

1. Ve a **Settings** → **Environment Variables**
2. Agrega estas variables:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Aplica a: **Production**, **Preview**, **Development**
4. Haz clic en **"Save"**

### Paso 4: Deploy

1. Haz clic en **"Deploy"**
2. Espera 2-3 minutos
3. ¡Tu aplicación estará en línea! 🎉

URL de ejemplo: `https://finanzas-app-kylver21.vercel.app`

### Redeploys Automáticos

Cada vez que hagas `git push` a tu repositorio, Vercel automáticamente:
- ✅ Detecta cambios
- ✅ Ejecuta el build
- ✅ Despliega la nueva versión

---

## 6. Pruebas Locales

### Probar Autenticación

1. **Registro**:
   - Abre la aplicación
   - Haz clic en "Registrarse"
   - Completa: nombre, email, contraseña
   - Haz clic en "Crear Cuenta"

2. **Verificar Email** (si está habilitado):
   - Revisa tu bandeja de entrada
   - Haz clic en el link de confirmación
   - Vuelve a la aplicación

3. **Iniciar Sesión**:
   - Usa tu email y contraseña
   - Haz clic en "Comenzar"

4. **Verificar Categorías**:
   - Ve a la página "Categorías"
   - Deberías ver categorías por defecto creadas automáticamente

### Probar Funcionalidades

1. ✅ **Crear Ingreso**: Dashboard → Agregar Ingreso
2. ✅ **Crear Gasto**: Dashboard → Agregar Gasto
3. ✅ **Ver Reportes**: Navega a "Reportes"
4. ✅ **Alertas**: Crea un gasto fijo y verifica que sugiera crear alerta
5. ✅ **Cerrar Sesión**: Clic en tu nombre → Cerrar Sesión

---

## 🐛 Solución de Problemas

### Error: "Invalid JWT"

**Causa**: Las credenciales de Supabase son incorrectas

**Solución**:
1. Verifica que copiaste correctamente `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
2. Asegúrate que no haya espacios extras
3. Reinicia el servidor: `npm run dev`

### Error: "Failed to fetch"

**Causa**: RLS (Row Level Security) no está configurado

**Solución**:
1. Ve a Supabase → SQL Editor
2. Ejecuta nuevamente: `supabase/migrations/20251103000000_add_auth_rls.sql`
3. Verifica que las políticas existan en Authentication → Policies

### No se crean categorías automáticamente

**Causa**: El trigger no se ejecutó correctamente

**Solución**:
1. Elimina tu cuenta de prueba en Supabase (Authentication → Users)
2. Vuelve a ejecutar la migración `20251103000000_add_auth_rls.sql`
3. Regístrate nuevamente

### Error de CORS en producción

**Causa**: URL del sitio no está permitida

**Solución**:
1. Ve a Supabase → Settings → API
2. En "Site URL", agrega tu URL de Vercel
3. En "Redirect URLs", agrega: `https://tu-app.vercel.app/**`

---

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Vercel](https://vercel.com/docs)
- [Tutorial de Supabase Auth](https://supabase.com/docs/guides/auth)
- [Guía de RLS](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎉 ¡Listo!

Si seguiste todos los pasos, tu aplicación **FinanceFlow** debería estar:
- ✅ Con autenticación funcionando
- ✅ Datos separados por usuario
- ✅ Desplegada en Vercel
- ✅ Lista para usar

**¡Disfruta de tu aplicación de finanzas personales!** 💰✨
