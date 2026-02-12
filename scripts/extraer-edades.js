/**
 * Script para extraer edades de todos los candidatos desde candidatos-detalle.ts
 * 
 * Genera un CSV con: slug, nombre, fecha_nacimiento, edad
 */

const fs = require('fs');
const path = require('path');

// Función para calcular edad desde fecha de nacimiento
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Leer el archivo candidatos-detalle.ts
const detailFile = path.join(__dirname, '..', 'src', 'data', 'candidatos-detalle.ts');
const content = fs.readFileSync(detailFile, 'utf-8');

// Extraer todos los objetos de candidatos usando regex
// Buscar patrones como: "slug": { key: "slug", name: "...", birthDate: "YYYY-MM-DD", ... }
const candidatePattern = /"([a-z-]+)":\s*\{[^}]*?key:\s*"[^"]+"[^}]*?name:\s*"([^"]+)"[^}]*?birthDate:\s*"([^"]+)"[^}]*?\}/gs;

const candidatos = [];
let match;

while ((match = candidatePattern.exec(content)) !== null) {
  const slug = match[1];
  const name = match[2];
  const birthDate = match[3];
  
  // Validar que la fecha tenga formato YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    const age = calculateAge(birthDate);
    candidatos.push({
      slug,
      nombre: name,
      fecha_nacimiento: birthDate,
      edad: age
    });
  }
}

// Ordenar por slug
candidatos.sort((a, b) => a.slug.localeCompare(b.slug));

// Crear directorio de salida si no existe
const outputDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generar CSV
const csvHeader = 'slug,nombre,fecha_nacimiento,edad\n';
const csvRows = candidatos.map(c => 
  `"${c.slug}","${c.nombre}","${c.fecha_nacimiento}",${c.edad}`
).join('\n');

const csvContent = csvHeader + csvRows;
const csvPath = path.join(outputDir, 'candidatos_edades.csv');
fs.writeFileSync(csvPath, csvContent, 'utf-8');

// Generar JSON también
const jsonPath = path.join(outputDir, 'candidatos_edades.json');
fs.writeFileSync(jsonPath, JSON.stringify(candidatos, null, 2), 'utf-8');

console.log(`✓ Edades extraídas: ${candidatos.length} candidatos`);
console.log(`✓ CSV guardado en: ${csvPath}`);
console.log(`✓ JSON guardado en: ${jsonPath}`);

// Mostrar estadísticas
const edades = candidatos.map(c => c.edad);
const promedio = (edades.reduce((a, b) => a + b, 0) / edades.length).toFixed(1);
const min = Math.min(...edades);
const max = Math.max(...edades);

console.log('\nEstadísticas de edades:');
console.log(`  Promedio: ${promedio} años`);
console.log(`  Mínima: ${min} años`);
console.log(`  Máxima: ${max} años`);


