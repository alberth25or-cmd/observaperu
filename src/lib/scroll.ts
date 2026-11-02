/**
 * Un único bucle de scroll para toda la página.
 *
 * Con un listener por componente, veinte elementos animados son veinte
 * callbacks compitiendo por el mismo frame. Aquí todos se suscriben a un
 * solo listener que reparte el trabajo dentro de un requestAnimationFrame.
 */
type Suscriptor = (scrollY: number) => void;

const suscriptores = new Set<Suscriptor>();
let pendiente = false;
let iniciado = false;

function despachar() {
  pendiente = false;
  const y = window.scrollY;
  suscriptores.forEach((fn) => fn(y));
}

function alHacerScroll() {
  if (!pendiente) {
    pendiente = true;
    requestAnimationFrame(despachar);
  }
}

export function suscribirScroll(fn: Suscriptor): () => void {
  suscriptores.add(fn);

  if (!iniciado) {
    iniciado = true;
    window.addEventListener("scroll", alHacerScroll, { passive: true });
    window.addEventListener("resize", alHacerScroll, { passive: true });
  }

  fn(window.scrollY);

  return () => {
    suscriptores.delete(fn);
  };
}

export function movimientoReducido(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
