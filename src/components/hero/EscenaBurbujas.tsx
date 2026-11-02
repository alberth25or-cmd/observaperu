"use client";

import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import * as THREE from "three";

export type EscenaHandle = {
  /** Progreso continuo del recorrido: 0 = entrada … 3 = dentro del Perú. */
  setProgreso: (p: number) => void;
};

type V3 = [number, number, number];

/**
 * Texturas generadas con Higgsfield (Recraft V4.1 Pro sobre negro).
 * `radio` es el radio de la esfera dentro de la imagen, `negro` el nivel
 * del fondo y `cy` la altura de su centro (de arriba abajo) cuando no está
 * al medio, todo medido sobre cada archivo: cada render deja la esfera de
 * un tamaño y un lugar distintos, y su fondo nunca es negro puro.
 */
const TEXTURAS: Record<
  string,
  { img: string; radio: number; negro: number; cy?: number }
> = {
  miraflores: { img: "peru/burbuja-miraflores", radio: 0.301, negro: 28 },
  botes: { img: "peru/burbuja-botes", radio: 0.348, negro: 22 },
  nazca: { img: "peru/burbuja-nazca", radio: 0.312, negro: 29 },
  huascaran: { img: "peru/burbuja-huascaran", radio: 0.219, negro: 25 },
  sierra: { img: "peru/burbuja-sierra", radio: 0.299, negro: 28, cy: 0.533 },
  vinicunca: { img: "peru/burbuja-vinicunca", radio: 0.373, negro: 20 },
  machupicchu: { img: "peru/burbuja-machupicchu", radio: 0.291, negro: 30 },
  titicaca: { img: "peru/burbuja-titicaca", radio: 0.232, negro: 27 },
  amazonas: { img: "peru/burbuja-amazonas", radio: 0.332, negro: 27 },
  manos: { img: "peru/burbuja-manos", radio: 0.343, negro: 29, cy: 0.488 },
  // Relleno: más Perú entre las regiones, ninguna burbuja vacía. Solo
  // lugares y cultura, nada de comida.
  ballestas: { img: "peru/burbuja-ballestas", radio: 0.371, negro: 23 },
  huacachina: { img: "peru/burbuja-huacachina", radio: 0.285, negro: 24 },
  chanchan: { img: "peru/burbuja-chanchan", radio: 0.359, negro: 30 },
  huanchaco: { img: "peru/burbuja-huanchaco", radio: 0.295, negro: 29 },
  lima: { img: "peru/burbuja-lima", radio: 0.252, negro: 32 },
  cusco: { img: "peru/burbuja-cusco", radio: 0.32, negro: 28, cy: 0.492 },
  maras: { img: "peru/burbuja-maras", radio: 0.252, negro: 28 },
  colca: { img: "peru/burbuja-colca", radio: 0.236, negro: 26 },
  arequipa: { img: "peru/burbuja-arequipa", radio: 0.193, negro: 24 },
  kuelap: { img: "peru/burbuja-kuelap", radio: 0.275, negro: 29 },
  catedral: { img: "peru/burbuja-catedral", radio: 0.293, negro: 27, cy: 0.492 },
  mirador: { img: "peru/burbuja-mirador", radio: 0.35, negro: 29, cy: 0.49 },
  telar: { img: "peru/burbuja-telar", radio: 0.371, negro: 41 },
};

type Textura = keyof typeof TEXTURAS;

/**
 * La burbuja de destino: las líneas de Nazca, que solo se entienden enteras
 * vistas desde arriba —como un buen estudio—. La cámara viaja hacia ella
 * todo el recorrido y al final se zambulle.
 */
const DESTINO: V3 = [0, 0.05, -16];

/**
 * El Perú en burbujas, a lo largo del camino. Cada región se luce en la
 * parada de su acto (a unos 4–5 de distancia) y en el tramo siguiente pasa
 * rozando la cámara. Abajo a la izquierda no va ninguna: ahí vive el texto.
 * `d` es el diámetro visible de la esfera.
 */
