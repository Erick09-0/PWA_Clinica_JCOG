# 📦 Guía de Instalación y Ejecución Local

## ⚡ Inicio Rápido

### 1️⃣ Descargar el Proyecto

Tienes el proyecto completo con todos los archivos necesarios.

### 2️⃣ Instalar Node.js

Si aún no tienes Node.js instalado:

**Windows/Mac:**
- Descarga desde: https://nodejs.org/
- Instala la versión LTS (recomendada)
- Verifica la instalación:
  ```bash
  node --version
  npm --version
  ```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3️⃣ Instalar Dependencias

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

⏱️ Esto tardará 2-5 minutos dependiendo de tu conexión.

### 4️⃣ Ejecutar en Modo Desarrollo

```bash
npm run dev
```

✅ La aplicación estará disponible en: **http://localhost:5173**

### 5️⃣ Crear Build de Producción (Opcional)

Para generar los archivos optimizados para producción:

```bash
npm run build
```

Los archivos se generarán en la carpeta `/dist`

Para previsualizar el build:

```bash
npm run preview
```

---

## 🔧 Solución de Problemas Comunes

### Error: "Cannot find module"
```bash
# Elimina node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Puerto 5173 ya en uso
```bash
# La aplicación se abrirá automáticamente en el siguiente puerto disponible (5174, 5175, etc.)
# O puedes especificar un puerto diferente:
npm run dev -- --port 3000
```

### Error de TypeScript
```bash
# Limpia la caché de TypeScript
rm -rf node_modules/.cache
npm run dev
```

### Error con Motion/Framer Motion
Si ves errores relacionados con motion:
```bash
npm install motion@latest
```

---

## 📱 Instalar como PWA

### En tu computadora:
1. Abre Chrome, Edge o Brave
2. Ve a `http://localhost:5173`
3. Haz clic en el ícono ➕ en la barra de direcciones
4. Selecciona "Instalar"

### En tu celular:
1. Abre la app desde Chrome en `http://TU-IP-LOCAL:5173`
   - Para encontrar tu IP local:
     - Windows: `ipconfig` (busca IPv4)
     - Mac/Linux: `ifconfig` o `ip addr`
2. En Android: Menu (⋮) > "Agregar a pantalla de inicio"
3. En iOS: Botón compartir (⬆️) > "Agregar a pantalla de inicio"

---

## 🎯 Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Crea build de producción |
| `npm run preview` | Previsualiza build de producción |
| `npm run lint` | Verifica errores de código |

---

## 📂 Estructura de Archivos Importantes

```
/
├── index.html              # HTML principal
├── main.tsx                # Punto de entrada React
├── App.tsx                 # Componente principal
├── package.json            # Dependencias del proyecto
├── vite.config.ts          # Configuración de Vite + PWA
├── tsconfig.json           # Configuración TypeScript
├── components/             # Todos los componentes React
├── styles/globals.css      # Estilos globales
└── public/                 # Archivos públicos (manifest, icons)
```

---

## 🌐 Desplegar en Producción

### Opciones Gratuitas Recomendadas:

**1. Vercel (Recomendado)**
```bash
npm install -g vercel
vercel login
vercel
```

**2. Netlify**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

**3. GitHub Pages**
- Sube el código a GitHub
- Ve a Settings > Pages
- Selecciona la rama y carpeta `/dist`

---

## ⚙️ Variables de Entorno (Opcional)

Si necesitas configurar APIs externas, crea un archivo `.env.local`:

```env
VITE_API_URL=https://tu-api.com
VITE_API_KEY=tu_clave_aqui
```

Luego úsalas en el código:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 💡 Tips Pro

1. **Hot Module Replacement (HMR)**: Los cambios se reflejan automáticamente sin recargar
2. **DevTools React**: Instala la extensión React Developer Tools para Chrome/Firefox
3. **Modo Oscuro**: El sistema detecta automáticamente las preferencias del usuario
4. **Responsive Testing**: Usa F12 > Device Toolbar para probar en diferentes dispositivos

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:
1. Verifica que Node.js esté instalado: `node --version`
2. Asegúrate de estar en la carpeta correcta del proyecto
3. Revisa la consola del navegador (F12) para errores
4. Verifica que el puerto 5173 no esté ocupado

---

## 📞 Soporte

Para dudas técnicas o problemas de instalación, contacta al equipo de desarrollo.

---

**¡Listo! 🎉 Ya puedes empezar a usar tu sistema de inventario médico.**
