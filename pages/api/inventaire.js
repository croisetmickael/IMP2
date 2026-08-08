// pages/api/inventaire.js
import { readRange } from "../../lib/googleSheets";
import { parseInventaireComplet } from "../../lib/inventoryParser";
import { SHEETS, INVENTORY_DATA_START_ROW } from "../../lib/constants";

const INVENTORY_MAPPING = {
  baroud: "SAC BAROUD",
  abordage: "Copie de SAC ABORDAGE",
  vehicule: ["COTE GAUCHE", "COTE DROIT", "ARRIERE", "TOURET"],
  caisses: ["CAISSE N°1", "CAISSE N°2", "CAISSE N°3", "CAISSE N°4", "CAISSE N°5", "CAISSE N°6", "CAISSE N°7", "CAISSE N°8", "CAISSE N°9", "CAISSE N°10", "CAISSE N°11", "CAISSE N°12", "CAISSE N°13", "CAISSE N°14"],
};

export default async function handler(req, res) {
  try {
    const { group } = req.query;

    if (!group) {
      return res.status(400).json({ error: "groupe manquant" });
    }

    const tabName = INVENTORY_MAPPING[group];
    if (!tabName) {
      return res.status(400).json({ error: "groupe invalide" });
    }

    // Gérer les groupes avec plusieurs tabs
    const tabs = Array.isArray(tabName) ? tabName : [tabName];
    let allItems = [];

    for (const tab of tabs) {
      try {
        const data = await readRange(tab, `A${INVENTORY_DATA_START_ROW}:C500`);
        const items = parseInventaireComplet(data);
        allItems = allItems.concat(items);
      } catch (err) {
        console.warn(`Erreur lecture ${tab}:`, err.message);
      }
    }

    res.status(200).json({ items: allItems });
  } catch (err) {
    console.error("Erreur inventaire:", err);
    res.status(500).json({ error: err.message });
  }
}
