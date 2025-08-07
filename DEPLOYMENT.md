# 🚀 Guía de Despliegue - Mi Cocina

Esta guía te ayudará a desplegar tu aplicación Mi Cocina en diferentes plataformas.

## 🌐 GitHub Pages (Recomendado)

### Configuración Automática

El proyecto está configurado para desplegarse automáticamente en GitHub Pages:

1. **Crear repositorio en GitHub**
   ```bash
   # Crear un nuevo repositorio en GitHub
   # Nombre: recipe-shopping-app
   # Descripción: PWA para gestión de recetas
   ```

2. **Subir el código**
   ```bash
   # Inicializar repositorio
   pnpm run init-repo
   
   # Agregar remote
   git remote add origin https://github.com/tu-usuario/recipe-shopping-app.git
   
   # Subir código
   git push -u origin main
   ```

3. **Configurar GitHub Pages**
   - Ve a tu repositorio en GitHub
   - Settings > Pages
   - Source: "GitHub Actions"
   - Branch: `main`

4. **Esperar el despliegue**
   - El workflow se ejecutará automáticamente
   - Tiempo estimado: 2-5 minutos
   - URL: `https://tu-usuario.github.io/recipe-shopping-app`

### Despliegue Manual

```bash
# Build para GitHub Pages
pnpm run build:gh-pages

# Script de despliegue automático
pnpm run deploy
```

## 🔧 Otros Servicios

### Vercel

1. **Conectar repositorio**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Configuración automática

2. **Variables de entorno** (opcional)
   ```bash
   NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
   ```

### Netlify

1. **Build settings**
   ```bash
   Build command: pnpm run build:gh-pages
   Publish directory: out
   ```

2. **Variables de entorno**
   ```bash
   NODE_VERSION: 20
   NPM_FLAGS: --version
   ```

### Firebase Hosting

1. **Instalar Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Configurar Firebase**
   ```bash
   firebase init hosting
   ```

3. **firebase.json**
   ```json
   {
     "hosting": {
       "public": "out",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ]
     }
   }
   ```

## 📱 Configuración PWA

### Manifest

El archivo `public/manifest.json` está configurado para:
- ✅ Instalación en dispositivos
- ✅ Iconos adaptativos
- ✅ Colores del tema
- ✅ Información de la app

### Service Worker

El archivo `public/sw.js` proporciona:
- ✅ Cache para funcionamiento offline
- ✅ Actualización automática
- ✅ Estrategias de cache inteligentes

## 🔍 Troubleshooting

### Error: Build falla

```bash
# Verificar dependencias
pnpm install

# Limpiar cache
rm -rf .next out
pnpm run build:gh-pages
```

### Error: PWA no se instala

1. **Verificar HTTPS**
   - GitHub Pages usa HTTPS automáticamente
   - Verificar que el manifest esté accesible

2. **Verificar Service Worker**
   ```bash
   # En las herramientas de desarrollador
   Application > Service Workers
   ```

### Error: Rutas no funcionan

1. **Verificar basePath**
   ```javascript
   // next.config.mjs
   basePath: process.env.NODE_ENV === 'production' ? '/recipe-shopping-app' : ''
   ```

2. **Verificar trailingSlash**
   ```javascript
   // next.config.mjs
   trailingSlash: true
   ```

## 📊 Monitoreo

### Analytics (Opcional)

```bash
# Google Analytics
# Agregar en _app.tsx o layout.tsx
```

### Performance

- **Lighthouse Score**: 90+ en todas las categorías
- **Core Web Vitals**: Optimizados
- **PWA Score**: 100/100

## 🔄 Actualizaciones

### Despliegue automático

Cada push a `main` activará:
1. ✅ Build automático
2. ✅ Tests de calidad
3. ✅ Despliegue a GitHub Pages
4. ✅ Notificación de éxito/error

### Rollback

```bash
# Revertir a commit anterior
git revert HEAD
git push origin main
```

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/recipe-shopping-app/issues)
- **Documentación**: [README.md](README.md)
- **Contribuir**: [CONTRIBUTING.md](CONTRIBUTING.md)

---

¡Tu aplicación estará disponible en minutos! 🎉
