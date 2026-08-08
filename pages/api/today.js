// pages/api/today.js
import { readRange } from "../../lib/googleSheets";
import { SHEETS, DATA_START_ROW } from "../../lib/constants";
import { findAgentByMatricule } from "../../lib/agents";

export default async function handler(req, res) {
  try {
    // Lire toutes les manoeuvres
    const data = await readRange(SHEETS.MANOEUVRES, `A${DATA_START_ROW}:B500`);
    
    const allManoeuvres = [];
    if (data && Array.isArray(data)) {
      for (const row of data) {
        if (row[0] && row[1]) {
          allManoeuvres.push(row[1]); // Colonne B = nom de la manoeuvre
        }
      }
    }

    const todayDate = new Date().toLocaleDateString("fr-FR");
    const todayManoeuvre = null; // Pas de manoeuvre du jour par défaut

    res.status(200).json({
      today: todayDate,
      hasTodayManoeuvre: false,
      manoeuvre: todayManoeuvre,
      allManoeuvres: allManoeuvres,
    });
  } catch (err) {
    console.error("Erreur today:", err);
    res.status(500).json({ error: err.message });
  }
}
