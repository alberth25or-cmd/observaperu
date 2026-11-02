/**
 * Genera las posiciones destino de cada etapa del hero.
 *
 * Regla que sostiene todo el efecto: TODAS las etapas tienen el mismo número
 * de partículas y el mismo orden. La partícula #4721 es la misma en el caos,
 * en el histograma y en el mapa. Eso es lo que hace que el movimiento se lea
 * como una transformación y no como un reemplazo.
 *
 * Todas las etapas son volúmenes, no láminas: la cámara orbita entre ellas,
 * y una figura plana vista de canto desaparece.
 */

export type Silueta = {
  proporcion: number;
  anillos: [number, number][][];
};

/** Altura del suelo común. El histograma y el mapa se apoyan en él. */
export const PISO = -0.8;

/**
 * Fracción de partículas que forma las columnas del mapa. Son siempre las
 * primeras del arreglo, así el shader puede resaltarlas sin otra etapa.
 */
export const EN_COLUMNAS = 0.2;

/** Normal estándar por Box-Muller. */
function normal(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Punto al azar sobre una caja apoyada en `y0`. Casi la mitad cae sobre las
 * aristas: con partículas, una cara sola se lee como niebla; es el esqueleto
 * el que dice "esto es un bloque" desde cualquier ángulo. El resto se reparte
 * por área sobre cinco caras, sin la base.
 */
function enCaja(
  p: Float32Array,
  i: number,
  x0: number,
  y0: number,
  z0: number,
  w: number,
  h: number,
  d: number
) {
  let x = Math.random() * w;
  let y = Math.random() * h;
  let z = Math.random() * d;

  if (Math.random() < 0.45) {
    // Cuatro aristas verticales y las cuatro del techo, por longitud.
    const r = Math.random() * (4 * h + 2 * w + 2 * d);
    if (r < 4 * h) {
      x = r < 2 * h ? 0 : w;
      z = r % (2 * h) < h ? 0 : d;
    } else if (r < 4 * h + 2 * w) {
      y = h;
      z = r < 4 * h + w ? 0 : d;
    } else {
      y = h;
      x = r < 4 * h + 2 * w + d ? 0 : w;
    }
    p[i * 3] = x0 + x;
    p[i * 3 + 1] = y0 + y;
    p[i * 3 + 2] = z0 + z;
    return;
  }

  const arriba = w * d;
  const frente = w * h;
  const lado = d * h;
  const r = Math.random() * (arriba + 2 * frente + 2 * lado);
  if (r < arriba) y = h;
  else if (r < arriba + 2 * frente) z = r < arriba + frente ? 0 : d;
  else x = r < arriba + 2 * frente + lado ? 0 : w;
  p[i * 3] = x0 + x;
  p[i * 3 + 1] = y0 + y;
  p[i * 3 + 2] = z0 + z;
}

/** 1 · Caos: nube honda y sin estructura, el ruido. */
export function caos(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    p[i * 3] = (Math.random() - 0.5) * 6.4;
    p[i * 3 + 1] = (Math.random() - 0.5) * 3.4;
    p[i * 3 + 2] = (Math.random() - 0.5) * 5 - 0.6;
  }
  return p;
}

/** 2 · Grupos: el ruido revela conglomerados, cada uno a su profundidad. */
export function grupos(n: number, k = 7): Float32Array {
  const centros: [number, number, number][] = [];
  for (let i = 0; i < k; i++) {
    const a = (i / k) * Math.PI * 2 + 0.4;
    const r = 0.6 + Math.random() * 0.45;
    centros.push([
      Math.cos(a) * r * 1.6,
      Math.sin(a) * r * 0.8,
      (i % 2 ? -1 : 1) * (0.3 + Math.random() * 0.7),
    ]);
  }

  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const c = centros[i % k];
    p[i * 3] = c[0] + normal() * 0.17;
    p[i * 3 + 1] = c[1] + normal() * 0.15;
    p[i * 3 + 2] = c[2] + normal() * 0.17;
  }
  return p;
}

/**
 * 3 · Histograma bivariado: cada partícula cae en una celda según dos
 * normales independientes. Las columnas resultantes dibujan la campana en
 * tres dimensiones: es la distribución real, no una forma parecida.
 */
