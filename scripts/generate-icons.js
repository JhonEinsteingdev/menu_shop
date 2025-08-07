const fs = require('fs');
const path = require('path');

// Función para crear un icono PNG básico usando canvas
function createIcon(size) {
  const canvas = require('canvas');
  const c = canvas.createCanvas(size, size);
  const ctx = c.getContext('2d');

  // Fondo naranja
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(0, 0, size, size);

  // Círculo blanco
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/3, 0, 2 * Math.PI);
  ctx.fill();

  // Círculo interior naranja
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/6, 0, 2 * Math.PI);
  ctx.fill();

  return c.toBuffer('image/png');
}

// Generar iconos
const sizes = [192, 512];

sizes.forEach(size => {
  const icon = createIcon(size);
  const filename = `icon-${size}x${size}.png`;
  fs.writeFileSync(path.join(__dirname, '../public', filename), icon);
  console.log(`Generated ${filename}`);
});
