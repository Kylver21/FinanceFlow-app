# 💰 FinanceFlow

**FinanceFlow** es una aplicación moderna de gestión de finanzas personales construida con React, TypeScript y Supabase. Permite a los usuarios llevar un control completo de sus ingresos, gastos, categorías y suscripciones con reportes visuales interactivos.

![FinanceFlow](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Características

- � **Autenticación Segura**: Registro e inicio de sesión con email y contraseña
- 👤 **Datos Privados**: Cada usuario tiene sus propios datos protegidos
- �📊 **Dashboard Interactivo**: Visualiza tus finanzas de un vistazo
- 💵 **Gestión de Ingresos**: Registra ingresos con frecuencia (semanal, quincenal, mensual)
- 💸 **Control de Gastos**: Clasifica gastos como fijos o variables
- 🏷️ **Categorías Personalizadas**: Organiza tus transacciones por categorías
- 📈 **Reportes y Análisis**: Gráficos interactivos con Recharts
- 🔔 **Alertas de Suscripciones**: Notificaciones automáticas de pagos próximos
- 🤖 **Alertas Automáticas**: Sugiere crear alertas desde gastos fijos
- 📱 **Diseño Responsive**: Optimizado para móviles y desktop
- 🎨 **UI Moderna**: Interfaz limpia con Tailwind CSS

## 🚀 Demo

[Ver Demo en Vercel](https://tu-app.vercel.app)

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel

## 📋 Prerequisitos

- Node.js 18+ y npm/yarn
- Cuenta de [Supabase](https://supabase.com/)
- Git

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Kylver21/Finanzas-app.git
cd Finanzas-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

1. Crea un proyecto en [Supabase](https://app.supabase.com/)
2. Habilita **Email Authentication** en Authentication → Providers
3. Ejecuta las migraciones SQL en orden:
   - `supabase/migrations/20251005064451_create_finanzas_schema.sql`
   - `supabase/migrations/20251103000000_add_auth_rls.sql`
4. Copia las credenciales de tu proyecto

**📖 Guía Detallada**: Ver [SETUP_GUIDE.md](./SETUP_GUIDE.md) para instrucciones paso a paso

### 4. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_project_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Build para producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

## 🚀 Deploy en Vercel

### Opción 1: Deploy automático desde GitHub

1. Pushea tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Configura las variables de entorno en Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. ¡Deploy automático! ✨

### Opción 2: Vercel CLI

```bash
npm install -g vercel
vercel
```

## 📊 Estructura del Proyecto

```
finanzas-app/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── layout/       # Navbar, Layout
│   │   └── ui/           # Button, Card, Modal, Input, etc.
│   ├── features/         # Características por módulo
│   │   ├── dashboard/    # Dashboard principal
│   │   ├── ingresos/     # Gestión de ingresos
│   │   ├── gastos/       # Gestión de gastos
│   │   ├── categorias/   # Gestión de categorías
│   │   ├── alertas/      # Sistema de alertas
│   │   └── reportes/     # Reportes y análisis
│   ├── context/          # Context API para estado global
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Páginas principales
│   ├── services/         # Servicios (Supabase)
│   └── utils/            # Utilidades y helpers
├── supabase/
│   └── migrations/       # Scripts SQL
└── public/               # Archivos estáticos
```

## 🗃️ Modelo de Datos

### Categorías
- Tipo: ingreso o gasto
- Personalizable con iconos y colores

### Ingresos
- Descripción, monto, fecha
- Frecuencia: semanal, quincenal, mensual
- Relación con categoría

### Gastos
- Descripción, monto, fecha
- Tipo: fijo o variable
- Método de pago
- Relación con categoría

### Alertas
- Nombre de suscripción
- Monto y día de cobro
- Estado activo/inactivo

## 🎨 Paleta de Colores

- **Ingresos**: Emerald (Verde) - `#059669`
- **Gastos**: Red (Rojo) - `#dc2626`
- **Balance**: Blue (Azul) - `#2563eb`
- **Ahorro**: Purple (Púrpura) - `#9333ea`
- **Gastos Fijos**: Indigo - `#6366f1`
- **Gastos Variables**: Orange - `#f97316`

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linter (ESLint)
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👤 Autor

**Kylver21**

- GitHub: [@Kylver21](https://github.com/Kylver21)
- Proyecto: [FinanceFlow](https://github.com/Kylver21/Finanzas-app)

## 🙏 Agradecimientos

- [Supabase](https://supabase.com/) - Backend as a Service
- [Recharts](https://recharts.org/) - Librería de gráficos
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Lucide Icons](https://lucide.dev/) - Iconos

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
