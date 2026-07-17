// pages/api/inventaire.js
import { readRange, rangeFor } from "../../lib/googleSheets";
import { INVENTORY_LOCATIONS, INVENTORY_DATA_START_ROW } from "../../lib/constants";

// L'inventaire est reparti sur un onglet par caisse / emplacement (voir
// INVENTORY_LOCATIONS). On lit chaque onglet et on fusionne en une seule
// liste, taguee par son emplacement d'origine.

export default async function handler(req, res) {
  try {
    const results = await Promise.all(
      INVENTORY_LOCATIONS.map(async ({ sheet, label }) => {
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
          // Un onglet renomme/absent ne doit pas casser toute la liste.
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
