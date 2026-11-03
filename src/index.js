require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const productsRouter = require("./routes/products");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/products", productsRouter);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API Node/Mongo escuchando en puerto ${PORT}`));
  })
  .catch((err) => {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  });
