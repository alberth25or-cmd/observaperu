/**
 * Script para extraer lugares de nacimiento de candidatos.
 * 
 * Metodología combinada:
 * 1. Extraer de biografías en candidatos-detalle.ts
 * 2. Extraer de PDFs de hojas de vida (opcional)
 */

const fs = require('fs');
const path = require('path');

// Función para extraer lugar de nacimiento de biografía
function extractFromBiografia(biografia) {
  if (!biografia) return null;
  
  // Normalizar: quitar escapes y espacios múltiples
  let texto = biografia.replace(/\\"/g, '"').replace(/\\n/g, ' ').replace(/\s+/g, ' ');
  const textLower = texto.toLowerCase();
  
  // Patrón 1: "nació el [fecha] en [lugar]" - más flexible
  // Ejemplo: "nació el 17 de julio de 1950 en la ciudad de Lima"
  let match = textLower.match(/naci[óo]da?\s+el\s+[^,]+?\s+en\s+(?:la\s+)?(?:ciudad\s+de\s+|distrito\s+de\s+|provincia\s+de\s+)?([^.,]+?)(?:\.|,|$)/);
  if (match && match[1]) {
    let lugar = match[1].trim();
    // Filtrar si contiene año de 4 dígitos
    if (!/\b\d{4}\b/.test(lugar) && lugar.length > 2) {
      return capitalizeWords(lugar);
    }
  }
  
  // Patrón 2: "nació en [lugar]" (sin fecha)
  // Ejemplo: "Nacida en Lima"
  match = textLower.match(/naci[óo]da?\s+en\s+(?:la\s+)?(?:ciudad\s+de\s+|distrito\s+de\s+|provincia\s+de\s+)?([^.,]+?)(?:\.|,|$)/);
  if (match && match[1]) {
    let lugar = match[1].trim();
    if (!/\b\d{4}\b/.test(lugar) && lugar.length > 2) {
      return capitalizeWords(lugar);
    }
  }
  
  // Patrón 3: "nació en [lugar], [departamento]"
  match = textLower.match(/naci[óo]da?\s+en\s+([^,]+?),\s*(?:departamento\s+de\s+)?([^.,]+?)(?:\.|$)/);
  if (match && match[1] && match[2]) {
    let lugar1 = match[1].trim();
    let lugar2 = match[2].trim();
    if (!/\b\d{4}\b/.test(lugar1) && !/\b\d{4}\b/.test(lugar2)) {
      return `${capitalizeWords(lugar1)}, ${capitalizeWords(lugar2)}`;
    }
  }
  
  // Patrón 4: "nació el [fecha] en el distrito de X, provincia de Y, departamento de Z"
  match = textLower.match(/naci[óo]da?\s+el\s+[^,]+?\s+en\s+el\s+distrito\s+de\s+([^,]+?)(?:,\s+provincia\s+de\s+([^,]+?))?(?:,\s+departamento\s+de\s+([^.,]+?))?(?:\.|$)/);
  if (match && match[1]) {
    const partes = [match[1].trim()];
    if (match[2]) partes.push(match[2].trim());
    if (match[3]) partes.push(match[3].trim());
    const lugar = partes.map(p => capitalizeWords(p)).join(', ');
    if (lugar.length > 3) {
      return lugar;
    }
  }
  
  return null;
}

// Función auxiliar para capitalizar palabras
function capitalizeWords(text) {
  return text.split(' ').map(w => {
    if (w.length === 0) return w;
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ');
}

// Leer el archivo candidatos-detalle.ts
const detailFile = path.join(__dirname, '..', 'src', 'data', 'candidatos-detalle.ts');
const content = fs.readFileSync(detailFile, 'utf-8');

// Lista de candidatos
const candidatosSlugs = [
  "alex-gonzalez-castillo",
  "alfonso-lopez-chau-nava",
  "alvaro-gonzalo-paz-de-la-barra-freigeiro",
  "antonio-ortiz-villano",
  "armando-joaquin-masse-fernandez",
  "carlos-ernesto-jaico-carranza",
  "carlos-espa-y-garces-alvear",
  "carlos-gonzalo-alvarez-loayza",
  "cesar-acuna-peralta",
  "charlie-carrasco-salazar",
  "fiorella-giannina-molinelli-aristondo",
  "francisco-ernesto-diez-canseco-tavara",
  "george-patrick-forsyth-sommer",
  "herbert-caller-gutierrez",
  "jose-leon-luna-galvez",
  "jose-williams-zapata",
  "jorge-nieto-montesinos",
  "keiko-sofia-fujimori-higuchi",
  "luis-fernando-olivera-vega",
  "mario-enrique-vizcarra-cornejo",
  "maria-soledad-perez-tello-de-rodriguez",
  "mesias-antonio-guevara-amasifuen",
  "napoleon-becerra-garcia",
  "paul-davis-jaimes-blanco",
  "pitter-enrique-valderrama-pena",
  "rafael-bernardo-lopez-aliaga",
  "rafael-jorge-belaunde-llosa",
  "ricardo-pablo-belmont-cassinelli",
  "roberto-enrique-chiabra-leon",
  "roberto-helbert-sanchez-palomino",
  "ronald-darwin-atencio-sotomayor",
  "rosario-del-pilar-fernandez-bazan",
  "vladimir-roy-cerron-rojas",
  "walter-gilmer-chirinos-purizaga",
  "wolfgang-mario-grozo-costa",
  "yonhy-lescano-ancieta",
];

const resultados = [];

for (const slug of candidatosSlugs) {
  // Buscar el objeto del candidato - patrón más flexible
  const candidatePattern = new RegExp(
    `"${slug.replace(/-/g, '\\-')}"\\s*:\\s*\\{[\\s\\S]*?name:\\s*"([^"]+)"[\\s\\S]*?biografia:\\s*"((?:[^"\\\\]|\\\\.)+)"`,
    's'
  );
  
  const match = content.match(candidatePattern);
  
  if (match) {
    const nombre = match[1];
    let biografia = match[2];
    
    // Limpiar escapes de JavaScript/TypeScript
    biografia = biografia
      .replace(/\\"/g, '"')
      .replace(/\\n/g, ' ')
      .replace(/\\t/g, ' ')
      .replace(/\\\\/g, '\\')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Extraer lugar de nacimiento
    const lugar = extractFromBiografia(biografia);
    
    resultados.push({
      slug,
      nombre,
      lugar_nacimiento: lugar || 'No encontrado',
      fuente: lugar ? 'biografia' : 'no_encontrado'
    });
  } else {
    resultados.push({
      slug,
      nombre: slug,
      lugar_nacimiento: 'No encontrado',
      fuente: 'no_encontrado'
    });
  }
}

// Ordenar por slug
resultados.sort((a, b) => a.slug.localeCompare(b.slug));

// Guardar resultados
const outputDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// CSV
const csvHeader = 'slug,nombre,lugar_nacimiento,fuente\n';
const csvRows = resultados.map(r => 
  `"${r.slug}","${r.nombre}","${r.lugar_nacimiento}","${r.fuente}"`
).join('\n');
const csvContent = csvHeader + csvRows;
const csvPath = path.join(outputDir, 'candidatos_lugares_nacimiento.csv');
fs.writeFileSync(csvPath, csvContent, 'utf-8');

// JSON
const jsonPath = path.join(outputDir, 'candidatos_lugares_nacimiento.json');
fs.writeFileSync(jsonPath, JSON.stringify(resultados, null, 2), 'utf-8');

// Estadísticas
const encontrados = resultados.filter(r => r.lugar_nacimiento !== 'No encontrado').length;
const porFuente = {};
resultados.forEach(r => {
  porFuente[r.fuente] = (porFuente[r.fuente] || 0) + 1;
});

console.log(`✓ Lugares extraidos: ${encontrados}/${resultados.length}`);
console.log(`✓ CSV guardado en: ${csvPath}`);
console.log(`✓ JSON guardado en: ${jsonPath}`);
console.log('\nPor fuente:');
Object.entries(porFuente).forEach(([fuente, count]) => {
  console.log(`  ${fuente}: ${count}`);
});

