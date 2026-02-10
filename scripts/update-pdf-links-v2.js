const fs = require('fs');
const path = require('path');

// Leer el mapeo de PDFs
const pdfMapping = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'pdf-mapping.json'), 'utf8')
);

// Leer el archivo candidatos-detalle.ts
const detailFile = path.join(__dirname, '..', 'src', 'data', 'candidatos-detalle.ts');
let content = fs.readFileSync(detailFile, 'utf8');

// Actualizar cada candidato - buscar y reemplazar solo los campos planGobiernoUrl y hojaVidaUrl
Object.entries(pdfMapping).forEach(([key, urls]) => {
  // Buscar el bloque del candidato completo
  const candidateStartPattern = new RegExp(`("${key}"\\s*:\\s*\\{)`, 'g');
  const candidateEndPattern = new RegExp(`(\\},\\s*)(?="[a-z-]+"\\s*:|\\})`, 'g');
  
  // Encontrar la posición del candidato
  const startMatch = content.match(new RegExp(`"${key}"\\s*:\\s*\\{`));
  if (!startMatch) {
    console.log(`⚠ No se encontró el candidato: ${key}`);
    return;
  }

  // Buscar y reemplazar planGobiernoUrl
  if (urls.planGobiernoUrl) {
    const planPattern = new RegExp(
      `("${key}"[^}]*?)planGobiernoUrl:\\s*"[^"]*"`,
      'g'
    );
    content = content.replace(
      planPattern,
      `$1planGobiernoUrl: "${urls.planGobiernoUrl}"`
    );
  }

  // Buscar y reemplazar hojaVidaUrl
  if (urls.hojaVidaUrl) {
    const hojaPattern = new RegExp(
      `("${key}"[^}]*?)hojaVidaUrl:\\s*"[^"]*"`,
      'g'
    );
    content = content.replace(
      hojaPattern,
      `$1hojaVidaUrl: "${urls.hojaVidaUrl}"`
    );
  }

  console.log(`✓ Actualizado: ${key}`);
});

// Guardar el archivo actualizado
fs.writeFileSync(detailFile, content, 'utf8');
console.log('\n✓ Archivo candidatos-detalle.ts actualizado correctamente');

