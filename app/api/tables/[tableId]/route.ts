import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Table from "@/lib/models/Tables";
import { fetchGoogleSheetData } from "@/lib/googleSheets";
import { getDataFromToken } from "@/lib/getDataFormToken";
import User from "@/lib/models/User";

// Define the expected type for the context parameter with async params
interface RouteContext {
  params: Promise<{
    tableId: string;
  }>;
}

// GET table data
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    await connectToDB();
    // Await the params to get the tableId
    const { tableId } = await context.params;

    const table = await Table.findById(tableId);
    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    // Fetch data from Google Sheets
    const sheetData = await fetchGoogleSheetData(table.sheetId);

    return NextResponse.json({ error: false, table, sheetData }, { status: 200 });
  } catch (error) {
    console.error("[GET_TABLE]", error);
    return NextResponse.json(
      { error: true, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE table
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await connectToDB();
    const userId = getDataFromToken(req);

    if (typeof userId !== "string") {
      return userId; // If it's an error response, return it.
    }

    // Await the params to get the tableId
    const { tableId } = await context.params;

    if (!tableId) {
      return NextResponse.json({ error: "Table ID is required" }, { status: 400 });
    }

    // Find the table
    const table = await Table.findOne({ _id: tableId, user: userId });

    if (!table) {
      return NextResponse.json({ error: "Table not found or unauthorized" }, { status: 404 });
    }

    // Delete the table
    await Table.deleteOne({ _id: tableId });

    // Remove the table reference from the user
    await User.findByIdAndUpdate(userId, { $pull: { tables: tableId } });

    return NextResponse.json({ success: true, message: "Table deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("[DELETE_TABLE]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
