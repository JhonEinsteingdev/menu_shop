#!/bin/bash

# Script para inicializar el repositorio Git y hacer el primer commit

echo "🚀 Inicializando repositorio Git para Mi Cocina..."

# Verificar si ya existe un repositorio Git
if [ -d ".git" ]; then
    echo "⚠️  Ya existe un repositorio Git. ¿Quieres continuar? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Operación cancelada."
        exit 1
    fi
fi

# Inicializar repositorio Git
echo "📁 Inicializando repositorio Git..."
git init

# Agregar todos los archivos
echo "📦 Agregando archivos al staging area..."
git add .

# Hacer el primer commit
echo "💾 Haciendo el primer commit..."
git commit -m "feat: inicializar proyecto Mi Cocina - PWA de gestión de recetas

- 🍳 Aplicación PWA completa con Next.js 15
- 📝 Gestión de recetas con validaciones
- 🛒 Lista de compras inteligente con categorías
- 📅 Planificador de menús con cálculo automático
- 💾 Almacenamiento local con LocalForage
- 📱 Funcionamiento offline como PWA
- 🔔 Notificaciones con Sonner
- 🎨 UI moderna con Radix UI y Tailwind CSS
- 📋 Documentación completa con README
- 🤝 Templates para contribuciones
- 🔧 CI/CD con GitHub Actions
- 📄 Licencia MIT y código de conducta"

echo "✅ Repositorio inicializado exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Crear un repositorio en GitHub"
echo "2. Agregar el remote: git remote add origin https://github.com/tu-usuario/recipe-shopping-app.git"
echo "3. Subir los cambios: git push -u origin main"
echo ""
echo "🎉 ¡Tu proyecto está listo para ser subido a GitHub!"
