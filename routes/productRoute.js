const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Create Product
router.post("/", productController.createProduct);

// Get All Products
router.get("/", productController.getProducts);

// Get Single Product
router.get("/:id", productController.getProductById);

// Update Product
router.put("/:id", productController.updateProduct);

// Delete Product
router.delete("/:id", productController.deleteProduct);

module.exports = router;
