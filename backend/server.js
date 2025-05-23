const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:<admin123>@cluster0.dej2xm9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("🟢 Conectado a MongoDB Atlas"))
.catch((err) => console.error("🔴 Error conectando a MongoDB:", err));

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes); // Ruta para registrar usuarios

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Servidor corriendo en el puerto ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('Error al conectar a MongoDB', err));
