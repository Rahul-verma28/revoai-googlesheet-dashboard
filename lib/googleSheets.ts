import { google } from "googleapis";

export async function fetchGoogleSheetData(sheetId: string, range = "Sheet1!A1:Z50") {
  try {

    const client = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
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
    throw new Error("Error fetching Google Sheet data: " + (error as Error).message);
  }
}