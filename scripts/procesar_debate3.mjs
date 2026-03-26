import { readFileSync, writeFileSync } from 'fs';

const raw = JSON.parse(readFileSync('C:/Users/Asd/Downloads/tmpas7xuze2_transcript.json', 'utf8'));

// Debate 3 — 25 de marzo de 2026
// Speaker identification via moderator cues and self-identification:
//   Speaker 1  → pre-debate TV commentary noise (excluded by DEBATE_START)
//   Speaker 2  → Fernando (moderador) — excluido
//   Speaker 3  → Rafael Belaúnde Llosa  (Libertad Popular) + pre-debate noise
//   Speaker 4  → Gerber Caler Gutiérrez (Partido Patriótico del Perú) + countdown noise
//   Speaker 5  → Mesías Guevara Amasifuén (Partido Morado) + pre-debate noise
//   Speaker 6  → Claudia (moderadora) — excluido
//   Speaker 7  → Narrador — excluido
//   Speaker 8  → Ronald Atencio Sotomayor (Alianza Electoral Venceremos) — self-id
//   Speaker 9  → Paul Jaimes Blanco (Progresemos) — cue: moderador 00:14:14
//   Speaker 10 → Antonio Ortiz Villano (Salvemos al Perú) — cue: moderador 00:15:29
//   Speaker 11 → Peter Valderrama Peña (Partido Aprista Peruano) — cue: moderador 00:33:14, "El APRA es el cambio"
//   Speaker 12 → Roberto Quiabra León (Unidad Nacional) — cue: moderador 00:29:36
//   Speaker 13 → Mario Vizcarra Cornejo (Perú Primero) — cue: moderador 00:30:43
//   Speaker 14 → Jorge Nieto Montesinos (Partido del Buen Gobierno) — cue: moderador 00:43:42
//   Speaker 15 → Keiko Fujimori Iguchi (Fuerza Popular) — self-id
//   Speaker 16 → Rosario Fernández Bazán (Un Camino Diferente) — female voice, self-id

const SPEAKER_MAP = {
  'Speaker 3':  { key: 'rafael_belaunde',   nombre: 'Rafael Belaúnde Llosa',    partido: 'Libertad Popular' },
  'Speaker 4':  { key: 'gerber_caler',       nombre: 'Gerber Caler Gutiérrez',   partido: 'Patriótico del Perú' },
  'Speaker 5':  { key: 'mesias_guevara',     nombre: 'Mesías Guevara',           partido: 'Partido Morado' },
  'Speaker 8':  { key: 'ronald_atencio',     nombre: 'Ronald Atencio',           partido: 'Alianza Venceremos' },
  'Speaker 9':  { key: 'paul_jaimes',        nombre: 'Paul Jaimes Blanco',       partido: 'Progresemos' },
  'Speaker 10': { key: 'antonio_ortiz',      nombre: 'Antonio Ortiz Villano',    partido: 'Salvemos al Perú' },
  'Speaker 11': { key: 'peter_valderrama',   nombre: 'Peter Valderrama',         partido: 'Partido Aprista Peruano' },
  'Speaker 12': { key: 'roberto_quiabra',    nombre: 'Roberto Quiabra León',     partido: 'Unidad Nacional' },
  'Speaker 13': { key: 'mario_vizcarra',     nombre: 'Mario Vizcarra',           partido: 'Perú Primero' },
  'Speaker 14': { key: 'jorge_nieto',        nombre: 'Jorge Nieto Montesinos',   partido: 'Partido del Buen Gobierno' },
  'Speaker 15': { key: 'keiko_fujimori',     nombre: 'Keiko Fujimori',           partido: 'Fuerza Popular' },
  'Speaker 16': { key: 'rosario_fernandez',  nombre: 'Rosario Fernández Bazán',  partido: 'Un Camino Diferente' },
};

