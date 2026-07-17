// pages/api/save-inventaire.js
import { appendRow } from "../../lib/googleSheets";
import { findAgentByMatricule } from "../../lib/agents";
import { SHEETS, todayFR, nowHeureFR } from "../../lib/constants";

// Colonnes reelles de l'onglet "Suivi_inventaire" :
// A Date | B Heures | C Agent | D Inventaire (recap OK / Non OK) | E Observation

function buildSummary(itemsOk, itemsNonOk) {
  const parts = [];
  if (itemsOk && itemsOk.length) parts.push(`OK : ${itemsOk.join(", ")}`);
  if (itemsNonOk && itemsNonOk.length)
    parts.push(`NON OK : ${itemsNonOk.join(", ")}`);
  return parts.join(" — ");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Methode non autorisee" });
  }
  try {
    const { matricule, itemsOk, itemsNonOk, observation } = req.body;

    const agent = await findAgentByMatricule(matricule);
    if (!agent) {
      return res
        .status(200)
        .json({ ok: false, error: "Matricule inconnu. Vérifie le numéro saisi." });
    }

    await appendRow(SHEETS.SUIVI_INVENTAIRE, [
      todayFR(),
      nowHeureFR(),
      agent.nomComplet,
      buildSummary(itemsOk, itemsNonOk),
      observation || "",
    ]);

    res.status(200).json({ ok: true, agent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
