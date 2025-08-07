# 🤝 Contribuir a Mi Cocina

¡Gracias por tu interés en contribuir a Mi Cocina! Este documento te guiará a través del proceso de contribución.

## 📋 Cómo Contribuir

### 1. Fork del Repositorio

1. Ve a [GitHub](https://github.com/tu-usuario/recipe-shopping-app)
2. Haz clic en el botón "Fork" en la esquina superior derecha
3. Clona tu fork localmente:
   ```bash
   git clone https://github.com/tu-usuario/recipe-shopping-app.git
   cd recipe-shopping-app
   ```

### 2. Configurar el Entorno de Desarrollo

1. Instala las dependencias:
   ```bash
   pnpm install
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

### 3. Crear una Rama

Crea una nueva rama para tu feature o fix:

```bash
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b fix/nombre-del-bug
```

### 4. Hacer Cambios

- Escribe código limpio y bien documentado
- Sigue las convenciones de código existentes
- Añade tests si es necesario
- Actualiza la documentación si es relevante

### 5. Commit y Push

```bash
git add .
git commit -m "feat: añadir nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

### 6. Crear un Pull Request

1. Ve a tu fork en GitHub
2. Haz clic en "Compare & pull request"
3. Describe tus cambios claramente
4. Envía el PR

## 🎯 Áreas de Contribución

### 🐛 Reportar Bugs

- Usa el template de issue para bugs
- Incluye pasos para reproducir el bug
- Añade capturas de pantalla si es relevante
- Especifica tu navegador y sistema operativo

### 💡 Sugerir Mejoras

- Usa el template de issue para features
- Describe el problema que resuelve
- Proporciona ejemplos de uso
- Considera la implementación

### 📝 Mejorar Documentación

- Corregir errores en la documentación
- Añadir ejemplos de uso
- Mejorar la claridad del README
- Traducir a otros idiomas

### 🎨 Mejoras de UI/UX

- Mejorar la accesibilidad
- Optimizar para móviles
- Añadir animaciones
- Mejorar la experiencia de usuario

## 📋 Convenciones de Código

### TypeScript/JavaScript

- Usa TypeScript para todo el código nuevo
- Define interfaces para todos los tipos
- Usa nombres descriptivos para variables y funciones
- Comenta código complejo

### CSS/Tailwind

- Usa Tailwind CSS para estilos
- Mantén consistencia en el diseño
- Usa variables CSS para colores y espaciado
- Optimiza para responsive design

### React/Next.js

- Usa componentes funcionales con hooks
- Mantén componentes pequeños y reutilizables
- Usa TypeScript para props
- Sigue las mejores prácticas de Next.js

### Git

- Usa commits semánticos:
  - `feat:` para nuevas funcionalidades
  - `fix:` para correcciones de bugs
  - `docs:` para cambios en documentación
  - `style:` para cambios de formato
  - `refactor:` para refactorización
  - `test:` para añadir tests
  - `chore:` para tareas de mantenimiento

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
pnpm test

# Tests de integración
pnpm test:integration

# Coverage
pnpm test:coverage
```

### Escribir Tests

- Tests para componentes React
- Tests para funciones utilitarias
- Tests para hooks personalizados
- Tests de integración para PWA

## 📦 Estructura del Proyecto

```
recipe-shopping-app/
├── app/                    # Páginas y componentes de Next.js
├── components/             # Componentes reutilizables
│   ├── ui/               # Componentes de UI base
│   └── pwa-register.tsx  # Registro de PWA
├── lib/                   # Utilidades y configuraciones
├── public/                # Archivos estáticos
│   ├── manifest.json     # Configuración PWA
│   ├── sw.js            # Service Worker
│   └── icon-*.png       # Iconos PWA
├── styles/               # Estilos globales
└── scripts/              # Scripts de utilidad
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno

Crea un archivo `.env.local`:

```bash
# Desarrollo
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Mi Cocina
```

### Linting y Formateo

```bash
# Linting
pnpm lint

# Formateo
pnpm format

# Verificar tipos
pnpm type-check
```

## 🚀 Despliegue

### Desarrollo

```bash
pnpm dev
```

### Producción

```bash
pnpm build
pnpm start
```

### PWA

La aplicación se despliega como PWA automáticamente con:
- Service Worker para cache
- Manifest para instalación
- Iconos adaptativos
- Funcionamiento offline

## 📞 Contacto

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/recipe-shopping-app/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/recipe-shopping-app/discussions)
- **Email**: tu-email@ejemplo.com

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la [Licencia MIT](LICENSE).

---

¡Gracias por hacer Mi Cocina mejor! 🍳❤️
