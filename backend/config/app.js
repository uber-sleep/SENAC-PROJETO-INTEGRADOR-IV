const express = require("express");
const cors = require("cors");
const errorHandler = require("../middlewares/errorHandler");

const authRoutes = require("../services/user/routes/authRoutes");
const productRoutes = require("../services/product/routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

app.use(errorHandler);

module.exports = app;
