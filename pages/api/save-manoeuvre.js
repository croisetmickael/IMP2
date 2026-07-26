// pages/api/save-manoeuvre.js
import { appendRow, appendRowToSpreadsheet } from "../../lib/googleSheets";
import { findAgentByMatricule } from "../../lib/agents";
import { SHEETS, SECOND_SPREADSHEET_ID, SECOND_SPREADSHEET_SHEET, todayFR, nowHeureFR } from "../../lib/constants";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Methode non autorisee" });
  }
  try {
    const { matricule, action, roles, observation } = req.body;

    console.log("Save manoeuvre reçu:", { matricule, action, roles, observation });

    const agent = await findAgentByMatricule(matricule);
    if (!agent) {
      return res
        .status(200)
        .json({ ok: false, error: "Matricule inconnu. Vérifie le numéro saisi." });
    }

    const rolesText = roles && roles.length > 0 ? roles.join(" / ") : "";

    const date = todayFR();
    const heure = nowHeureFR();

    console.log("Enregistrement manoeuvre:", {
      date,
      heure,
      agent: agent.nomComplet,
      action,
      roles: rolesText,
      observation: observation || "",
    });

    // 1️⃣ Enregistrer dans le Sheet 1 "Suivi"
    await appendRow(SHEETS.SUIVI, [
      date,
      heure,
      agent.nomComplet,
      action,
      "",
      "",
      rolesText,
      observation || "",
    ]);

    console.log("✅ Enregistrement dans Sheet 1 réussi");

    // 2️⃣ Enregistrer aussi dans le Sheet 2 "Suivi"
    await appendRowToSpreadsheet(
      SECOND_SPREADSHEET_ID,
      SECOND_SPREADSHEET_SHEET,
      [
        date,
        heure,
        agent.nomComplet,
        action,
        "",
        "",
        rolesText,
        observation || "",
      ]
    );

    console.log("✅ Enregistrement dans Sheet 2 réussi");

    res.status(200).json({ ok: true, agent });
  } catch (err) {
    console.error("Erreur save-manoeuvre:", err);
    res.status(500).json({ error: err.message });
  }
}