export function histograma(n: number, nx = 9, nz = 6): Float32Array {
  const ANCHO = 3.1;
  const FONDO = 2.1;
  const ALTO_MAX = 1.4;
  const cx = ANCHO / nx;
  const cz = FONDO / nz;

  const celdaDe = new Int32Array(n);
  const cuenta = new Int32Array(nx * nz);
  const binDe = (z: number, bins: number) =>
    Math.min(bins - 1, Math.floor(((Math.max(-2.9, Math.min(2.9, z)) + 3) / 6) * bins));

  for (let i = 0; i < n; i++) {
    const c = binDe(normal(), nz) * nx + binDe(normal(), nx);
    celdaDe[i] = c;
    cuenta[c]++;
  }
  const max = Math.max(...cuenta);

  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const c = celdaDe[i];
    const bx = c % nx;
    const bz = (c / nx) | 0;
    // 0.6 deja calles anchas entre columnas: sin ellas el conjunto se
    // funde en una loma lisa y deja de leerse como histograma.
    enCaja(
      p,
      i,
      -ANCHO / 2 + bx * cx + cx * 0.2,
      PISO,
      -FONDO / 2 + bz * cz + cz * 0.2,
      cx * 0.6,
      (cuenta[c] / max) * ALTO_MAX,
      cz * 0.6
    );
  }
  return p;
}

/**
 * Centroides de los departamentos en el espacio normalizado de la silueta
 * (x este, y sur) y población censada 2017 del INEI, en miles. Lima reúne
 * Lima Metropolitana, Lima Provincias y el Callao.
 */
const DEPARTAMENTOS: [number, number, number][] = [
  [-0.18, 0.28, 10400], // Lima + Callao
  [-0.584, -0.444, 1857], // Piura
  [-0.369, -0.139, 1779], // La Libertad
  [0.275, 0.726, 1383], // Arequipa
  [-0.41, -0.302, 1342], // Cajamarca
  [0.013, 0.256, 1247], // Junín
  [0.31, 0.436, 1206], // Cusco
  [-0.528, -0.31, 1198], // Lambayeque
  [0.554, 0.633, 1173], // Puno
  [-0.293, 0.023, 1084], // Áncash
  [0.062, -0.554, 884], // Loreto
  [-0.064, 0.55, 851], // Ica
  [-0.19, -0.235, 813], // San Martín
  [-0.115, 0.025, 722], // Huánuco
  [0.099, 0.535, 617], // Ayacucho
  [0.169, 0.047, 497], // Ucayali
  [0.22, 0.528, 406], // Apurímac
  [-0.334, -0.45, 380], // Amazonas
  [-0.001, 0.418, 348], // Huancavelica
  [0.515, 0.923, 330], // Tacna
  [-0.035, 0.131, 254], // Pasco
  [-0.607, -0.583, 225], // Tumbes
  [0.453, 0.837, 174], // Moquegua
  [0.487, 0.303, 141], // Madre de Dios
];

/** Escala del mapa sobre el suelo: unidades de mundo por unidad de silueta. */
const ESCALA_MAPA = 1.2;

/**
 * 4 · El Perú, tendido sobre el suelo, con una columna por departamento.
 * La altura va con la raíz de la población: así se reparte una muestra
 * nacional, y con la raíz Lima no aplasta al resto.
 *
 * La silueta se rasteriza a un canvas fuera de pantalla y se muestrean los
 * píxeles llenos: más rápido que hacer punto-en-polígono 40 mil veces.
 */
