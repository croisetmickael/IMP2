// pages/api/inventaire.js
import { readRange, rangeFor } from "../../lib/googleSheets";
import { INVENTORY_GROUPS, INVENTORY_DATA_START_ROW } from "../../lib/constants";

export default async function handler(req, res) {
  try {
    const { group } = req.query;

    // Si un groupe est spécifié, ne lire que ses emplacements
    const groupConfig = group
      ? INVENTORY_GROUPS.find((g) => g.id === group)
      : null;
    
    if (group && !groupConfig) {
      return res.status(400).json({ error: "Groupe d'inventaire invalide" });
    }

    const locationsToRead = groupConfig
      ? groupConfig.locations
      : INVENTORY_GROUPS.flatMap((g) => g.locations);

    const results = await Promise.all(
      locationsToRead.map(async ({ sheet, label }) => {
        try {
          const rows = await readRange(
            rangeFor(sheet, `A${INVENTORY_DATA_START_ROW}:B500`)
          );
          return rows
            .filter((r) => r[0] && String(r[0]).trim() !== "")
            .map((r) => ({
              article: String(r[0]).trim(),
              quantite: r[1] !== undefined && r[1] !== null ? String(r[1]) : "",
              emplacement: label,
            }));
        } catch (err) {
          console.error(`Inventaire: onglet "${sheet}" illisible —`, err.message);
          return [];
        }
      })
    );

    const items = results.flat();
    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
