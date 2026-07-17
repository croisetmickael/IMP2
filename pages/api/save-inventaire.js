// pages/api/save-inventaire.js
import { appendRow } from "../../lib/googleSheets";
import { findAgentByMatricule } from "../../lib/agents";
import { SHEETS, todayFR, nowHeureFR } from "../../lib/constants";

// Colonnes reelles de l'onglet "Suivi_inventaire" :
// A Date | B Heures | C Agent | D Inventaire | E Observation
// 
// On ne sauvegarde que les articles "Non OK" dans la colonne Inventaire.
// Le matricule sert a identifier l'agent (verification dans l'onglet Agents),
// mais seul son nom resolu est ecrit dans la feuille.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Methode non autorisee" });
  }
  try {
    const { matricule, itemsNonOk, observation } = req.body;

    const agent = await findAgentByMatricule(matricule);
    if (!agent) {
      return res
        .status(200)
        .json({ ok: false, error: "Matricule inconnu. Vérifie le numéro saisi." });
    }

    // On ne sauvegarde que les articles Non OK
    const nonOkList = (itemsNonOk || []).join(", ");

    await appendRow(SHEETS.SUIVI_INVENTAIRE, [
      todayFR(),
      nowHeureFR(),
      agent.nomComplet,
      nonOkList,
      observation || "",
    ]);

    res.status(200).json({ ok: true, agent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
