"use client";

import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import * as THREE from "three";
import {
  caos,
  grupos,
  histograma,
  mapaPeru,
  resultado,
  PISO,
  EN_COLUMNAS,
  type Silueta,
} from "@/lib/etapas";

export type CampoHandle = {
  /** Progreso continuo entre etapas: 0 = caos … 4 = resultado. */
  setProgreso: (p: number) => void;
};

type V3 = [number, number, number];

/**
 * Dónde está la cámara en cada etapa y hacia dónde mira. El scroll la lleva
 * de una a otra: el relieve no lo dan las partículas, lo da ver la misma
 * escena desde ángulos distintos.
 */
const CAMARA: { pos: V3; mira: V3 }[] = [
  { pos: [0, 0.15, 4.7], mira: [0, 0, -0.4] },
  { pos: [1.7, 0.55, 3.9], mira: [0, 0, 0] },
  { pos: [-2.9, 2.7, 4.1], mira: [-0.35, PISO + 0.45, -0.1] },
  { pos: [-0.45, 3.9, 2.5], mira: [0, PISO, 0.2] },
  { pos: [-1.8, 0.85, 4.3], mira: [-0.2, 0.05, 0] },
];

/**
 * Objetos de vidrio y oro generados con Higgsfield (Recraft V4.1 Pro sobre
 * negro puro). Viven dentro de la escena, a distintas profundidades: cuando
 * la cámara orbita se desplazan a velocidades distintas y la profundidad de
 * campo los desenfoca según su distancia real.
 *
 * `vis` es la opacidad en cada etapa: en el mapa estorbarían.
 */
const OBJETOS: { img: string; pos: V3; tam: number; vis: number[] }[] = [
  // La galaxia contenida: el ruido ya ordenado dentro de una lente.
  { img: "orbe-senal", pos: [1.6, 0.22, -0.7], tam: 1.35, vis: [1, 1, 0.45, 0.3, 0.85] },
  // Primer plano, desenfocado: el plano más cercano de todos.
  { img: "orbe-vidrio", pos: [-2.25, 1.05, 1.7], tam: 1.0, vis: [0.9, 0.9, 0.8, 0.4, 0.8] },
  { img: "orbe-oro", pos: [2.5, -0.45, 1.3], tam: 0.75, vis: [0.9, 1, 0.9, 0.5, 1] },
  // Fondo lejano: casi bokeh puro.
  { img: "orbe-vidrio", pos: [-2.7, -0.15, -3.3], tam: 1.5, vis: [0.6, 0.7, 0.6, 0.3, 0.6] },
  { img: "orbe-oro", pos: [-0.4, 1.3, -2.7], tam: 0.6, vis: [0.8, 0.8, 0.8, 0.4, 0.8] },
];

