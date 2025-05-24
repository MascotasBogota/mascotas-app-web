import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Ensure MONGO_URI is loaded before attempting to connect
if (!process.env.MONGO_URI) {
  console.error("🔴 MONGO_URI no está definido en .env");
  process.exit(1); // Salir si MONGO_URI no está definido
}

app.use("/api/users", userRoutes); // Ruta para registrar usuarios

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🟢 MongoDB conectado"); // Changed console log for clarity
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Servidor corriendo en el puerto ${process.env.PORT || 5000}`
      );
    });
  })
  .catch((err) => console.error("Error al conectar a MongoDB", err));
