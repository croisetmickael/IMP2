// pages/api/today.js
import { readRange, rangeFor } from "../../lib/googleSheets";
import { SHEETS, DATA_START_ROW, todayFR } from "../../lib/constants";

export default async function handler(req, res) {
  try {
    // Lire toutes les manœuvres du calendrier
    const manoeuvresRows = await readRange(
      rangeFor(SHEETS.MANOEUVRES, `A${DATA_START_ROW}:D500`)
    );

    const today = todayFR();

    // Chercher la manœuvre du jour
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

    // Pas de manœuvre du jour → retourner toutes les manœuvres du calendrier
    const allManoeuvres = manoeuvresRows
      .map((r) => ({
        date: r[0] ? String(r[0]).trim() : "",
        manoeuvre: r[1] ? String(r[1]).trim() : "",
        lieu: r[2] ? String(r[2]).trim() : "",
      }))
      .filter((m) => m.manoeuvre && m.date);

    res.status(200).json({
      hasTodayManoeuvre: false,
      allManoeuvres: allManoeuvres,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
