import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  tables: [{ type: mongoose.Schema.Types.ObjectId, ref: "Table" }], // Link tables to users
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
