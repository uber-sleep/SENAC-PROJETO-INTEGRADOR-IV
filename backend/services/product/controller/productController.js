const Product = require("../models/Product");

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stockQuantity, category } = req.body;
    const producerId = req.producer.id;

    const product = await Product.create({
      name,
      description,
      price,
      stockQuantity,
      category,
      producerId,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Erro ao criar o produto: ", { error: error.stack });

    error.clientMessage = "Falha ao criar o produto";
    error.statusCode = 500;
    error.type = error.type || "product_creation_error";

    next(error);
  }
};
