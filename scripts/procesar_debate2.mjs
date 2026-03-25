import { readFileSync, writeFileSync } from 'fs';

const raw = JSON.parse(readFileSync('C:/Users/Asd/Downloads/tmp7udkrnar_transcript.json', 'utf8'));

const SPEAKER_MAP = {
  'Speaker 1':  { key: 'fiorela_molineli',    nombre: 'Fiorela Molineli',       partido: 'Fuerza y Libertad' },
  'Speaker 2':  { key: 'alvaro_paz_barra',     nombre: 'Álvaro Paz de la Barra', partido: 'Fe en el Perú' },
  'Speaker 4':  { key: 'george_fors',          nombre: 'George Forsyth',         partido: 'Somos Perú' },
  'Speaker 5':  { key: 'carlos_jaiko',         nombre: 'Carlos Jaiko',           partido: 'Perú Moderno' },
  'Speaker 7':  { key: 'walter_chirinos',      nombre: 'Walter Chirinos',        partido: 'PRIM' },
  'Speaker 8':  { key: 'charlie_carrasco',     nombre: 'Charlie Carrasco',       partido: 'Demócrata Unido' },
  'Speaker 9':  { key: 'ricardo_belmont',      nombre: 'Ricardo Belmont',        partido: 'Cívico Obras' },
  'Speaker 10': { key: 'francisco_dizcanseco', nombre: 'Francisco Dizcanseco',   partido: 'Perú Acción' },
  'Speaker 11': { key: 'armando_mae',          nombre: 'Armando Maé',            partido: 'Democrático Federal' },
  'Speaker 12': { key: 'alfonso_spa',          nombre: 'Alfonso Spa Garcés',     partido: 'Sí Creo' },
  'Speaker 13': { key: 'roberto_sanchez',      nombre: 'Roberto Sánchez',        partido: 'Juntos por el Perú' },
};

const ATTACK_WORDS = [
  'corrupto','corruptos','corrupción','corrupta','mafioso','mafia','mafias','criminal','criminales',
  'delincuente','delincuentes','ladrón','ladrones','ratero','rateros','mentira','mentiras',
  'mentiroso','mentirosos','traidor','traidores','incapaz','incapaces','mediocre','mediocres',
  'incompetente','incompetentes','sinvergüenza','cínico','demagogo','populista',
  'destruyó','destruir','fracasó','fracasar','robo','robaron','roban','saqueo','saquearon',
  'ineficiente','pésimo','pésima','nefasto','nefasta','impunidad','impune',
  'cobarde','hipócrita','extorsionadores','delincuencial','pacto mafioso',
  'congreso ratero','nos están matando','organización criminal',
];

const PROPOSAL_WORDS = [
  'vamos a','voy a','proponemos','propongo','implementaremos','implementaré',
  'crearemos','crearé','estableceremos','estableceré','garantizaremos','garantizaré',
  'promoveremos','promoveré','construiremos','construiré','reformaremos','reformaré',
  'nuestro plan','mi plan','mi propuesta','nuestra propuesta',
  'en mi gobierno','en nuestro gobierno','cuando sea presidente','si gano',
  'primer medida','primera medida','100 días','180 días',
];

const TOPIC_KEYWORDS = {
  seguridad: ['seguridad','delincuencia','criminalidad','crimen','policía','policial','extorsión',
    'secuestro','robo','asesinato','sicario','bandas','mara','prisión','cárcel','penal',
    'fuerzas del orden','militares','ffaa','serenazgo','inseguridad'],
  economia: ['economía','económico','empleo','trabajo','desempleo','inversión','empresa',
    'empresarios','sueldo','salario','mínimo','PBI','crecimiento','pobreza','impuesto',
    'tributo','reactivación','producción','exportación','industria','comercio','libre mercado'],
  corrupcion: ['corrupción','corrupto','corruptos','impunidad','coima','soborno','lavado',
    'dinero ilegal','fiscalía','procurador','transparencia','anticorrupción','cleptocracia',
    'pacto mafioso','sistema mafioso','mafias','narco','narcotráfico','organización criminal'],
  educacion: ['educación','educativo','escuela','colegio','universidad','maestro','profesor',
    'docente','alumno','estudiante','aprendizaje','calidad educativa','beca','analfabetismo',
    'minedu','currículo','tecnología educativa'],
  salud: ['salud','hospital','clínica','médico','medicina','enfermera','paciente','essalud',
    'minsa','seguro médico','sis','atención médica','covid','pandemia','enfermedad',
    'medicamento','sistema de salud','infraestructura sanitaria'],
  estado: ['estado','reforma','constitución','congreso','ejecutivo','poder','gobierno',
    'democracia','república','descentralización','autonomía','regional','municipio',
    'burocracia','aparato estatal','reforma del estado','asamblea'],
};

