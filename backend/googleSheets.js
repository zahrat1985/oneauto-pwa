import { google } from "googleapis";

/**
 * Create Google Sheets client
 */
function getSheetsClient() {
  const credentials = JSON.parse(
    Buffer.from(
      process.env.GOOGLE_SERVICE_ACCOUNT_BASE64,
      "base64"
    ).toString("utf8")
  );

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return google.sheets({ version: "v4", auth });
}

/**
 * Search products inside Google Sheet
 * @param {string} query
 */
export async function searchProductsFromSheet(query) {
  const sheets = getSheetsClient();

  const sheetId = process.env.GOOGLE_SHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A1:Z1000`,
  });

  const rows = response.data.values;

  if (!rows || rows.length < 2) return [];

  // First row = headers
  const headers = rows[0].map(h => h.toLowerCase());

  const dataRows = rows.slice(1);

  const results = dataRows
    .map(row => {
      const item = {};
      headers.forEach((key, index) => {
        item[key] = row[index] || "";
      });
      return item;
    })
    .filter(item =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );

  return results;
}