export function mapaPeru(n: number, silueta: Silueta): Float32Array {
  const ANCHO = 360;
  const ALTO = Math.round(ANCHO / silueta.proporcion);
  // La silueta ocupa x ∈ [-proporcion, proporcion], y ∈ [-1, 1].
  const ax = silueta.proporcion;

  const canvas = document.createElement("canvas");
  canvas.width = ANCHO;
  canvas.height = ALTO;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  for (const anillo of silueta.anillos) {
    anillo.forEach(([x, y], i) => {
      const px = ((x / ax) * 0.5 + 0.5) * ANCHO;
      const py = (y * 0.5 + 0.5) * ALTO;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
  }
  ctx.fill("evenodd");

  const datos = ctx.getImageData(0, 0, ANCHO, ALTO).data;
  const llenos: number[] = [];
  for (let i = 0; i < ANCHO * ALTO; i++) {
    if (datos[i * 4 + 3] > 128) llenos.push(i);
  }

  const p = new Float32Array(n * 3);
  if (llenos.length === 0) return p;

  const enColumnas = Math.floor(n * EN_COLUMNAS);
  const raices = DEPARTAMENTOS.map(([, , pob]) => Math.sqrt(pob));
  const raizMax = Math.max(...raices);
  const sumaRaices = raices.reduce((a, b) => a + b, 0);

  let i = 0;
  DEPARTAMENTOS.forEach(([dx, dy], d) => {
    // El último departamento absorbe el redondeo: las columnas tienen que
    // ocupar exactamente las primeras `enColumnas` partículas.
    const cuantas =
      d === DEPARTAMENTOS.length - 1
        ? enColumnas - i
        : Math.round((raices[d] / sumaRaices) * enColumnas);
    const alto = (raices[d] / raizMax) * 1.35;
    for (let k = 0; k < cuantas && i < enColumnas; k++, i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.026 * Math.sqrt(Math.random());
      p[i * 3] = dx * ESCALA_MAPA + Math.cos(a) * r;
      p[i * 3 + 1] = PISO + Math.random() * alto;
      p[i * 3 + 2] = dy * ESCALA_MAPA + Math.sin(a) * r;
    }
  });

  for (; i < n; i++) {
    const idx = llenos[(Math.random() * llenos.length) | 0];
    // Jitter dentro del píxel para que no se vea la retícula.
    const px = (idx % ANCHO) + Math.random();
    const py = ((idx / ANCHO) | 0) + Math.random();
    p[i * 3] = (px / ANCHO - 0.5) * 2 * ax * ESCALA_MAPA;
    p[i * 3 + 1] = PISO + Math.random() * 0.02;
    p[i * 3 + 2] = (py / ALTO - 0.5) * 2 * ESCALA_MAPA;
  }
  return p;
}

/**
 * 5 · El resultado. Tres barras con su bigote de error — literalmente lo que
 * la firma entrega. Es la etapa de cierre: no un territorio, sino una
 * conclusión con su incertidumbre declarada.
 */
export function resultado(n: number): Float32Array {
  const barras = [
    { y: 0.55, largo: 1.5, err: 0.11 },
    { y: 0.12, largo: 1.06, err: 0.13 },
    { y: -0.31, largo: 0.66, err: 0.1 },
  ];
  const x0 = -0.95;
  const alto = 0.28;
  const fondo = 0.34;

  const p = new Float32Array(n * 3);
  const porBarra = Math.floor(n / barras.length);

  for (let i = 0; i < n; i++) {
    const b = barras[Math.min(barras.length - 1, Math.floor(i / porBarra))];
    const dentro = i % porBarra;

    // Un 12 % de las partículas forma el bigote de error; el resto, la barra.
    if (dentro % 8 === 0) {
      const lado = dentro % 16 === 0 ? -1 : 1;
      p[i * 3] = x0 + b.largo + lado * Math.random() * b.err;
      p[i * 3 + 1] = b.y + (Math.random() - 0.5) * 0.012;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.012;
      // Los topes del bigote: dos rayas verticales en los extremos.
      if (dentro % 5 === 0) {
        p[i * 3] = x0 + b.largo + lado * b.err;
        p[i * 3 + 1] = b.y + (Math.random() - 0.5) * alto * 0.6;
      }
    } else {
      enCaja(p, i, x0, b.y - alto / 2, -fondo / 2, b.largo, alto, fondo);
    }
  }
  return p;
}

export const TITULOS = [
  { eyebrow: "Ruido", titulo: "Tu mercado habla, pero en desorden" },
  { eyebrow: "Muestra", titulo: "Elegimos a quién hay que preguntar" },
  { eyebrow: "Análisis", titulo: "Contamos, cruzamos, verificamos" },
  { eyebrow: "Cobertura", titulo: "Medimos en todo el Perú" },
  { eyebrow: "Decisión", titulo: "Y decides con evidencia, no con intuición" },
] as const;
