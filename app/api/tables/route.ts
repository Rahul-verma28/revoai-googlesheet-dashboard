import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Table from "@/lib/models/Tables";
import User from "@/lib/models/User";
import { getDataFromToken } from "@/lib/getDataFormToken";

// Create a new table
export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const userId = getDataFromToken(req);
    if (typeof userId !== "string") {
      return userId; 
    }

    const { name, sheetId, columns } = await req.json();

    if (!name || !columns || !Array.isArray(columns)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the sheetId is already connected to a table
    const existingTable = await Table.findOne({ sheetId, user: userId });
    if (existingTable) {
      return NextResponse.json(
        { error: "Sheet ID is already connected to another table" },
        { status: 400 }
      );
    }

    const newTable = await Table.create({
      user: userId,
      name,
      sheetId,
      columns,
    });

    await User.findByIdAndUpdate(userId, { $push: { tables: newTable._id } });

    return NextResponse.json({ success: true, table: newTable }, { status: 201 });
  } catch (error) {
    console.error("[POST_TABLE]", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// Get all tables for a user
export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const userId = getDataFromToken(req);

    if (typeof userId !== "string") {
      return userId;
    }

    const tables = await Table.find({ user: userId });

    return NextResponse.json({ success: true, tables }, { status: 200 });
  } catch (error) {
    console.error("[GET_TABLES]", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}