// lib/agents.js
import { readRange } from "./googleSheets";
import { SHEETS, DATA_START_ROW } from "./constants";

export async function findAgentByMatricule(matricule) {
  try {
    const rows = await readRange(SHEETS.AGENTS, `A${DATA_START_ROW}:D500`);
    
    for (const row of rows) {
      if (row[0] && String(row[0]).trim() === String(matricule).trim()) {
        return {
          matricule: row[0],
          prenom: row[1] || "",
          nom: row[2] || "",
          nomComplet: `${row[2] || ""} ${row[1] || ""}`.trim(),
        };
      }
    }
    return null;
  } catch (err) {
    console.error("Erreur findAgentByMatricule:", err);
    return null;
  }
}
