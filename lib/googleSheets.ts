import { google } from "googleapis";
import keys from "@/key.json";

export async function fetchGoogleSheetData(sheetId, range = "Sheet1!A1:Z50") {
  try {
    const client = new google.auth.JWT(
      keys.client_email,
      null,
      keys.private_key.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    await new Promise((resolve, reject) => {
      client.authorize((err, tokens) => {
        if (err) {
          reject(err);
        } else {
          resolve(tokens);
        }
      });
    });

    const gsapi = google.sheets({ version: "v4", auth: client });

    const data = await gsapi.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    return data.data.values || [];
  } catch (error) {
    throw new Error("Error fetching Google Sheet data: " + error.message);
  }
}
