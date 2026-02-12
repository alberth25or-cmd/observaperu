const https = require('https');
const fs = require('fs');
const path = require('path');

// URL de GADM para Perú (nivel 1 = departamentos)
const GADM_URL = 'https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_PER_1.json';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'maps');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'peru_departamentos.geojson');

// Crear directorio si no existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('Descargando GeoJSON de Perú desde GADM...');
console.log(`URL: ${GADM_URL}`);

https.get(GADM_URL, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Error: ${response.statusCode}`);
    process.exit(1);
  }

  let data = '';
  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    try {
      // Validar que sea JSON válido
      const json = JSON.parse(data);
      
      // Guardar archivo
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(json, null, 2), 'utf-8');
      
      console.log(`✓ GeoJSON descargado exitosamente`);
      console.log(`✓ Guardado en: ${OUTPUT_FILE}`);
      console.log(`✓ Total de features: ${json.features?.length || 0}`);
    } catch (error) {
      console.error('Error procesando JSON:', error.message);
      process.exit(1);
    }
  });
}).on('error', (error) => {
  console.error('Error descargando:', error.message);
  process.exit(1);
});