const CANDIDATE_MENTIONS = {
  'fiorela_molineli':    ['Molineli','Molinelli','Fiorela','Fiorella'],
  'alvaro_paz_barra':    ['Paz de la Barra','Álvaro Paz','Alvaro Paz'],
  'george_fors':         ['Forsyth','Fors','Forset'],
  'carlos_jaiko':        ['Jaiko','Jaico'],
  'walter_chirinos':     ['Chirinos'],
  'charlie_carrasco':    ['Carrasco'],
  'ricardo_belmont':     ['Belmont','Belmon'],
  'francisco_dizcanseco':['Dizcanseco','Díaz Canseco','Díazcanseco'],
  'armando_mae':         ['Maé','Mae','Macé'],
  'alfonso_spa':         ['Spa','Espa'],
  'roberto_sanchez':     ['Sánchez','Sanchez'],
};

// Noise patterns — TV promos, commercials, citizen video questions mixed into Speaker 1/2
const NOISE_PATTERNS = [
  /Nuestro trabajo es cubrirlo/i,
  /El tuyo.*decidir/i,
  /cobertura especial/i,
  /IRTP/i,
  /Radio Nacional/i,
  /TV Per[uú]/i,
  /sin fronteras.*Geomundo/i,
  /Pampamarca.*naci[oó]/i,
  /Micaela Bastidas/i,
  /ventana abierta a un mundo/i,
  /Vive el deporte.*Par[eé]/i,
  /lenguas.*raíces.*identidad/i,
  /Sust[eé]n esto.*mi turno/i,
  /Hola.*mi nombre es.*soy de/i,
  /Hola.*soy.*mi pregunta es/i,
  /estimados candidatos.*reciban un cordial saludo/i,
  /Mi pregunta es.*¿qué m/i,
  /Hola.*soy Xiomara/i,
  /soy de la ciudad de/i,
];

function isNoise(text) {
  return NOISE_PATTERNS.some(re => re.test(text));
}

function toSec(ts) {
  const parts = ts.split(':').map(Number);
  if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
  return parts[0]*60 + parts[1];
}

