// lib/inventoryParser.js
export function parseInventaireComplet(rows) {
  const items = [];

  rows.forEach((row, index) => {
    if (!row || row.length < 2) return;

    const emplacement = row[0]?.toString().trim() || "";
    const article = row[1]?.toString().trim() || "";
    const quantite = row[2]?.toString().trim() || "";

    if (emplacement && article) {
      items.push({
        emplacement,
        article,
        quantite,
      });
    }
  });

  return items;
}