const ATTACK_WORDS = [
  'corrupto','corruptos','corrupción','corrupta','mafioso','mafia','mafias','criminal','criminales',
  'delincuente','delincuentes','ladrón','ladrones','ratero','rateros','mentira','mentiras',
  'mentiroso','mentirosos','traidor','traidores','incapaz','incapaces','mediocre','mediocres',
  'incompetente','incompetentes','sinvergüenza','cínico','demagogo','populista',
  'destruyó','destruir','fracasó','fracasar','robo','robaron','roban','saqueo','saquearon',
  'ineficiente','pésimo','pésima','nefasto','nefasta','impunidad','impune',
  'cobarde','hipócrita','extorsionadores','delincuencial','pacto mafioso',
  'testaferro','nos están matando','organización criminal','cárcel','preso','detenido',
];

const PROPOSAL_WORDS = [
  'vamos a','voy a','proponemos','propongo','implementaremos','implementaré',
  'crearemos','crearé','estableceremos','estableceré','garantizaremos','garantizaré',
  'promoveremos','promoveré','construiremos','construiré','reformaremos','reformaré',
  'nuestro plan','mi plan','mi propuesta','nuestra propuesta',
  'en mi gobierno','en nuestro gobierno','cuando sea presidente','si gano',
  'primer medida','primera medida','100 días','60 días','primer día',
  'derogar','deroga','decreto ley','vamos a fortalecer','vamos a crear',
];

const TOPIC_KEYWORDS = {
  seguridad: ['seguridad','delincuencia','criminalidad','crimen','policía','policial','extorsión',
    'secuestro','robo','asesinato','sicario','bandas','mara','prisión','cárcel','penal',
    'fuerzas del orden','militares','ffaa','serenazgo','inseguridad','explosivos','sicariato'],
  economia: ['economía','económico','empleo','trabajo','desempleo','inversión','empresa',
    'empresarios','sueldo','salario','mínimo','PBI','crecimiento','pobreza','impuesto',
    'tributo','reactivación','producción','exportación','industria','comercio','libre mercado',
    'minería','mineros','formalización'],
  corrupcion: ['corrupción','corrupto','corruptos','impunidad','coima','soborno','lavado',
    'dinero ilegal','fiscalía','procurador','transparencia','anticorrupción',
    'pacto mafioso','sistema mafioso','mafias','narco','narcotráfico','colaboración eficaz',
    'delación premiada','allanamiento','contratación pública','peculado','colusión'],
  educacion: ['educación','educativo','escuela','colegio','universidad','maestro','profesor',
    'docente','alumno','estudiante','aprendizaje','calidad educativa','beca','analfabetismo',
    'minedu','currículo','tecnología educativa'],
  salud: ['salud','hospital','clínica','médico','medicina','enfermera','paciente','essalud',
    'minsa','seguro médico','sis','atención médica','covid','pandemia','enfermedad',
    'medicamento','sistema de salud','infraestructura sanitaria'],
  estado: ['estado','reforma','constitución','congreso','ejecutivo','poder','gobierno',
    'democracia','república','descentralización','autonomía','regional','municipio',
    'burocracia','aparato estatal','reforma del estado','poder judicial','justicia',
    'sistema judicial','fiscalía','ministerio público'],
};

const CANDIDATE_MENTIONS = {
  'keiko_fujimori':   ['Fujimori','Keiko','Fuerza Popular'],
  'rafael_belaunde':  ['Belaúnde','Belahunde','Belaunde'],
  'peter_valderrama': ['Valderrama','APRA','aprista','apra'],
  'jorge_nieto':      ['Nieto','Jorge Nieto'],
  'mesias_guevara':   ['Guevara','Mesías','Morado'],
  'gerber_caler':     ['Kaller','Caler','Patriótico','Gerber'],
  'mario_vizcarra':   ['Vizcarra','Mario Vizcarra','Perú Primero'],
  'paul_jaimes':      ['Jaimes','Progresemos'],
  'antonio_ortiz':    ['Ortiz Villano','Salvemos'],
  'rosario_fernandez':['Fernández Bazán','Rosario Fernández','Fernandez'],
  'roberto_quiabra':  ['Quiabra'],
  'ronald_atencio':   ['Atencio','Ronald Atencio'],
};

