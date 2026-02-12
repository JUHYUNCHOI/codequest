/* Theme constants and translation helper */

export const C = {
  // Base
  bg: "#f3f0ff",
  card: "#fff",
  text: "#1e293b",
  dim: "#8891aa",
  dimLight: "#c4c9d6",
  border: "#e2e4ec",
  codeBg: "#1e1b2e",

  // Accent (purple)
  accent: "#7c5cfc",
  accentBg: "#ede9fe",
  accentBd: "#c4b5fd",

  // OK (green)
  ok: "#16a34a",
  okBg: "#dcfce7",
  okBd: "#86efac",

  // No (red)
  no: "#dc2626",
  noBg: "#fee2e2",
  noBd: "#fca5a5",

  // Carry (orange)
  carry: "#ea580c",
  carryBg: "#fff7ed",
  carryBd: "#fdba74",

  // Bessie (pink)
  bessie: "#db2777",
  bessieBg: "#fdf2f8",
  bessieBd: "#fbcfe8",

  // Elsie (teal-green)
  elsie: "#0d9488",
  elsieBg: "#f0fdfa",
  elsieBd: "#99f6e4",

  // Look (blue)
  look: "#2563eb",
  lookBg: "#eff6ff",
  lookBd: "#93c5fd",
};

export function t(isEn, en, ko) { return isEn ? en : ko; }