const VERT = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aSeed;
  attribute float aAcento;

  uniform float uMezcla;
  uniform float uAcento;
  uniform float uAvance;
  uniform vec2  uRaton;
  uniform float uAspecto;
  uniform float uLente;
  uniform float uTiempo;
  uniform float uTam;
  uniform float uDpr;
  uniform float uFoco;

  varying float vSenal;
  varying float vDesenfoque;
  varying float vSemilla;
  varying float vColumna;
  varying float vTerritorio;

  void main() {
    vec3 base = mix(aFrom, aTo, uMezcla);

    // Deriva mínima: el caos nunca está del todo quieto.
    float amp = 0.022 * (1.0 - uAvance * 0.7);
    base.x += sin(uTiempo * 0.23 + aSeed * 6.2831) * amp;
    base.y += cos(uTiempo * 0.19 + aSeed * 5.1107) * amp;
    base.z += sin(uTiempo * 0.17 + aSeed * 4.3) * amp;

    // La lente, medida en pantalla: con la cámara orbitando, un radio en
    // coordenadas de mundo no tendría sentido. Dentro de su radio la
    // partícula ya adopta su posición ordenada. Esa es la tesis de la marca.
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(base, 1.0);
    vec2 ndc = clip.xy / clip.w;
    float d = length((ndc - uRaton) * vec2(uAspecto, 1.0));
    float lente = 1.0 - smoothstep(uLente * 0.5, uLente, d);
    vec3 pos = mix(base, aTo, lente * 0.9);

    // De ruido gris a señal dorada a lo largo de todo el recorrido.
    vSenal = max(uAvance, lente);
    vSemilla = aSeed;
    // En el mapa, las columnas son la medición y el territorio el fondo.
    vColumna = aAcento * uAcento;
    vTerritorio = (1.0 - aAcento) * uAcento;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float dist = max(0.4, -mv.z);

    // Profundidad de campo real: lo que cae fuera de la distancia de foco
    // se abre en círculo de confusión y pierde intensidad.
    vDesenfoque = clamp(abs(dist - uFoco) * 0.34 - 0.12, 0.0, 1.0);

    gl_Position = projectionMatrix * mv;
    gl_PointSize =
      uTam * uDpr
      * (0.5 + aSeed * 1.0)
      * (1.0 + lente * 0.8)
      * (1.0 + vDesenfoque * 2.4)
      * (3.4 / dist);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uGris;
  uniform vec3 uDorado;
  uniform float uAlfa;
  varying float vSenal;
  varying float vDesenfoque;
  varying float vSemilla;
  varying float vColumna;
  varying float vTerritorio;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d2 = dot(c, c);
    if (d2 > 0.25) discard;

    // Enfocada: núcleo duro. Desenfocada: disco blando, el bokeh.
    float dureza = mix(0.015, 0.21, vDesenfoque);
    float borde = smoothstep(0.25, dureza, d2);

    // Un tercio de las partículas lleva un halo tenue: rompe la uniformidad
    // de "todos los puntos son el mismo círculo".
    float halo = step(0.66, vSemilla) * smoothstep(0.25, 0.1, d2) * 0.35;

    vec3 color = mix(uGris, uDorado, smoothstep(0.0, 0.85, vSenal));
    color = mix(color, uGris, vTerritorio * 0.8);
    float a = (borde + halo) * uAlfa * (0.55 + vSenal * 0.85);
    a *= mix(1.0, 0.3, vDesenfoque);
    a *= 1.0 + vColumna * 1.6 - vTerritorio * 0.25;

    gl_FragColor = vec4(color, a);
  }
`;

/** Suelo de puntos: aparece con el orden y da horizonte a la escena. */
const VERT_SUELO = /* glsl */ `
  uniform float uDpr;
  uniform float uFoco;
  varying float vAlfa;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float dist = max(0.4, -mv.z);
    // Se apaga hacia los bordes: un suelo infinito se lee como papel tapiz.
    vAlfa = 1.0 - smoothstep(1.6, 4.6, length(position.xz));
    vAlfa *= 1.0 - clamp(abs(dist - uFoco) * 0.25, 0.0, 0.6);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = 2.2 * uDpr * (3.4 / dist);
  }
`;

const FRAG_SUELO = /* glsl */ `
  precision mediump float;
  uniform float uAlfa;
  varying float vAlfa;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    gl_FragColor = vec4(0.48, 0.6, 0.85, vAlfa * uAlfa);
  }
