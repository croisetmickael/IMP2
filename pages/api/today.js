// pages/api/today.js
import { readRange, rangeFor } from "../../lib/googleSheets";
import { SHEETS, DATA_START_ROW, todayFR } from "../../lib/constants";

export default async function handler(req, res) {
  try {
    // 1. Chercher la manœuvre du jour dans Manoeuvres
    const manoeuvresRows = await readRange(
      rangeFor(SHEETS.MANOEUVRES, `A${DATA_START_ROW}:D200`)
    );

    const today = todayFR();
    const todayManoeuvre = manoeuvresRows.find(
      (r) => r[0] && String(r[0]).trim() === today
    );

    if (todayManoeuvre) {
      return res.status(200).json({
        hasTodayManoeuvre: true,
        manoeuvre: String(todayManoeuvre[1] || "").trim(),
        lieu: String(todayManoeuvre[2] || "").trim(),
      });
    }

    // 2. Pas de manœuvre du jour → retourner toutes les manœuvres passées (depuis Suivi)
    const suiviRows = await readRange(
      rangeFor(SHEETS.SUIVI, `D${DATA_START_ROW}:D5000`)
    );

    const pastManoeuvres = [
      ...new Set(
        suiviRows
          .map((r) => r[0] ? String(r[0]).trim() : "")
          .filter((m) => m && m !== "")
      ),
    ];

    res.status(200).json({
      hasTodayManoeuvre: false,
      pastManoeuvres: pastManoeuvres,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
