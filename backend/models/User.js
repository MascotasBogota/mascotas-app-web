import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "El nombre completo es requerido"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
