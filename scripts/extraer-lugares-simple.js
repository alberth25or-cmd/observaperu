/**
 * Script simplificado para extraer lugares de nacimiento.
 * Busca directamente en el texto sin regex complejos.
 */

const fs = require('fs');
const path = require('path');

const detailFile = path.join(__dirname, '..', 'src', 'data', 'candidatos-detalle.ts');
const content = fs.readFileSync(detailFile, 'utf-8');

const candidatosSlugs = [
  "alex-gonzalez-castillo", "alfonso-lopez-chau-nava", "alvaro-gonzalo-paz-de-la-barra-freigeiro",
  "antonio-ortiz-villano", "armando-joaquin-masse-fernandez", "carlos-ernesto-jaico-carranza",
  "carlos-espa-y-garces-alvear", "carlos-gonzalo-alvarez-loayza", "cesar-acuna-peralta",
  "charlie-carrasco-salazar", "fiorella-giannina-molinelli-aristondo", "francisco-ernesto-diez-canseco-tavara",
  "george-patrick-forsyth-sommer", "herbert-caller-gutierrez", "jose-leon-luna-galvez",
  "jose-williams-zapata", "jorge-nieto-montesinos", "keiko-sofia-fujimori-higuchi",
  "luis-fernando-olivera-vega", "mario-enrique-vizcarra-cornejo", "maria-soledad-perez-tello-de-rodriguez",
  "mesias-antonio-guevara-amasifuen", "napoleon-becerra-garcia", "paul-davis-jaimes-blanco",
  "pitter-enrique-valderrama-pena", "rafael-bernardo-lopez-aliaga", "rafael-jorge-belaunde-llosa",
  "ricardo-pablo-belmont-cassinelli", "roberto-enrique-chiabra-leon", "roberto-helbert-sanchez-palomino",
  "ronald-darwin-atencio-sotomayor", "rosario-del-pilar-fernandez-bazan", "vladimir-roy-cerron-rojas",
  "walter-gilmer-chirinos-purizaga", "wolfgang-mario-grozo-costa", "yonhy-lescano-ancieta",
];

function extractLugar(biografia) {
  if (!biografia) return null;
  
  // Normalizar espacios
  const texto = biografia.replace(/\s+/g, ' ').trim();
  const lower = texto.toLowerCase();
  
  // Buscar "nació" o "nacido/nacida" seguido de "en"
  // Patrón más flexible: puede tener "el [fecha]" antes o después de "en"
  const patterns = [
    // Patrón 1: "nació el [fecha] en [lugar]"
    /naci[óo]da?\s+el\s+[^,]+?\s+en\s+(?:la\s+)?(?:ciudad\s+de\s+|distrito\s+de\s+|provincia\s+de\s+)?([^.,]+?)(?:\.|,|$)/i,
    // Patrón 2: "nació en [lugar] el [fecha]" (fecha después)
    /naci[óo]da?\s+en\s+(?:la\s+)?(?:ciudad\s+de\s+|distrito\s+de\s+|provincia\s+de\s+)?([^.,]+?)\s+el\s+[^.,]+?(?:\.|,|$)/i,
    // Patrón 3: "nació en [lugar]" (sin fecha)
    /naci[óo]da?\s+en\s+(?:la\s+)?(?:ciudad\s+de\s+|distrito\s+de\s+|provincia\s+de\s+)?([^.,]+?)(?:\.|,|$)/i,
  ];
  
  for (const pattern of patterns) {
    const match = lower.match(pattern);
    if (match && match[1]) {
      let lugar = match[1].trim();
      // Filtrar años de 4 dígitos y validar longitud
      // También filtrar palabras comunes que no son lugares
      const palabrasInvalidas = ['con', 'a', 'de', 'el', 'la', 'los', 'las', 'un', 'una', 'y', 'o'];
      const palabras = lugar.split(' ');
      const lugarLimpio = palabras.filter(p => !palabrasInvalidas.includes(p.toLowerCase())).join(' ');
      
      if (!/\b\d{4}\b/.test(lugarLimpio) && lugarLimpio.length > 2 && lugarLimpio.length < 100) {
        // Capitalizar
        return lugarLimpio.split(' ').map(w => {
          if (w.length === 0) return w;
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        }).join(' ');
      }
    }
  }
  
  // Patrón alternativo: buscar directamente "en [lugar]" después de "nació/nacida"
  // Maneja casos como "Nacida en Lima el [fecha]"
  const idxNacio = lower.indexOf('nació');
  const idxNacida = lower.indexOf('nacida');
  const idxNacido = lower.indexOf('nacido');
  
  let idx = -1;
  if (idxNacio !== -1) idx = idxNacio;
  else if (idxNacida !== -1) idx = idxNacida;
  else if (idxNacido !== -1) idx = idxNacido;
  
  if (idx !== -1) {
    const desdeNacimiento = texto.substring(idx);
    // Buscar "en [lugar]" - puede tener fecha antes o después
    const matchEn = desdeNacimiento.match(/en\s+(?:la\s+)?(?:ciudad\s+de\s+|distrito\s+de\s+|provincia\s+de\s+)?([^.,]+?)(?:\s+el\s+[^.,]+?)?(?:\.|,|$)/i);
    if (matchEn && matchEn[1]) {
      let lugar = matchEn[1].trim();
      // Filtrar años y palabras comunes
      if (!/\b\d{4}\b/.test(lugar) && lugar.length > 2 && lugar.length < 100) {
        const palabrasInvalidas = ['con', 'a', 'de', 'el', 'la', 'los', 'las', 'un', 'una', 'y', 'o', 'es'];
        const palabras = lugar.split(' ').filter(p => !palabrasInvalidas.includes(p.toLowerCase()));
        if (palabras.length > 0) {
          lugar = palabras.join(' ');
          return lugar.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        }
      }
    }
  }
  
  return null;
}

