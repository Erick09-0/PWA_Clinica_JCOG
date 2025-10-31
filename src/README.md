# 🏥 Sistema de Inventario Médico - Clínica Juan Carlos Ojeda Gallardo

PWA (Aplicación Web Progresiva) para el control y gestión de inventarios médicos de la Clínica Juan Carlos Ojeda Gallardo.

## 🚀 Características

- ✨ Diseño minimalista Apple-like con efecto Liquid Glass (glassmorphism)
- 🌓 Modo oscuro/claro con toggle animado
- 📱 Totalmente responsivo (móvil, tablet, PC, TV)
- 🎨 Animaciones suaves con Motion (Framer Motion)
- 💾 PWA instalable en cualquier dispositivo
- 🔵 Predominancia del color azul según especificaciones del cliente
- 📊 Dashboard completo con gráficas y análisis
- 🔔 Sistema de alertas y notificaciones
- 📈 Reportes y análisis de inventario

## 🛠️ Tecnologías

- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos y diseño
- **Motion (Framer Motion)** - Animaciones
- **Vite** - Build tool y dev server
- **Recharts** - Gráficas y visualizaciones
- **Lucide React** - Iconos
- **Radix UI** - Componentes UI accesibles
- **Vite PWA Plugin** - Configuración PWA

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm, yarn o pnpm

## 🔧 Instalación

1. **Clona o descarga el repositorio**

2. **Instala las dependencias**

\`\`\`bash
npm install
# o
yarn install
# o
pnpm install
\`\`\`

## 🚀 Uso

### Modo Desarrollo

\`\`\`bash
npm run dev
# o
yarn dev
# o
pnpm dev
\`\`\`

La aplicación estará disponible en `http://localhost:5173`

### Build para Producción

\`\`\`bash
npm run build
# o
yarn build
# o
pnpm build
\`\`\`

### Preview del Build de Producción

\`\`\`bash
npm run preview
# o
yarn preview
# o
pnpm preview
\`\`\`

## 📱 PWA - Instalación en Dispositivos

Una vez que la aplicación esté corriendo:

### En Escritorio (Chrome, Edge, Brave)
1. Abre la aplicación en el navegador
2. Busca el ícono de instalación (➕) en la barra de direcciones
3. Haz clic en "Instalar" o presiona Ctrl+Shift+A (Windows/Linux) o Cmd+Shift+A (Mac)

### En Android
1. Abre la aplicación en Chrome
2. Toca el menú (⋮) > "Agregar a pantalla de inicio"

### En iOS
1. Abre la aplicación en Safari
2. Toca el botón de compartir (⬆️)
3. Selecciona "Agregar a pantalla de inicio"

## 📂 Estructura del Proyecto

\`\`\`
/
├── components/          # Componentes React
│   ├── sections/       # Secciones principales
│   ├── ui/            # Componentes UI (shadcn)
│   └── figma/         # Utilidades
├── contexts/           # Context API (ThemeContext)
├── styles/            # Estilos globales CSS
├── App.tsx            # Componente principal
├── main.tsx           # Entry point
└── vite.config.ts     # Configuración de Vite y PWA
\`\`\`

## 🎨 Secciones Principales

- **Dashboard** - Vista general con estadísticas y gráficas
- **Inventario** - Gestión completa del inventario médico
- **Alertas** - Notificaciones de stock bajo, vencimientos, etc.
- **Análisis** - Gráficas y análisis detallados
- **Reportes** - Generación y descarga de reportes
- **Configuración** - Ajustes del sistema
- **Ayuda** - Documentación y soporte

## 🎨 Sistema de Diseño

- **Tipografía**: Inter (Google Fonts)
- **Colores principales**: Azul (#3b82f6 y variantes)
- **Efectos**: Glassmorphism con blur intenso
- **Animaciones**: Transiciones suaves con easing curves
- **Responsive**: Mobile-first con breakpoints optimizados

## 🔐 Notas de Seguridad

Este es un prototipo/demo. Para producción:
- Implementar autenticación real
- Conectar a un backend seguro
- Encriptar datos sensibles
- Implementar validaciones del lado del servidor

## 👨‍💻 Desarrollo

### Variables de Entorno

Crea un archivo `.env.local` para variables de entorno:

\`\`\`env
VITE_API_URL=tu_api_url_aqui
\`\`\`

### Linting

\`\`\`bash
npm run lint
\`\`\`

## 📄 Licencia

Este proyecto es propiedad de la Clínica Juan Carlos Ojeda Gallardo.

## 👥 Soporte

Para soporte y consultas, contacta al equipo de desarrollo.

---

Desarrollado con ❤️ para la Clínica Juan Carlos Ojeda Gallardo
