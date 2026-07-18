// pages/api/save-inventaire.js
import { appendRow } from "../../lib/googleSheets";
import { findAgentByMatricule } from "../../lib/agents";
import { SHEETS, todayFR, nowHeureFR } from "../../lib/constants";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Methode non autorisee" });
  }
  try {
    const { matricule, itemsNonOk, observation } = req.body;

    console.log("Save inventaire reçu:", { matricule, itemsNonOk, observation });

    const agent = await findAgentByMatricule(matricule);
    if (!agent) {
      return res
        .status(200)
        .json({ ok: false, error: "Matricule inconnu. Vérifie le numéro saisi." });
    }

    // Joindre les items Non OK
    const nonOkText = itemsNonOk && itemsNonOk.length > 0 ? itemsNonOk.join(" | ") : "";

    console.log("Enregistrement:", {
      date: todayFR(),
      heure: nowHeureFR(),
      agent: agent.nomComplet,
      nonOk: nonOkText,
      observation: observation || "",
    });

    await appendRow(SHEETS.SUIVI_INVENTAIRE, [
      todayFR(),
      nowHeureFR(),
      agent.nomComplet,
      nonOkText,
      observation || "",
    ]);

    console.log("Enregistrement réussi");

    res.status(200).json({ ok: true, agent });
  } catch (err) {
    console.error("Erreur save-inventaire:", err);
    res.status(500).json({ error: err.message });
  }
}
