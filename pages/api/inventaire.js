// pages/api/inventaire.js
import { readRange, rangeFor } from "../../lib/googleSheets";
import { INVENTORY_GROUPS, INVENTORY_DATA_START_ROW } from "../../lib/constants";
import { google } from "googleapis";

// Lit l'inventaire depuis un Sheet externe (INVENTORY_SPREADSHEET_ID),
// ou depuis les 20 onglets du Sheet principal si INVENTORY_SPREADSHEET_ID est absent.

function getAuthAndClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  if (!email || !key) {
    throw new Error(
      "Variables GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY manquantes."
    );
  }

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return { auth, sheets: google.sheets({ version: "v4", auth }) };
}

export default async function handler(req, res) {
  try {
    const { group } = req.query;
    const inventorySheetId = process.env.INVENTORY_SPREADSHEET_ID;
    const mainSheetId = process.env.SPREADSHEET_ID;

    // Si un Sheet d'inventaire externe est configué, l'utiliser
    if (inventorySheetId) {
      return handleExternalSheet(inventorySheetId, group, res);
    } else {
      // Sinon, lire depuis les 20 onglets du Sheet principal
      return handleMainSheet(mainSheetId, group, res);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function handleExternalSheet(sheetId, group, res) {
  try {
    const { auth, sheets } = getAuthAndClient();
    const groupConfig = group
      ? INVENTORY_GROUPS.find((g) => g.id === group)
      : null;

    if (group && !groupConfig) {
      return res.status(400).json({ error: "Groupe d'inventaire invalide" });
    }

    // Lire tout l'onglet d'inventaire
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "'INVENTAIRE COMPLET'!A1:B2000",
    });

    const rows = response.data.values || [];
    const items = parseInventaireComplet(rows, group, groupConfig);

    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function handleMainSheet(sheetId, group, res) {
  try {
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

function parseInventaireComplet(rows, groupFilter, groupConfig) {
  // Parse l'onglet "INVENTAIRE COMPLET" : section titles (merged) + articles + quantites

  const targetLocations = groupConfig
    ? groupConfig.locations.map((l) => l.label)
    : null;

  let currentLocation = null;
  const items = [];

  for (const row of rows) {
    if (!row[0]) continue;
    const col0 = String(row[0]).trim();

    // Detecter les titres de section (ex. "CAISSE N°1", "COTE GAUCHE", etc.)
    const locationMatch = Object.values(INVENTORY_GROUPS)
      .flatMap((g) => g.locations)
      .find((l) => l.label === col0 || col0.includes(l.label));

    if (locationMatch) {
      currentLocation = locationMatch.label;
    } else if (currentLocation) {
      // C'est un article dans la section actuelle
      const article = col0;
      const quantite = row[1] ? String(row[1]).trim() : "";

      // Filtrer par groupe si demande
      if (!targetLocations || targetLocations.includes(currentLocation)) {
        if (article) {
          items.push({
            article,
            quantite,
            emplacement: currentLocation,
          });
        }
      }
    }
  }

  return items;
}