`;

/**
 * Billboard: el plano siempre mira a cámara porque se arma en espacio de
 * vista. Las esferas se ven igual desde cualquier ángulo, así que el truco
 * no se nota.
 */
const VERT_OBJETO = /* glsl */ `
  uniform float uTam;
  uniform float uFoco;
  varying vec2 vUv;
  varying float vDesenfoque;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    mv.xy += position.xy * uTam;
    vDesenfoque = clamp(abs(-mv.z - uFoco) * 0.5 - 0.1, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG_OBJETO = /* glsl */ `
  precision mediump float;
  uniform sampler2D uMapa;
  uniform float uAlfa;
  varying vec2 vUv;
  varying float vDesenfoque;
  void main() {
    // Desenfoque barato y suave: muestrear de un mipmap más pequeño.
    vec3 c = texture2D(uMapa, vUv, vDesenfoque * 2.5).rgb;
    // El "negro" del render nunca es 0: sin este corte, el cuadrado del
    // fondo se insinúa con la fusión aditiva.
    c = max(c - 0.05, 0.0) / 0.95;
    float borde = 1.0 - smoothstep(0.78, 0.98, length(vUv - 0.5) * 2.0);
    // Color premultiplicado y alfa 0: suma luz sin volver opaco el canvas,
    // que se compone sobre las capas de atmósfera del DOM.
    gl_FragColor = vec4(c * borde * uAlfa * mix(1.0, 0.6, vDesenfoque), 0.0);
  }
`;

const suave = (t: number) => t * t * (3 - 2 * t);

/**
 * Meseta: cada figura se sostiene armada durante la mitad de su tramo de
 * scroll y solo se transforma en la otra mitad. La cámara, en cambio, usa
 * el progreso crudo y nunca para: rodear una figura quieta es lo que la
 * revela como volumen.
 */
const meseta = (p: number) => {
  const i = Math.floor(p);
  return i + Math.max(0, Math.min(1, (p - i - 0.25) / 0.5));
};

const CampoParticulas = forwardRef<CampoHandle, { onListo?: () => void }>(
  function CampoParticulas({ onListo }, ref) {
    const contenedor = useRef<HTMLDivElement>(null);
    const api = useRef<{
      setProgreso: (p: number) => void;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      setProgreso: (p) => api.current?.setProgreso(p),
    }));

    useEffect(() => {
      const nodo = contenedor.current;
      if (!nodo) return;

      const reducido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Menos partículas donde hay menos GPU. Decidido por memoria y ancho,
      // no por user-agent, que miente.
      const memoria = (navigator as { deviceMemory?: number }).deviceMemory ?? 4;
      const angosto = window.innerWidth < 900;
      const N = angosto || memoria <= 4 ? 14000 : 42000;
      // Con un tercio de las partículas, la misma alfa deja las figuras
      // anémicas: compensamos parte de la densidad perdida.
      const densidad = N < 42000 ? 1.55 : 1;

      const escena = new THREE.Scene();
      const FOV = 34;
      const camara = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

      const render = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      render.setPixelRatio(dpr);
      render.setClearColor(0x000000, 0);
      nodo.appendChild(render.domElement);
      render.domElement.style.display = "block";
      render.domElement.style.width = "100%";
      render.domElement.style.height = "100%";

      const uniforms = {
        uMezcla: { value: 0 },
        uAvance: { value: 0 },
        uAcento: { value: 0 },
        uAlfa: { value: 0.42 },
        uFoco: { value: 4.5 },
        uRaton: { value: new THREE.Vector2(9, 9) },
        uAspecto: { value: 1 },
        uLente: { value: 0.26 },
        uTiempo: { value: 0 },
        uTam: { value: angosto ? 3.0 : 3.7 },
        uDpr: { value: dpr },
        uGris: { value: new THREE.Color("#a9bfe4") },
        uDorado: { value: new THREE.Color("#d6b45f") },
      };

      const material = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const geo = new THREE.BufferGeometry();
      const semillas = new Float32Array(N);
      const acentos = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        semillas[i] = Math.random();
        acentos[i] = i < Math.floor(N * EN_COLUMNAS) ? 1 : 0;
      }
      geo.setAttribute("aSeed", new THREE.BufferAttribute(semillas, 1));
      geo.setAttribute("aAcento", new THREE.BufferAttribute(acentos, 1));

      // ── Suelo ────────────────────────────────────────────────────
      const PASO = 0.2;
      const suelo: number[] = [];
      for (let x = -5; x <= 5 + 1e-6; x += PASO)
        for (let z = -5; z <= 3.6 + 1e-6; z += PASO)
          suelo.push(x, PISO - 0.01, z);
      const geoSuelo = new THREE.BufferGeometry();
      geoSuelo.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(suelo), 3)
      );
      const uSuelo = {
        uAlfa: { value: 0 },
        uDpr: uniforms.uDpr,
        uFoco: uniforms.uFoco,
      };
      const matSuelo = new THREE.ShaderMaterial({
        vertexShader: VERT_SUELO,
        fragmentShader: FRAG_SUELO,
        uniforms: uSuelo,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      escena.add(new THREE.Points(geoSuelo, matSuelo));

      // ── Objetos 3D ───────────────────────────────────────────────
      const geoPlano = new THREE.PlaneGeometry(1, 1);
      const cargador = new THREE.TextureLoader();
      const texturas = new Map<string, THREE.Texture>();
      const objetos = OBJETOS.map((o) => {
        let tex = texturas.get(o.img);
        if (!tex) {
          tex = cargador.load(`/images/3d/${o.img}.webp`);
          tex.anisotropy = 4;
          texturas.set(o.img, tex);
        }
        const mat = new THREE.ShaderMaterial({
          vertexShader: VERT_OBJETO,
          fragmentShader: FRAG_OBJETO,
          uniforms: {
            uMapa: { value: tex },
            uTam: { value: o.tam },
            uAlfa: { value: 0 },
            uFoco: uniforms.uFoco,
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
        const malla = new THREE.Mesh(geoPlano, mat);
        malla.position.set(...o.pos);
        malla.frustumCulled = false;
        escena.add(malla);
        return { malla, mat, o };
      });

      let etapas: Float32Array[] = [];
      let puntos: THREE.Points | null = null;
      let vivo = true;
      let bruto = 0;

      // Cámara: posición y objetivo según el progreso, más el ratón.
      const pos = new THREE.Vector3();
      const mira = new THREE.Vector3();
      const raton = { x: 0, y: 0, ox: 0, oy: 0 };
      let alejar = 1;

      const colocarCamara = (p: number, t: number) => {
        const max = CAMARA.length - 1;
        const c = Math.max(0, Math.min(max, p));
        const i = Math.min(Math.floor(c), max - 1);
        const s = suave(c - i);
        const a = CAMARA[i];
        const b = CAMARA[i + 1];
        mira.set(
          a.mira[0] + (b.mira[0] - a.mira[0]) * s,
          a.mira[1] + (b.mira[1] - a.mira[1]) * s,
          a.mira[2] + (b.mira[2] - a.mira[2]) * s
        );
        pos.set(
          a.pos[0] + (b.pos[0] - a.pos[0]) * s,
          a.pos[1] + (b.pos[1] - a.pos[1]) * s,
          a.pos[2] + (b.pos[2] - a.pos[2]) * s
        );
        // En pantallas angostas la cámara retrocede para que el conjunto
        // quepa a lo ancho.
        pos.sub(mira).multiplyScalar(alejar).add(mira);

        // Respiración lenta y paralaje del ratón: la escena nunca se queda
        // congelada y responde a la mano.
        pos.x += Math.sin(t * 0.11) * 0.22 + raton.ox * 0.5;
        pos.y += Math.cos(t * 0.083) * 0.09 + raton.oy * 0.3;

        camara.position.copy(pos);
        camara.lookAt(mira);
        uniforms.uFoco.value = pos.distanceTo(mira);
      };

      const aplicarEtapa = (p: number) => {
        if (!etapas.length) return;
        const max = etapas.length - 1;
        const c = Math.max(0, Math.min(max, p));
        const i = Math.min(Math.floor(c), max - 1);
        const t = c - i;
        const s = suave(t);

        const from = geo.getAttribute("aFrom") as THREE.BufferAttribute;
        const to = geo.getAttribute("aTo") as THREE.BufferAttribute;
        if (from.array !== etapas[i]) {
          from.array.set(etapas[i]);
          from.needsUpdate = true;
        }
        if (to.array !== etapas[i + 1]) {
          to.array.set(etapas[i + 1]);
          to.needsUpdate = true;
        }
        // Suavizado tipo smoothstep: las etapas se asientan, no se cortan.
        uniforms.uMezcla.value = s;
        uniforms.uAvance.value = Math.pow(c / max, 1.35);
        uniforms.uAcento.value = suave(Math.max(0, 1 - Math.abs(c - 3)));
        // Cada etapa ocupa un volumen distinto. La alfa va atada a esa
        // densidad real, no a una rampa: si no, el caos no se ve o las
        // barras finales saturan el canal y viran a oliva.
        const ALFA = [0.32, 0.24, 0.3, 0.16, 0.17];
        uniforms.uAlfa.value = (ALFA[i] + (ALFA[i + 1] - ALFA[i]) * s) * densidad;

        // El suelo aparece cuando las partículas empiezan a apoyarse en él.
        const SUELO = [0, 0.12, 0.5, 0.55, 0.25];
        uSuelo.uAlfa.value = SUELO[i] + (SUELO[i + 1] - SUELO[i]) * s;

        objetos.forEach(({ mat, o }) => {
          mat.uniforms.uAlfa.value = o.vis[i] + (o.vis[i + 1] - o.vis[i]) * s;
        });
      };

      api.current = {
        setProgreso: (p) => {
          bruto = p;
          aplicarEtapa(meseta(p));
        },
      };

      const redimensionar = () => {
        const w = nodo.clientWidth;
        const h = nodo.clientHeight;
        if (!w || !h) return;
        render.setSize(w, h, false);
        camara.aspect = w / h;
        // El texto ocupa el tercio inferior (casi la mitad en vertical):
        // corremos el encuadre para que la escena se centre en el espacio
        // que queda libre arriba.
        const vertical = w / h < 0.8;
        camara.setViewOffset(w, h, 0, h * (vertical ? 0.19 : 0.11), w, h);
        camara.updateProjectionMatrix();
        uniforms.uAspecto.value = w / h;
        alejar = Math.max(1, Math.pow(1.25 / (w / h), 0.55));
        // Más lejos, los puntos se achican: los agrandamos en parte.
        uniforms.uTam.value = (angosto ? 3.0 : 3.7) * Math.pow(alejar, 0.6);
      };

      const alMover = (e: PointerEvent) => {
        const r = nodo.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
        uniforms.uRaton.value.set(nx, ny);
        raton.x = nx;
        raton.y = ny;
      };
      const alSalir = () => {
        uniforms.uRaton.value.set(9, 9);
        raton.x = 0;
        raton.y = 0;
      };

      let bucle = 0;
      let anterior = performance.now();

      const dibujar = (ahora: number) => {
        if (!vivo) return;
        // dt topado: al volver de una pestaña en segundo plano, el primer
        // delta es enorme y todo pegaría un salto.
        const dt = Math.min(40, ahora - anterior) / 1000;
        anterior = ahora;
        const t = (uniforms.uTiempo.value += dt);

        // El paralaje del ratón persigue al puntero con retardo: inercia.
        const k = 1 - Math.pow(0.04, dt);
        raton.ox += (raton.x - raton.ox) * k;
        raton.oy += (raton.y - raton.oy) * k;

        colocarCamara(bruto, t);

        // Los objetos flotan, cada uno a su ritmo.
        objetos.forEach(({ malla, o }, i) => {
          malla.position.y = o.pos[1] + Math.sin(t * 0.35 + i * 1.7) * 0.06;
        });

        render.render(escena, camara);
        bucle = requestAnimationFrame(dibujar);
      };

      (async () => {
        const silueta: Silueta = await fetch("/data/peru-silueta.json").then(
          (r) => r.json()
        );
        if (!vivo) return;

        etapas = [
          caos(N),
          grupos(N),
          histograma(N),
          mapaPeru(N, silueta),
          resultado(N),
        ];

        geo.setAttribute(
          "aFrom",
          new THREE.BufferAttribute(new Float32Array(etapas[0]), 3)
        );
        geo.setAttribute(
          "aTo",
          new THREE.BufferAttribute(new Float32Array(etapas[1]), 3)
        );
        geo.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(N * 3), 3)
        );
        geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 5);

        puntos = new THREE.Points(geo, material);
        escena.add(puntos);

        redimensionar();

        if (reducido) {
          // Versión estática digna: el resultado ya formado, sin movimiento.
          const from = geo.getAttribute("aFrom") as THREE.BufferAttribute;
          const to = geo.getAttribute("aTo") as THREE.BufferAttribute;
          from.array.set(etapas[4]);
          to.array.set(etapas[4]);
          from.needsUpdate = true;
          to.needsUpdate = true;
          aplicarEtapa(4);
          colocarCamara(4, 0);
          // Las texturas llegan después del primer pintado.
          THREE.DefaultLoadingManager.onLoad = () =>
            vivo && render.render(escena, camara);
          render.render(escena, camara);
        } else {
          aplicarEtapa(meseta(bruto));
          bucle = requestAnimationFrame(dibujar);
          window.addEventListener("pointermove", alMover, { passive: true });
          nodo.addEventListener("pointerleave", alSalir);
        }

        onListo?.();
      })();

      window.addEventListener("resize", redimensionar);

      return () => {
        vivo = false;
        cancelAnimationFrame(bucle);
        window.removeEventListener("resize", redimensionar);
        window.removeEventListener("pointermove", alMover);
        nodo.removeEventListener("pointerleave", alSalir);
        geo.dispose();
        material.dispose();
        geoSuelo.dispose();
        matSuelo.dispose();
        geoPlano.dispose();
        objetos.forEach(({ mat }) => mat.dispose());
        texturas.forEach((t) => t.dispose());
        render.dispose();
        if (render.domElement.parentNode === nodo)
          nodo.removeChild(render.domElement);
      };
    }, [onListo]);

    return <div ref={contenedor} className="absolute inset-0" />;
  }
);

export default CampoParticulas;
