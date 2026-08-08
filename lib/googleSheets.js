// lib/googleSheets.js
import { JWT } from "google-auth-library";
import { google } from "googleapis";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function readRange(sheetName, range) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!${range}`,
  });
  return response.data.values || [];
}

export async function appendRow(sheetName, values) {
  return appendRowToSpreadsheet(SPREADSHEET_ID, sheetName, values);
}

export async function appendRowToSpreadsheet(spreadsheetId, sheetName, values) {
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:H`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    resource: {
      values: [values],
    },
  });
  return response.data;
}

export function rangeFor(row, cols) {
  const start = String.fromCharCode(65 + cols[0]);
  const end = String.fromCharCode(65 + cols[1]);
  return `${start}${row}:${end}${row}`;
}
