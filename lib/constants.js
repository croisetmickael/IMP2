// lib/constants.js
export const SHEETS = {
  AGENTS: "Agents",
  ACTIONS: "Action",
  MANOEUVRES: "Manoeuvres",
  SUIVI: "Suivi",
  SUIVI_INVENTAIRE: "Suivi_inventaire",
};

export const SECOND_SPREADSHEET_ID = "1LxrTCAKKxvYYCg6tbfz1abP6VAar9WrLJ0RwhzjYCXA";
export const SECOND_SPREADSHEET_SHEET = "Suivi";

export const DATA_START_ROW = 5;
export const INVENTORY_DATA_START_ROW = 4;

export const INVENTORY_GROUPS = [
  { id: "baroud", label: "Baroud" },
  { id: "abordage", label: "Abordage" },
  { id: "vehicule", label: "Véhicule" },
  { id: "caisses", label: "Caisses" },
];

export function todayFR() {
  const formatter = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}

export function nowHeureFR() {
  const formatter = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/Paris",
  });
  return formatter.format(new Date());
}
