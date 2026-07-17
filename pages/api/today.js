// pages/api/today.js
import { readRange } from "../../lib/googleSheets";
import { SHEETS, DATA_START_ROW, todayFR } from "../../lib/constants";

export default async function handler(req, res) {
  try {
    const rows = await readRange(
      `${SHEETS.MANOEUVRES}!A${DATA_START_ROW}:D2000`
    );
    const today = todayFR();

    let intervention = null;
    let manoeuvreDuJour = null;

    for (const row of rows) {
      const [date, lieu, gps, observation] = row;
      if (!lieu) continue;
      if (lieu.trim().toUpperCase() === "INTERVENTION") {
        intervention = { date: today, lieu: "INTERVENTION" };
      } else if (date === today) {
        manoeuvreDuJour = { date: today, lieu, gps: gps || "", observation: observation || "" };
      }
    }

    res.status(200).json({ today, intervention, manoeuvreDuJour });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
