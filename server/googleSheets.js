import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const auth = new google.auth.GoogleAuth({
  keyFile: "./server/google-service-account.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

// ================================
// SEARCH PRODUCTS FROM SHEET
// ================================
export async function searchProductsFromSheet(query) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = "products!A2:F"; 
  // A:id | B:name | C:price | D:currency | E:store | F:link

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.data.values || [];

  const keyword = query.toLowerCase();

  const results = rows
    .map((row) => ({
      id: row[0],
      name: row[1],
      price: row[2],
      currency: row[3],
      store: row[4],
      link: row[5],
    }))
    .filter(
      (product) =>
        product.name &&
        product.name.toLowerCase().includes(keyword)
    );

  return results;
}
