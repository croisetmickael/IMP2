// lib/constants.js

export const SHEETS = {
  MANOEUVRES: "Manoeuvres",
  AGENTS: "Agents",
  ACTION: "Action",
  SUIVI: "Suivi",
  SUIVI_INVENTAIRE: "Suivi_inventaire",
};

// Pour Manoeuvres, Agents, Action, Suivi : titre (1-2) + en-tete (4) + donnees (5+)
export const DATA_START_ROW = 5;

// Pour Inventaire (par caisse) : titre (1-2) + en-tete (3) + donnees (4+)
export const INVENTORY_DATA_START_ROW = 4;

// Inventaire organisé par groupes (ordre d'affichage : Baroud, Abordage, Vehicule, Caisses)
export const INVENTORY_GROUPS = [
  {
    id: "baroud",
    label: "Baroud",
    locations: [
      { sheet: "SAC BAROUD", label: "SAC BAROUD" },
    ],
  },
  {
    id: "abordage",
    label: "Abordage",
    locations: [
      { sheet: "Copie de SAC ABORDAGE", label: "SAC ABORDAGE" },
    ],
  },
  {
    id: "vehicule",
    label: "Véhicule",
    locations: [
      { sheet: "COTE GAUCHE", label: "CÔTÉ GAUCHE" },
      { sheet: "COTE DROIT", label: "CÔTÉ DROIT" },
      { sheet: "ARRIERE", label: "ARRIÈRE" },
      { sheet: "TOURET", label: "TOURET" },
    ],
  },
  {
    id: "caisses",
    label: "Caisses",
    locations: [
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
    ],
  },
];

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