function fmtLabel(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${String(s).padStart(2,'0')}s`;
}

// Init
const stats = {};
for (const info of Object.values(SPEAKER_MAP)) {
  stats[info.key] = {
    ...info,
    tiempoSegundos: 0,
    palabrasTotales: 0,
    intervenciones: 0,
    atkSegs: 0,
    propSegs: 0,
    totalSegs: 0,
    temaHits: { seguridad:0, economia:0, corrupcion:0, educacion:0, salud:0, estado:0 },
    menciones: new Set(),
  };
}

const DEBATE_START = 760;

const segments = raw.segments.filter(s => {
  const t = toSec(s.start);
  return t >= DEBATE_START && SPEAKER_MAP[s.speaker] && !isNoise(s.text);
});

// Compute total duration from last segment
const lastSeg = raw.segments[raw.segments.length - 1];
const durSec = Math.round(toSec(lastSeg.end ?? lastSeg.start));

for (const seg of segments) {
  const info = SPEAKER_MAP[seg.speaker];
  const st = stats[info.key];
  const dur = Math.max(0, toSec(seg.end) - toSec(seg.start));
  const words = seg.text.trim().split(/\s+/).length;
  const tl = seg.text.toLowerCase();

  st.tiempoSegundos += dur;
  st.palabrasTotales += words;
  st.intervenciones += 1;
  st.totalSegs += 1;

  // Mutually exclusive classification: attack > proposal > neutral
  const hasAtk  = ATTACK_WORDS.some(w => tl.includes(w.toLowerCase()));
  const hasProp = PROPOSAL_WORDS.some(w => tl.includes(w.toLowerCase()));
  if (hasAtk)       st.atkSegs  += 1;
  else if (hasProp) st.propSegs += 1;

  // Topics
  for (const [topic, kws] of Object.entries(TOPIC_KEYWORDS)) {
    if (kws.some(kw => tl.includes(kw.toLowerCase()))) {
      st.temaHits[topic] += 1;
    }
  }

  // Mentions of other candidates
  for (const [toKey, patterns] of Object.entries(CANDIDATE_MENTIONS)) {
    if (toKey === info.key) continue;
    if (patterns.some(p => seg.text.includes(p))) {
      st.menciones.add(toKey);
    }
  }
}

// Build redAtaques
const attackCounts = {};
for (const seg of segments) {
  const info = SPEAKER_MAP[seg.speaker];
  for (const [toKey, patterns] of Object.entries(CANDIDATE_MENTIONS)) {
    if (toKey === info.key) continue;
    if (patterns.some(p => seg.text.includes(p))) {
      const k = info.key + '|' + toKey;
      attackCounts[k] = (attackCounts[k] || { from: info.key, to: toKey, count: 0 });
      attackCounts[k].count += 1;
    }
  }
}
const redAtaques = Object.values(attackCounts).sort((a,b) => b.count - a.count);

// Count mencionadoPor
const mentionedBy = {};
for (const seg of segments) {
  const fromKey = SPEAKER_MAP[seg.speaker].key;
  for (const [toKey, patterns] of Object.entries(CANDIDATE_MENTIONS)) {
    if (toKey === fromKey) continue;
    if (patterns.some(p => seg.text.includes(p))) {
      if (!mentionedBy[toKey]) mentionedBy[toKey] = new Set();
      mentionedBy[toKey].add(fromKey);
    }
  }
}

// Assemble candidatos
const candidatos = Object.values(stats).map(st => {
  const n = st.totalSegs || 1;
  const pAtk  = Math.round((st.atkSegs / n) * 100);
  const pProp = Math.round((st.propSegs / n) * 100);
  const pNeut = Math.max(0, 100 - pAtk - pProp);

  // Temas: fraction of segments that touched each topic
  const temas = {};
  for (const [topic, hits] of Object.entries(st.temaHits)) {
    temas[topic] = Math.round((hits / n) * 1000) / 1000;
  }

  return {
    key: st.key,
    nombre: st.nombre,
    partido: st.partido,
    tiempoSegundos: st.tiempoSegundos,
    tiempoLabel: fmtLabel(st.tiempoSegundos),
    palabrasTotales: st.palabrasTotales,
    intervenciones: st.intervenciones,
    promSegPorInterv: st.intervenciones > 0
      ? Math.round((st.tiempoSegundos / st.intervenciones) * 10) / 10
      : 0,
    porcentajeAtaque: pAtk,
    porcentajePropuesta: pProp,
    porcentajeNeutro: pNeut,
    temas,
    mencionadoPor: (mentionedBy[st.key]?.size) ?? 0,
    interrupciones: 0,
  };
}).sort((a,b) => b.tiempoSegundos - a.tiempoSegundos);

const output = {
  metadata: {
    fecha: '2026-03-24',
    jornada: 'Segunda jornada',
    candidatos: candidatos.length,
    segmentos: segments.length,
    duracionSegundos: durSec,
    duracionLabel: fmtLabel(durSec),
  },
  candidatos,
  redAtaques,
};

const outPath = 'public/data/debate2_stats.json';
writeFileSync(outPath, JSON.stringify(output, null, 2));

console.log('debate2_stats.json generado\n');
console.log('Candidatos:');
candidatos.forEach(c => {
  console.log(
    ' ', c.nombre.padEnd(28), c.tiempoLabel.padStart(8),
    (c.palabrasTotales + ' pal.').padStart(9),
    (c.intervenciones + ' int.').padStart(7),
    ('atk:' + c.porcentajeAtaque + '%').padStart(8),
    ('prop:' + c.porcentajePropuesta + '%').padStart(8)
  );
});
console.log('\nRed de menciones:');
redAtaques.forEach(e => console.log(`  ${e.from} -> ${e.to}: ${e.count}x`));
