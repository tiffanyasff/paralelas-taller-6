const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/productos_db";
  await mongoose.connect(uri);
  console.log("Conectado a MongoDB:", uri);
}

module.exports = connectDB;
