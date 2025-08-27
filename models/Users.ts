import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

export const User = models.User || mongoose.model("User", UserSchema);