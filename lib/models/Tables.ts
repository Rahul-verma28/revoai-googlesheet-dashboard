import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  sheetId: { type: String, required: true },
  columns: [
    {
      name: { type: String, required: true },
      type: { type: String, enum: ["text", "date", "number"], default: "text" },
    },
  ],
}, { timestamps: true });

const Table = mongoose.models.Table || mongoose.model("Table", tableSchema);

export default Table;