const resultados = [];

for (const slug of candidatosSlugs) {
  // Buscar el bloque del candidato
  const startPattern = new RegExp(`"${slug}"\\s*:\\s*\\{`, 's');
  const startMatch = content.match(startPattern);
  
  if (!startMatch) {
    resultados.push({ slug, nombre: slug, lugar_nacimiento: 'No encontrado', fuente: 'no_encontrado' });
    continue;
  }
  
  const startIdx = startMatch.index + startMatch[0].length;
  
  // Buscar el cierre del objeto (siguiente }, que no esté dentro de arrays/objetos anidados)
  let depth = 1;
  let endIdx = startIdx;
  for (let i = startIdx; i < content.length && depth > 0; i++) {
    if (content[i] === '{') depth++;
    if (content[i] === '}') depth--;
    if (depth === 0) {
      endIdx = i;
      break;
    }
  }
  
  const bloque = content.substring(startIdx, endIdx);
  
  // Extraer nombre
  const nameMatch = bloque.match(/name:\s*"([^"]+)"/);
  const nombre = nameMatch ? nameMatch[1] : slug;
  
  // Extraer biografía - patrón más flexible para capturar strings multilínea
  const bioPattern = /biografia:\s*"((?:[^"\\]|\\.|\\n)+)"/;
  const bioMatch = bloque.match(bioPattern);
  
  if (bioMatch) {
    let biografia = bioMatch[1]
      .replace(/\\"/g, '"')
      .replace(/\\n/g, ' ')
      .replace(/\\t/g, ' ')
      .replace(/\\\\/g, '\\')
      .replace(/\s+/g, ' ')
      .trim();
    
    const lugar = extractLugar(biografia);
    
    resultados.push({
      slug,
      nombre,
      lugar_nacimiento: lugar || 'No encontrado',
      fuente: lugar ? 'biografia' : 'no_encontrado'
    });
  } else {
    resultados.push({
      slug,
      nombre,
      lugar_nacimiento: 'No encontrado',
      fuente: 'no_encontrado'
    });
  }
}

// Ordenar y guardar
resultados.sort((a, b) => a.slug.localeCompare(b.slug));

const outputDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// CSV
const csv = 'slug,nombre,lugar_nacimiento,fuente\n' +
  resultados.map(r => `"${r.slug}","${r.nombre}","${r.lugar_nacimiento}","${r.fuente}"`).join('\n');
fs.writeFileSync(path.join(outputDir, 'candidatos_lugares_nacimiento.csv'), csv, 'utf-8');

// JSON
fs.writeFileSync(
  path.join(outputDir, 'candidatos_lugares_nacimiento.json'),
  JSON.stringify(resultados, null, 2),
  'utf-8'
);

const encontrados = resultados.filter(r => r.lugar_nacimiento !== 'No encontrado').length;
console.log(`✓ Lugares extraidos: ${encontrados}/${resultados.length}`);
console.log(`✓ Archivos guardados en: ${outputDir}`);

