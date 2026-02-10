const fs = require('fs');
const path = require('path');

// Mapeo de nombres de carpetas del usuario a keys del proyecto
const nameToKeyMap = {
  'Alex González Castillo': 'alex-gonzalez-castillo',
  'Alfonso López Chau Nava': 'alfonso-lopez-chau-nava',
  'Álvaro Gonzalo Paz de la Barra Freigeiro': 'alvaro-gonzalo-paz-de-la-barra-freigeiro',
  'Antonio Ortiz Villano': 'antonio-ortiz-villano',
  'Armando Joaquín Masse Fernández': 'armando-joaquin-masse-fernandez',
  'Carlos Ernesto Jaico Carranza': 'carlos-ernesto-jaico-carranza',
  'Carlos Espá y Garcés-Alvear': 'carlos-espa-y-garces-alvear',
  'Carlos Gonsalo Álvarez Loayza': 'carlos-gonzalo-alvarez-loayza',
  'César Acuña Peralta': 'cesar-acuna-peralta',
  'Charlie Carrasco Salazar': 'charlie-carrasco-salazar',
  'Fiorella Giannina Molinelli Aristondo': 'fiorella-giannina-molinelli-aristondo',
  'Francisco Ernesto Diez-Canseco Távara': 'francisco-ernesto-diez-canseco-tavara',
  'George Patrick Forsyth Sommer': 'george-patrick-forsyth-sommer',
  'Herbert Caller Gutiérrez': 'herbert-caller-gutierrez',
  'José León Luna Gálvez': 'jose-leon-luna-galvez',
  'José Williams Zapata': 'jose-williams-zapata',
  'Jorge Nieto Montesinos': 'jorge-nieto-montesinos',
  'Keiko Sofía Fujimori Higuchi': 'keiko-sofia-fujimori-higuchi',
  'Luis Fernando Olivera Vega': 'luis-fernando-olivera-vega',
  'Mario Enrique Vizcarra Cornejo': 'mario-enrique-vizcarra-cornejo',
  'María Soledad Pérez Tello De Rodríguez': 'maria-soledad-perez-tello-de-rodriguez',
  'Mesías Antonio Guevara Amasifuen': 'mesias-antonio-guevara-amasifuen',
  'Napoleón Becerra García': 'napoleon-becerra-garcia',
  'Paul Davis Jaimes Blanco': 'paul-davis-jaimes-blanco',
  'Pitter Enrique Valderrama Peña': 'pitter-enrique-valderrama-pena',
  'Rafael Bernardo López Aliaga': 'rafael-bernardo-lopez-aliaga',
  'Rafael Jorge Belaunde Llosa': 'rafael-jorge-belaunde-llosa',
  'Ricardo Pablo Belmont Cassinelli': 'ricardo-pablo-belmont-cassinelli',
  'Roberto Enrique Chiabra León': 'roberto-enrique-chiabra-leon',
  'Roberto Helbert Sánchez Palomino': 'roberto-helbert-sanchez-palomino',
  'Ronald Darwin Atencio Sotomayor': 'ronald-darwin-atencio-sotomayor',
  'Rosario del Pilar Fernández Bazán': 'rosario-del-pilar-fernandez-bazan',
  'Vladimir Roy Cerrón Rojas': 'vladimir-roy-cerron-rojas',
  'Walter Gilmer Chirinos Purizaga': 'walter-gilmer-chirinos-purizaga',
  'Wolfgang Mario Grozo Costa': 'wolfgang-mario-grozo-costa',
  'Yonhy Lescano Ancieta': 'yonhy-lescano-ancieta',
};

// Rutas
const sourceDir = path.join('C:', 'Users', 'Asd', 'Downloads', 'candidatos2026');
const targetBaseDir = path.join(__dirname, '..', 'public', 'pdfs');

// Crear estructura de carpetas
const folders = ['hojas-vida', 'planes-gobierno', 'resumenes-planes'];
folders.forEach(folder => {
  const folderPath = path.join(targetBaseDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`✓ Creada carpeta: ${folderPath}`);
  }
});

// Función para normalizar nombres de archivos
function normalizeFileName(fileName) {
  return fileName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim();
}

// Procesar cada candidato
let processedCount = 0;
let errorCount = 0;
const results = {};

Object.entries(nameToKeyMap).forEach(([folderName, key]) => {
  const sourceFolder = path.join(sourceDir, folderName);
  
  if (!fs.existsSync(sourceFolder)) {
    console.log(`⚠ Carpeta no encontrada: ${folderName}`);
    errorCount++;
    return;
  }

  const files = fs.readdirSync(sourceFolder);
  
  if (!results[key]) {
    results[key] = {};
  }
  
  files.forEach(file => {
    if (path.extname(file).toLowerCase() === '.pdf') {
      const normalizedName = normalizeFileName(file);
      let targetFolder = '';
      let targetFileName = '';

      // Determinar tipo de PDF
      if (normalizedName.includes('hoja') || normalizedName.includes('vida')) {
        targetFolder = 'hojas-vida';
        targetFileName = `${key}.pdf`;
      } else if (normalizedName.includes('resumen')) {
        targetFolder = 'resumenes-planes';
        targetFileName = `${key}.pdf`;
      } else if (normalizedName.includes('plan') || normalizedName.includes('gobierno')) {
        targetFolder = 'planes-gobierno';
        targetFileName = `${key}.pdf`;
      } else {
        console.log(`⚠ No se pudo clasificar: ${file}`);
        return;
      }

      const sourcePath = path.join(sourceFolder, file);
      const targetPath = path.join(targetBaseDir, targetFolder, targetFileName);

      try {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`✓ Copiado: ${file} → ${targetFolder}/${targetFileName}`);
        processedCount++;

        // Guardar información para actualizar candidatos-detalle.ts
        if (targetFolder === 'hojas-vida') {
          results[key].hojaVidaUrl = `/pdfs/hojas-vida/${targetFileName}`;
        } else if (targetFolder === 'planes-gobierno') {
          results[key].planGobiernoUrl = `/pdfs/planes-gobierno/${targetFileName}`;
        }
      } catch (error) {
        console.error(`✗ Error copiando ${file}:`, error.message);
        errorCount++;
      }
    }
  });
});

console.log('\n=== Resumen ===');
console.log(`✓ PDFs procesados: ${processedCount}`);
console.log(`✗ Errores: ${errorCount}`);

// Guardar resultados en JSON para el siguiente paso
const resultsPath = path.join(__dirname, '..', 'pdf-mapping.json');
fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
console.log(`\n✓ Mapeo guardado en: ${resultsPath}`);

