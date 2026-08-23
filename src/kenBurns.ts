// Ken Burns partagé : zoom doux + travelling (pan) sur un média `objectFit: cover`.
//
// Pourquoi animer `objectPosition` plutôt que `translateX` ?
// Un clip large (16:9) dans un cadre vertical (9:16) est massivement rogné sur
// les côtés par `cover`. Faire glisser `objectPosition` de gauche à droite
// déplace la FENÊTRE de crop à l'intérieur du média : on révèle les côtés
// coupés, ce qui aide à "comprendre" la scène. C'est intrinsèquement sûr —
// 0%..100% = bords réels du média, jamais de bord vide — quel que soit le
// ratio de la source (un média non-large n'a simplement pas de marge sur cet
// axe → le pan y est un no-op, aucun risque). Le zoom (`scale`) reste sur le
// wrapper parent et ne fait qu'ajouter de la marge, jamais révéler un bord.

export type KenBurnsOpts = {
  /** frame LOCALE du plan (useCurrentFrame dans une Series.Sequence). */
  frame: number;
  /** durée du plan en frames (useVideoConfig().durationInFrames dans la sequence). */
  durationInFrames: number;
  /** point d'intérêt 0..1 (recadrage intelligent). Le pan est centré dessus. */
  focalX?: number;
  focalY?: number;
  /** index du plan → alterne le sens du travelling (évite la monotonie). */
  seed?: number;
  /** zoom de début / fin. */
  zoomFrom?: number;
  zoomTo?: number;
  /** amplitude du travelling horizontal / vertical (fraction de 0..1). */
  panX?: number;
  panY?: number;
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function kenBurns(o: KenBurnsOpts): { scale: number; objectPosition: string } {
  const {
    frame,
    durationInFrames,
    focalX = 0.5,
    focalY = 0.5,
    seed = 0,
    zoomFrom = 1.05,
    zoomTo = 1.12,
    panX = 0.15,
    panY = 0.05,
  } = o;

  const d = Math.max(1, durationInFrames);
  const p = clamp01(frame / d); // progression 0..1 du plan

  const scale = zoomFrom + (zoomTo - zoomFrom) * p;

  // Sens du travelling : plans pairs → gauche→droite, impairs → droite→gauche.
  const dir = seed % 2 === 0 ? 1 : -1;

  // Fenêtre de départ/arrivée centrée sur le focal, bornée à [0,1].
  const xa = clamp01(focalX - (dir * panX) / 2);
  const xb = clamp01(focalX + (dir * panX) / 2);
  const ya = clamp01(focalY - (dir * panY) / 2);
  const yb = clamp01(focalY + (dir * panY) / 2);

  const px = (xa + (xb - xa) * p) * 100;
  const py = (ya + (yb - ya) * p) * 100;

  return { scale, objectPosition: `${px}% ${py}%` };
}
