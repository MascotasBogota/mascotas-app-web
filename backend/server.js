const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:<admin123>@cluster0.dej2xm9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("🟢 Conectado a MongoDB Atlas"))
.catch((err) => console.error("🔴 Error conectando a MongoDB:", err));