// Noise: TV comerciales y ciudadanos preguntando mezclados por AssemblyAI
const NOISE_PATTERNS = [
  /Mercado Peruano/i,
  /el mango es lo mejor/i,
  /Sin Barreras.*s[aá]bado/i,
  /TV Per[uú] Noticias/i,
  /En estas elecciones todos somos protagonistas/i,
  /donde un mismo compromiso nos une/i,
  /El APRA es el cambio/i,       // cross-talk de Valderrama desde el público
  /Hola.*mi nombre es.*soy del distrito/i,
  /buenas noches.*mi nombre es Abel/i,
  /Hola.*buenas noches.*mi nombre es/i,
  /estimados candidatos.*reciban un cordial saludo/i,
  /Nuestro trabajo es cubrirlo/i,
  /El tuyo.*decidir/i,
  /IRTP/i,
  /Radio Nacional/i,
];

function isNoise(text) {
  return NOISE_PATTERNS.some(re => re.test(text));
}

function toSec(ts) {
  const parts = ts.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return parts[0] * 60 + parts[1];
}

function fmtLabel(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

// Init stats
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
    temaHits: { seguridad: 0, economia: 0, corrupcion: 0, educacion: 0, salud: 0, estado: 0 },
    menciones: new Set(),
  };
}

// Debate starts ~12:00 (candidates called to podium at 00:11:50)
const DEBATE_START = 710;

const segments = raw.segments.filter(s => {
  const t = toSec(s.start);
  return t >= DEBATE_START && SPEAKER_MAP[s.speaker] && !isNoise(s.text);
});

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

  // Mutually exclusive: attack > proposal > neutral
  const hasAtk  = ATTACK_WORDS.some(w => tl.includes(w.toLowerCase()));
  const hasProp = PROPOSAL_WORDS.some(w => tl.includes(w.toLowerCase()));
  if (hasAtk)       st.atkSegs += 1;
  else if (hasProp) st.propSegs += 1;

  for (const [topic, kws] of Object.entries(TOPIC_KEYWORDS)) {
    if (kws.some(kw => tl.includes(kw.toLowerCase()))) {
      st.temaHits[topic] += 1;
    }
  }

  for (const [toKey, patterns] of Object.entries(CANDIDATE_MENTIONS)) {
    if (toKey === info.key) continue;
    if (patterns.some(p => seg.text.includes(p))) {
      st.menciones.add(toKey);
    }
  }
}

// Red de ataques
const attackCounts = {};
for (const seg of segments) {
  const info = SPEAKER_MAP[seg.speaker];
  for (const [toKey, patterns] of Object.entries(CANDIDATE_MENTIONS)) {
    if (toKey === info.key) continue;
    if (patterns.some(p => seg.text.includes(p))) {
      const k = info.key + '|' + toKey;
      if (!attackCounts[k]) attackCounts[k] = { from: info.key, to: toKey, count: 0 };
      attackCounts[k].count += 1;
    }
  }
}
const redAtaques = Object.values(attackCounts).sort((a, b) => b.count - a.count);

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
}).sort((a, b) => b.tiempoSegundos - a.tiempoSegundos);

const output = {
  metadata: {
    fecha: '2026-03-25',
    jornada: 'Tercera jornada',
    candidatos: candidatos.length,
    segmentos: segments.length,
    duracionSegundos: durSec,
    duracionLabel: fmtLabel(durSec),
  },
  candidatos,
  redAtaques,
};

const outPath = 'public/data/debate3_stats.json';
writeFileSync(outPath, JSON.stringify(output, null, 2));

console.log('debate3_stats.json generado\n');
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
console.log('\nTotal segmentos procesados:', segments.length);
