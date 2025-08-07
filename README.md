# 🍳 Mi Cocina - Gestor de Recetas PWA

Una aplicación web progresiva (PWA) para gestionar recetas, planificar menús y organizar listas de compras.

## ✨ Características Principales

### 📝 Gestión de Recetas
- **Crear recetas** con nombre, descripción, ingredientes, instrucciones y tiempo de cocción
- **Editar recetas** existentes con interfaz intuitiva
- **Ver recetas** en modo detallado con ingredientes calculados según porciones
- **Categorización** por tipo de comida (Desayuno, Almuerzo, Cena, Postre, Snack)
- **Validación de campos** obligatorios con notificaciones

### 🛒 Lista de Compras Inteligente
- **Categorización automática** de productos (Frutas y Verduras, Carnes, Lácteos, etc.)
- **Validación de duplicados** usando regex para evitar productos repetidos
- **Campos opcionales** para cantidad y precio estimado
- **Validación de precios** en formato colombiano ($15.000)
- **Marcar/desmarcar** productos como completados
- **Botón para desmarcar todos** los productos completados

### 📅 Planificador de Menús
- **Generación aleatoria** de planes de menú (3, 5 o 7 días)
- **Selector de porciones** para cada receta (1-8 personas)
- **Cálculo automático** de ingredientes según el número de personas
- **Resumen de productos** en formato acordeón colapsible
- **Agrupación inteligente** de ingredientes similares

### 🔔 Notificaciones y UX
- **Notificaciones toast** para acciones exitosas y errores
- **AlertDialog personalizado** para productos duplicados
- **Componentes UI modernos** con Select, Accordion, etc.
- **Diseño responsive** optimizado para móviles
- **Validaciones en tiempo real** con mensajes específicos

### 💾 Persistencia de Datos
- **Almacenamiento local** usando LocalForage
- **Sincronización automática** de todos los datos
- **Carga automática** al iniciar la aplicación
- **Backup local** de recetas, listas y planes

### 📱 PWA (Progressive Web App)
- **Instalable** como aplicación nativa
- **Funciona offline** con service worker
- **Iconos personalizados** para diferentes tamaños
- **Manifest completo** con metadatos
- **Experiencia móvil** optimizada

## 🚀 Tecnologías Utilizadas

- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos y diseño
- **Radix UI** - Componentes accesibles
- **LocalForage** - Almacenamiento local
- **Sonner** - Notificaciones toast
- **Lucide React** - Iconos

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd recipe-shopping-app

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

## 🎯 Funcionalidades Detalladas

### Gestión de Recetas
- **Crear**: Formulario completo con validaciones
- **Editar**: Interfaz dedicada con pre-carga de datos
- **Ver**: Vista detallada con ingredientes calculados
- **Categorizar**: Organización por tipo de comida

### Lista de Compras
- **Agregar productos** con categoría, cantidad y precio
- **Validar duplicados** usando expresiones regulares
- **Marcar completados** con interfaz visual
- **Organizar por categorías** con colores distintivos

### Planificador
- **Generar planes** aleatorios de 3, 5 o 7 días
- **Ajustar porciones** para cada receta individualmente
- **Calcular ingredientes** automáticamente según porciones
- **Ver resumen** en acordeón colapsible

### PWA Features
- **Instalación** en dispositivos móviles y desktop
- **Funcionamiento offline** con cache inteligente
- **Iconos adaptativos** para diferentes tamaños
- **Manifest completo** con metadatos

## 🔧 Configuración PWA

La aplicación incluye:
- `public/manifest.json` - Configuración de la PWA
- `public/sw.js` - Service Worker para cache
- `components/pwa-register.tsx` - Registro automático
- Iconos en múltiples tamaños

## 📱 Uso en Dispositivos Móviles

1. **Abrir** la aplicación en el navegador móvil
2. **Instalar** desde el menú del navegador
3. **Usar** como aplicación nativa
4. **Funcionar offline** con datos guardados localmente

## 🎨 Características de Diseño

- **Diseño responsive** para todos los dispositivos
- **Tema naranja** consistente con la marca
- **Componentes modernos** con animaciones suaves
- **Accesibilidad** completa con ARIA labels
- **Navegación intuitiva** con tabs organizadas

## 🔒 Privacidad y Datos

- **Datos locales** - No se envían a servidores externos
- **Almacenamiento seguro** - LocalForage con encriptación
- **Sin tracking** - No se recopilan datos de usuario
- **Control total** - Los usuarios tienen control completo de sus datos

## 🚀 Próximas Características

- [ ] Sincronización en la nube
- [ ] Compartir recetas
- [ ] Modo oscuro
- [ ] Búsqueda avanzada
- [ ] Exportar/importar datos
- [ ] Notificaciones push

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado con ❤️ para hacer la cocina más fácil y organizada.**