const REGIONES: { t: Textura; pos: V3; d: number }[] = [
  // Primeras burbujas: una por costa, sierra y selva.
  { t: "miraflores", pos: [-1.15, 0.6, -2.9], d: 1.0 },
  { t: "huascaran", pos: [1.3, -0.02, -3.4], d: 1.05 },
  { t: "amazonas", pos: [0.15, 1.0, -4.7], d: 0.95 },
  // Entre actos: pasan rozando la cámara, a los lados.
  { t: "vinicunca", pos: [1.85, 0.7, -6.2], d: 0.9 },
  { t: "sierra", pos: [-1.95, 0.35, -6.5], d: 0.9 },
  // Acto del rigor: la ficha técnica flota a la derecha, ellas a la izquierda.
  { t: "machupicchu", pos: [-1.2, 0.55, -8.4], d: 1.0 },
  { t: "titicaca", pos: [0.35, 1.0, -10.2], d: 0.9 },
  { t: "botes", pos: [1.5, 0.45, -11.8], d: 0.9 },
  // La muestra son personas: la última antes de la zambullida.
  { t: "manos", pos: [-1.6, 0.6, -12.8], d: 0.95 },
  { t: "nazca", pos: DESTINO, d: 1.9 },
];

/** Generador determinista: la composición es la misma en cada visita. */
function azar(semilla: number) {
  let s = semilla;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Burbujas de relleno: dan densidad y paralaje entre las regiones. Se
 * reparten a lo largo del camino en este orden, así que cuando hay más
 * burbujas que imágenes, las repetidas quedan a más de 15 de distancia y
 * nunca se ven juntas.
 */
const RELLENO: Textura[] = [
  // La catedral lejos de la plaza de Lima y el mirador lejos de la del
  // Cusco: se parecen lo bastante como para no querer verlas juntas.
  "cusco", "huacachina", "telar", "ballestas", "catedral", "colca",
  "chanchan", "mirador", "maras", "lima", "kuelap", "huanchaco", "arequipa",
];

function relleno(cuantas: number): { t: Textura; pos: V3; d: number }[] {
  const r = azar(7);
  return Array.from({ length: cuantas }, (_, i) => {
    const a = r() * Math.PI * 2;
    // Nunca en el eje: la cámara pasa por un pasillo despejado.
    const radio = 1.35 + r() * 2.1;
    const x = Math.cos(a) * radio * 1.25;
    const y = Math.sin(a) * radio * 0.62;
    return {
      t: RELLENO[i % RELLENO.length],
      // La franja de abajo se refleja hacia arriba: ahí vive el titular,
      // que ocupa más de media pantalla. Solo el borde derecho queda libre.
      pos: [x, x < 1.5 && y < 0 ? -y : y, 5 - (i / cuantas) * 23 - r() * 1.2] as V3,
      // Desde 0.26: más chicas, lo que llevan adentro ya no se distingue.
      d: 0.26 + r() * 0.36,
    };
  });
}

const VERT_BURBUJA = /* glsl */ `
  uniform float uTam;
  uniform vec2 uEscala;
  uniform float uGiro;
  varying vec2 vUv;
  varying float vDes;
  varying float vDist;
  void main() {
    vUv = uv;
    // Billboard: se arma en espacio de vista, siempre de frente a cámara.
    // Una esfera se ve igual desde cualquier ángulo: el truco no se nota.
    vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    vDist = -mv.z;
    // Estirada (el temblor de gelatina) y girada (el balanceo), en el
    // plano de la pantalla.
    vec2 q = position.xy * uTam * uEscala;
    float cg = cos(uGiro);
    float sg = sin(uGiro);
    mv.xy += vec2(q.x * cg - q.y * sg, q.x * sg + q.y * cg);
    // Desenfoque solo para lo que pasa rozando la cámara: ahí se lee como
    // primer plano de cine. Lo lejano tiene que verse nítido.
    vDes = clamp((2.0 - vDist) * 0.7, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG_BURBUJA = /* glsl */ `
  precision mediump float;
  uniform sampler2D uMapa;
  uniform float uAlfa;
  uniform float uNegro;
  uniform float uRadio;
  uniform vec2 uCentro;
  uniform float uBrillo;
  varying vec2 vUv;
  varying float vDes;
  varying float vDist;
  void main() {
    if (vDist < 0.05) discard;
    // Desenfoque barato y suave: un mipmap más chico. El -0.6 hace lo
    // contrario en las lejanas: al achicarse, la GPU suaviza la imagen de
    // más, y bajar un poco el nivel de mipmap le devuelve el detalle.
    vec3 c = texture2D(uMapa, vUv, vDes * 2.0 - 0.6).rgb;
    c = max(c - uNegro, 0.0) / (1.0 - uNegro) * uBrillo;

    float r = length(vUv - uCentro);
    // Dentro de la esfera el vidrio tapa en parte lo que tiene detrás:
    // así se lee como objeto y no como fantasma. Fuera, solo el halo del
    // borde suma luz: reflejos del render y el cuadrado de la imagen
    // nunca aparecen.
    float disco = 1.0 - smoothstep(uRadio * 0.93, uRadio * 1.01, r);
    float borde = 1.0 - smoothstep(uRadio * 1.03, uRadio * 1.25, r);

    // Lo que roza la cámara se desvanece en vez de cortarse de golpe.
    float a = uAlfa * smoothstep(0.3, 1.2, vDist);
    gl_FragColor = vec4(c * borde * a, disco * 0.62 * a);
  }
`;

/** Polvo dorado en suspensión: la referencia de velocidad del viaje. */
const VERT_POLVO = /* glsl */ `
  attribute float aSeed;
  uniform float uTiempo;
  uniform float uDpr;
  uniform float uFoco;
  varying float vAlfa;
  void main() {
    vec3 p = position;
    p.y += sin(uTiempo * 0.3 + aSeed * 40.0) * 0.06;
    p.x += cos(uTiempo * 0.23 + aSeed * 31.0) * 0.06;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = max(0.2, -mv.z);
    float des = clamp(abs(dist - uFoco) * 0.25, 0.0, 1.0);
    vAlfa = (0.35 + aSeed * 0.65) * mix(1.0, 0.25, des)
          * smoothstep(0.2, 1.0, dist) * (1.0 - smoothstep(14.0, 22.0, dist));
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uDpr * (1.2 + aSeed * 2.2) * (1.0 + des * 3.0) * (3.0 / dist);
  }
`;

const FRAG_POLVO = /* glsl */ `
  precision mediump float;
  uniform float uAlfa;
  varying float vAlfa;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d2 = dot(c, c);
    if (d2 > 0.25) discard;
    float a = smoothstep(0.25, 0.02, d2) * vAlfa * uAlfa;
    // Alfa 0: suma luz sin volver opaco el canvas.
    gl_FragColor = vec4(vec3(0.86, 0.72, 0.4) * a, 0.0);
  }
