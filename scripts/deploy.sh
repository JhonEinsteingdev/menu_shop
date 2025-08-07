#!/bin/bash

# Script para desplegar a GitHub Pages

echo "🚀 Preparando despliegue a GitHub Pages..."

# Verificar que estamos en la rama main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Estás en la rama '$CURRENT_BRANCH'. Se recomienda estar en 'main' para el despliegue."
    read -p "¿Continuar de todas formas? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Despliegue cancelado."
        exit 1
    fi
fi

# Verificar que no hay cambios sin commitear
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Hay cambios sin commitear. ¿Quieres hacer commit antes del despliegue? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "📝 Haciendo commit de cambios..."
        git add .
        git commit -m "feat: actualizar antes del despliegue"
    else
        echo "❌ Despliegue cancelado. Haz commit de tus cambios primero."
        exit 1
    fi
fi

# Build para producción
echo "🔨 Construyendo para producción..."
pnpm run build:gh-pages

# Verificar que el build fue exitoso
if [ $? -ne 0 ]; then
    echo "❌ Error en el build. Revisa los errores arriba."
    exit 1
fi

echo "✅ Build completado exitosamente!"

# Crear archivo .nojekyll si no existe
if [ ! -f "out/.nojekyll" ]; then
    echo "📄 Creando archivo .nojekyll..."
    touch out/.nojekyll
fi

# Subir cambios a GitHub
echo "📤 Subiendo cambios a GitHub..."
git add .
git commit -m "build: actualizar build para GitHub Pages" || true
git push origin main

echo ""
echo "🎉 ¡Despliegue completado!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ve a tu repositorio en GitHub"
echo "2. Settings > Pages"
echo "3. Source: 'GitHub Actions'"
echo "4. Espera a que se complete el workflow"
echo ""
echo "🌐 Tu sitio estará disponible en:"
echo "https://tu-usuario.github.io/recipe-shopping-app"
echo ""
echo "⏱️  El despliegue puede tomar 2-5 minutos."
