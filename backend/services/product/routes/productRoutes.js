const express = require("express");
const router = express.Router();
const { param, body, query } = require("express-validator");
const productController = require("../controller/productController");
const authMiddleware = require("../../../middlewares/authMiddleware");
const producerMiddleware = require("../../../middlewares/producerMiddleware");

router.post(
  "/",
  [
    authMiddleware,
    producerMiddleware,
    body("name").notEmpty().withMessage("O nome é obrigatório."),
    body("price").notEmpty().withMessage("O preço é obrigatório."),
    body("stockQuantity")
      .notEmpty()
      .withMessage("A quantidade do estoque é obrigatória."),
    body("stockQuantity")
      .notEmpty()
      .withMessage("A quantidade do estoque é obrigatória.")
      .toInt(),
    body("category").notEmpty().withMessage("O tipo do produto é obrigatório."),
  ],
  productController.createProduct
);

module.exports = router;
