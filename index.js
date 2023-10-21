require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose"); // package pour connecter mongo à une base de données que je vais créer

app.use(express.json()); // pour que mon serveur accepte les données body
app.use(cors());

mongoose.connect(process.env.MONGODB_URI); // connexion à ma base de donnée via mongo

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const userRoute = require("./routes/user");
app.use(userRoute);

const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
