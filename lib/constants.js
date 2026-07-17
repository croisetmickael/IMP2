// lib/constants.js

export const SHEETS = {
  MANOEUVRES: "Manoeuvres",
  AGENTS: "Agents",
  ACTION: "Action",
  SUIVI: "Suivi",
  SUIVI_INVENTAIRE: "Suivi_inventaire",
};

// L'inventaire n'est pas un onglet unique : chaque caisse / emplacement a
// son propre onglet (meme mise en page : titre, astuce, en-tete ligne 3,
// donnees a partir de la ligne 4, colonnes ARTICLE / QUANTITE).
// "label" est le nom affiche dans l'appli (plus lisible que le nom de
// l'onglet quand celui-ci a un prefixe genere par Sheets, ex. "Copie de").
export const INVENTORY_LOCATIONS = [
  { sheet: "CAISSE N°1", label: "CAISSE N°1" },
  { sheet: "CAISSE N°2", label: "CAISSE N°2" },
  { sheet: "CAISSE N°3", label: "CAISSE N°3" },
  { sheet: "CAISSE N°4", label: "CAISSE N°4" },
  { sheet: "CAISSE N°5", label: "CAISSE N°5" },
  { sheet: "CAISSE N°6", label: "CAISSE N°6" },
  { sheet: "CAISSE N°7", label: "CAISSE N°7" },
  { sheet: "CAISSE N°8", label: "CAISSE N°8" },
  { sheet: "CAISSE N°9", label: "CAISSE N°9" },
  { sheet: "CAISSE N°10", label: "CAISSE N°10" },
  { sheet: "CAISSE N°11", label: "CAISSE N°11" },
  { sheet: "CAISSE N°12 (LOG)", label: "CAISSE N°12 (LOG)" },
  { sheet: "CAISSE N°13", label: "CAISSE N°13" },
  { sheet: "CAISSE N°14", label: "CAISSE N°14" },
  { sheet: "COTE GAUCHE", label: "CÔTÉ GAUCHE" },
  { sheet: "COTE DROIT", label: "CÔTÉ DROIT" },
  { sheet: "ARRIERE", label: "ARRIÈRE" },
  { sheet: "TOURET", label: "TOURET" },
  { sheet: "SAC BAROUD", label: "SAC BAROUD" },
  { sheet: "Copie de SAC ABORDAGE", label: "SAC ABORDAGE" },
];

export const INVENTORY_DATA_START_ROW = 4;

// Les 4 onglets existants ont un titre (ligne 1-2) puis un en-tete ligne 4,
// les donnees commencent donc ligne 5. Les 2 nouveaux onglets suivent la
// meme convention pour rester coherents visuellement.
export const DATA_START_ROW = 5;

export function todayFR() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function nowHeureFR() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mi}:${ss}`;
}