`;

const suave = (t: number) => t * t * (3 - 2 * t);
const tramo = (a: number, b: number, x: number) =>
  suave(Math.max(0, Math.min(1, (x - a) / (b - a))));

/** Profundidad de la cámara en cada parada del recorrido. */
const PARADAS = [6, 1.6, -4.2, -13.7];

const EscenaBurbujas = forwardRef<EscenaHandle, { onListo?: () => void }>(
  function EscenaBurbujas({ onListo }, ref) {
    const contenedor = useRef<HTMLDivElement>(null);
    const api = useRef<{ setProgreso: (p: number) => void } | null>(null);

    useImperativeHandle(ref, () => ({
      setProgreso: (p) => api.current?.setProgreso(p),
    }));

    useEffect(() => {
      const nodo = contenedor.current;
      if (!nodo) return;

      const reducido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const angosto = window.innerWidth < 900;

      const escena = new THREE.Scene();
      const FOV = 34;
      const camara = new THREE.PerspectiveCamera(FOV, 1, 0.05, 80);

      // Sin WebGL (teléfonos viejos, algunos navegadores internos) el hero
      // debe mostrar el texto igual: el velo no puede quedarse puesto.
      let render: THREE.WebGLRenderer;
      try {
        render = new THREE.WebGLRenderer({
          // El borde de las burbujas ya lo suaviza el shader.
          antialias: !angosto,
          alpha: true,
          powerPreference: "high-performance",
        });
      } catch {
        onListo?.();
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, angosto ? 1.75 : 2);
      render.setPixelRatio(dpr);
      render.setClearColor(0x000000, 0);
      nodo.appendChild(render.domElement);
      render.domElement.style.display = "block";
      render.domElement.style.width = "100%";
      render.domElement.style.height = "100%";

      const foco = { value: 6 };
      const tiempo = { value: 0 };

      // ── Burbujas ─────────────────────────────────────────────────
      const gestor = new THREE.LoadingManager();
      const cargador = new THREE.TextureLoader(gestor);
      const texturas = new Map<Textura, THREE.Texture>();
      const textura = (t: Textura) => {
        let tex = texturas.get(t);
        if (!tex) {
          tex = cargador.load(`/images/${TEXTURAS[t].img}.webp`);
          tex.anisotropy = 4;
          texturas.set(t, tex);
        }
        return tex;
      };

      // En pantallas angostas las burbujas se acercan al eje: si no, las
      // regiones pasarían fuera de cuadro.
      const ancho = angosto ? 0.62 : 1;
      const geoPlano = new THREE.PlaneGeometry(1, 1);
      const todas = [...REGIONES, ...relleno(angosto ? 10 : 18)];
      const burbujas = todas.map((b, i) => {
        const info = TEXTURAS[b.t];
        const mat = new THREE.ShaderMaterial({
          vertexShader: VERT_BURBUJA,
          fragmentShader: FRAG_BURBUJA,
          uniforms: {
            uMapa: { value: textura(b.t) },
            // Tamaño del plano para que la esfera mida `d` de diámetro.
            uTam: { value: b.d / (2 * info.radio) },
            uRadio: { value: info.radio },
            // En la textura, v crece hacia arriba: se invierte la altura.
            uCentro: { value: new THREE.Vector2(0.5, 1 - (info.cy ?? 0.5)) },
            uNegro: { value: info.negro / 255 },
            uAlfa: { value: 1 },
            uEscala: { value: new THREE.Vector2(1, 1) },
            uGiro: { value: 0 },
            uBrillo: { value: 1 },
          },
          transparent: true,
          depthWrite: false,
          blending: THREE.CustomBlending,
          blendEquation: THREE.AddEquation,
          blendSrc: THREE.OneFactor,
          blendDst: THREE.OneMinusSrcAlphaFactor,
          blendSrcAlpha: THREE.OneFactor,
          blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
        });
        const malla = new THREE.Mesh(geoPlano, mat);
        const destino = b.pos === DESTINO;
        malla.position.set(destino ? b.pos[0] : b.pos[0] * ancho, b.pos[1], b.pos[2]);
        malla.frustumCulled = false;
        escena.add(malla);
        return {
          malla,
          u: mat.uniforms,
          base: malla.position.clone(),
          fase: i * 1.37,
          destino,
          d: b.d,
          // Desplazamiento elástico en el plano de la cámara (lo que el
          // cursor empuja) y su velocidad.
          ox: 0,
          oy: 0,
          vx: 0,
          vy: 0,
          encima: 0,
        };
      });

      // ── Polvo ────────────────────────────────────────────────────
      const NP = angosto ? 900 : 2200;
      const r = azar(21);
      const pos = new Float32Array(NP * 3);
      const semillas = new Float32Array(NP);
      for (let i = 0; i < NP; i++) {
        pos[i * 3] = (r() - 0.5) * 9 * ancho;
        pos[i * 3 + 1] = (r() - 0.5) * 5;
        pos[i * 3 + 2] = 8 - r() * 30;
        semillas[i] = r();
      }
      const geoPolvo = new THREE.BufferGeometry();
      geoPolvo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geoPolvo.setAttribute("aSeed", new THREE.BufferAttribute(semillas, 1));
      const matPolvo = new THREE.ShaderMaterial({
        vertexShader: VERT_POLVO,
        fragmentShader: FRAG_POLVO,
        uniforms: {
          uTiempo: tiempo,
          uDpr: { value: dpr },
          uFoco: foco,
          uAlfa: { value: 0.9 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneFactor,
        blendSrcAlpha: THREE.ZeroFactor,
        blendDstAlpha: THREE.OneFactor,
      });
      const polvo = new THREE.Points(geoPolvo, matPolvo);
      polvo.frustumCulled = false;
      polvo.renderOrder = 10;
      escena.add(polvo);

      // ── Cámara ───────────────────────────────────────────────────
      let progreso = 0;
      let w = 1;
      let h = 1;
      const raton = { x: 0, y: 0, ox: 0, oy: 0, px: 0, py: 0, dentro: false };
      const mira = new THREE.Vector3();
      const meta = new THREE.Vector3(...DESTINO);

      const colocarCamara = (p: number, t: number) => {
        const c = Math.max(0, Math.min(3, p));
        const i = Math.min(2, Math.floor(c));
        const f = c - i;
        // Mitad lineal, mitad suavizada: la cámara frena en cada parada
        // pero nunca se detiene del todo.
        const k = f * 0.4 + suave(f) * 0.6;
        // Antes del 0 está la entrada: la cámara llega desde más atrás.
        const z =
          PARADAS[i] + (PARADAS[i + 1] - PARADAS[i]) * k - Math.min(0, p) * 6;

        // Un vaivén lateral: viajar en línea recta no muestra relieve.
        const libre = 1 - tramo(2.2, 3, c);
        const x = Math.sin(c * 1.25) * 0.3 * libre + Math.sin(t * 0.13) * 0.08;
        const y = Math.sin(c * 0.9 + 0.6) * 0.14 * libre + Math.cos(t * 0.1) * 0.05;

        camara.position.set(
          x + raton.ox * 0.22 * libre,
          y + raton.oy * 0.13 * libre,
          z
        );
        // Siempre hacia la señal, con un leve desvío que se corrige al final.
        mira.copy(meta);
        mira.x += raton.ox * 0.55 * libre;
        mira.y += raton.oy * 0.3 * libre;
        camara.lookAt(mira);

        // El texto ocupa el tercio inferior: el encuadre sube, salvo en la
        // zambullida, donde la señal tiene que quedar al centro.
        const sube = (w / h < 0.8 ? 0.16 : 0.1) * libre;
        camara.setViewOffset(w, h, 0, h * sube, w, h);

        // Foco: a media distancia al principio, sobre la señal al final.
        const aSenal = camara.position.distanceTo(meta);
        foco.value = 6 + (aSenal - 6) * tramo(1.4, 2.8, c);
      };

      api.current = {
        setProgreso: (p) => {
          progreso = p;
          if (reducido) {
            colocarCamara(p, 0);
            render.render(escena, camara);
          }
        },
      };

      const redimensionar = () => {
        w = nodo.clientWidth;
        h = nodo.clientHeight;
        if (!w || !h) return;
        render.setSize(w, h, false);
        camara.aspect = w / h;
        colocarCamara(progreso, tiempo.value);
        if (reducido) render.render(escena, camara);
      };

      const alMover = (e: PointerEvent) => {
        raton.x = (e.clientX / window.innerWidth) * 2 - 1;
        raton.y = -((e.clientY / window.innerHeight) * 2 - 1);
        if (!raton.dentro) {
          // Sin esto, el primer movimiento parece un latigazo desde el centro.
          raton.px = raton.x;
          raton.py = raton.y;
          raton.dentro = true;
        }
      };
      const alSalir = () => {
        raton.dentro = false;
      };

      const flota = new THREE.Vector3();
      const enVista = new THREE.Vector3();
      const derecha = new THREE.Vector3();
      const arriba = new THREE.Vector3();
      const TAN = Math.tan((FOV * Math.PI) / 360);

      let bucle = 0;
      let vivo = true;
      let anterior = performance.now();

      // Pasado el hero no se dibuja: la escena ya no se ve y gasta batería.
      let enPantalla = true;
      const observador = new IntersectionObserver(([e]) => {
        enPantalla = e.isIntersecting;
      });
      observador.observe(nodo);

      const dibujar = (ahora: number) => {
        if (!vivo) return;
        // dt topado: al volver de otra pestaña, el primer delta es enorme.
        const dt = Math.min(40, ahora - anterior) / 1000;
        anterior = ahora;
        if (!enPantalla) {
          bucle = requestAnimationFrame(dibujar);
          return;
        }
        const t = (tiempo.value += dt);

        // El paralaje persigue al puntero con retardo: inercia.
        const k = 1 - Math.pow(0.05, dt);
        raton.ox += (raton.x - raton.ox) * k;
        raton.oy += (raton.y - raton.oy) * k;

        colocarCamara(progreso, t);
        camara.updateMatrixWorld();
        derecha.setFromMatrixColumn(camara.matrixWorld, 0);
        arriba.setFromMatrixColumn(camara.matrixWorld, 1);

        // Velocidad del cursor en pantalla: pasar rápido arrastra.
        const aspecto = w / h;
        const cvx = dt > 0 ? (raton.x - raton.px) / dt : 0;
        const cvy = dt > 0 ? (raton.y - raton.py) / dt : 0;
        raton.px = raton.x;
        raton.py = raton.y;

        burbujas.forEach((b) => {
          const { base, fase, destino } = b;

          // Deriva libre en tres ejes, cada una a su ritmo: las grandes
          // recorren más. La de Nazca casi no se mueve: es el encuadre
          // de la zambullida.
          const amp = destino ? 0.03 : 0.12 + b.d * 0.13;
          flota.set(
            base.x + Math.sin(t * (0.19 + (fase % 0.15)) + fase) * amp * 1.2,
            base.y + Math.sin(t * (0.29 + (fase % 0.12)) + fase * 1.7) * amp,
            base.z + (destino ? 0 : Math.sin(t * 0.16 + fase * 2.3) * amp * 2)
          );

          // Empuje del cursor, medido en pantalla.
          let fx = 0;
          let fy = 0;
          let cerca = 0;
          enVista.copy(flota).applyMatrix4(camara.matrixWorldInverse);
          const dist = -enVista.z;
          if (raton.dentro && !destino && dist > 0.3) {
            enVista.applyMatrix4(camara.projectionMatrix);
            const dx = (enVista.x - raton.x) * aspecto;
            const dy = enVista.y - raton.y;
            const dd = Math.hypot(dx, dy);
            // Radio de la burbuja en pantalla, más un margen mínimo: solo
            // reacciona cuando el cursor de verdad pasa por encima.
            const alcance = b.d / 2 / (dist * TAN) + 0.05;
            if (dd < alcance) {
              cerca = 1 - dd / alcance;
              // Un roce, no un empujón: unos 15 px como mucho.
              const empuje = cerca * cerca * 0.45;
              const ux = dd > 1e-4 ? dx / dd : 1;
              const uy = dd > 1e-4 ? dy / dd : 0;
              // De unidades de pantalla a mundo, a la profundidad de la burbuja.
              const escala = dist * TAN;
              fx = (ux * empuje + cvx * aspecto * cerca * 0.25) * escala;
              fy = (uy * empuje + cvy * cerca * 0.25) * escala;
            }
          }

          // Resorte amortiguado: vuelve a su sitio casi sin rebote.
          b.vx += (fx - 7 * b.ox - 4.4 * b.vx) * dt;
          b.vy += (fy - 7 * b.oy - 4.4 * b.vy) * dt;
          b.ox += b.vx * dt;
          b.oy += b.vy * dt;
          b.encima += (cerca - b.encima) * (1 - Math.pow(0.004, dt));

          b.malla.position
            .copy(flota)
            .addScaledVector(derecha, b.ox)
            .addScaledVector(arriba, b.oy);

          // Gelatina: tiembla según la velocidad; respira siempre un poco.
          const rapidez = Math.hypot(b.vx, b.vy);
          const temblor =
            Math.sin(t * 11 + fase) * Math.min(0.025, rapidez * 0.08) +
            Math.sin(t * 1.3 + fase) * 0.012;
          const crece = 1 + b.encima * 0.035;
          b.u.uEscala.value.set((1 + temblor) * crece, (1 - temblor) * crece);
          b.u.uGiro.value =
            Math.sin(t * 0.37 + fase) * 0.05 +
            Math.max(-0.06, Math.min(0.06, b.vx * 0.08));
          b.u.uBrillo.value = 1 + b.encima * 0.12;
        });

        render.render(escena, camara);
        bucle = requestAnimationFrame(dibujar);
      };

      // Con mala señal el texto no espera a las texturas.
      const paciencia = window.setTimeout(() => onListo?.(), 4000);

      gestor.onLoad = () => {
        if (!vivo) return;
        window.clearTimeout(paciencia);
        redimensionar();
        if (reducido) render.render(escena, camara);
        else bucle = requestAnimationFrame(dibujar);
        onListo?.();
      };

      // En una pantalla táctil el dedo hace scroll, no empuja burbujas.
      if (!reducido && window.matchMedia("(hover: hover)").matches) {
        window.addEventListener("pointermove", alMover, { passive: true });
        document.documentElement.addEventListener("pointerleave", alSalir);
      }
      window.addEventListener("resize", redimensionar);
      redimensionar();

      return () => {
        vivo = false;
        cancelAnimationFrame(bucle);
        window.clearTimeout(paciencia);
        observador.disconnect();
        window.removeEventListener("resize", redimensionar);
        window.removeEventListener("pointermove", alMover);
        document.documentElement.removeEventListener("pointerleave", alSalir);
        burbujas.forEach(({ malla }) => (malla.material as THREE.Material).dispose());
        texturas.forEach((t) => t.dispose());
        geoPlano.dispose();
        geoPolvo.dispose();
        matPolvo.dispose();
        render.dispose();
        if (render.domElement.parentNode === nodo)
          nodo.removeChild(render.domElement);
      };
    }, [onListo]);

    return <div ref={contenedor} className="absolute inset-0" />;
  }
);

export default EscenaBurbujas;
