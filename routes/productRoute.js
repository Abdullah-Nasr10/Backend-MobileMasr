const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect, admin } = require("../middleware/authenticatMiddle");

/**
 * @openapi
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB document ObjectId
 *           example: "66f1c6c0e4b6b6d2c1b2a345"
 *           readOnly: true
 *         id:
 *           type: string
 *           description: Convenience string alias of _id (virtual)
 *           example: "66f1c6c0e4b6b6d2c1b2a345"
 *           readOnly: true
 *         name:
 *           type: string
 *           example: "iPhone 15 Pro Max"
 *         price:
 *           type: number
 *           example: 1200
 *         discount:
 *           type: number
 *           example: 10
 *         priceAfterDiscount:
 *           type: number
 *           example: 1080
 *           description: "Automatically calculated based on price and discount"
 *           readOnly: true
 *         skuCode:
 *           type: string
 *           example: "IPH15PMX-256GB-BLK"
 *         description:
 *           type: string
 *           example: "Latest Apple flagship phone with 256GB storage."
 *         condition:
 *           type: string
 *           enum: [new, used]
 *           example: "new"
 *         storage:
 *           type: string
 *           example: "256GB"
 *         ram:
 *           type: array
 *           items:
 *             type: string
 *           example: ["8GB"]
 *         color:
 *           type: string
 *           example: "Black"
 *         batteryCapacity:
 *           type: string
 *           example: "4500mAh"
 *         simCard:
 *           type: string
 *           example: "Dual SIM"
 *         screenSize:
 *           type: string
 *           example: "6.7 inch"
 *         camera:
 *           type: string
 *           example: "48MP + 12MP"
 *         weight:
 *           type: string
 *           example: "230g"
 *         processor:
 *           type: string
 *           description: CPU model (optional, useful for laptops/PCs)
 *           example: "Apple M4 Max"
 *         gpu:
 *           type: string
 *           description: GPU model (optional)
 *           example: "Apple M4 Max"
 *         hdd:
 *           type: string
 *           description: HDD capacity or "NA" if not present
 *           example: "NA"
 *         ssd:
 *           type: string
 *           description: SSD capacity (optional)
 *           example: "1000GB"
 *         accessories:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Charger", "Earbuds"]
 *         batteryStatus:
 *           type: string
 *           example: "Excellent"
 *         guarantee:
 *           type: string
 *           example: "1 Year Official Warranty"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://example.com/iphone-front.png", "https://example.com/iphone-back.png"]
 *         category:
 *           type: string
 *           example: "66f1c6c0e4b6b6d2c1b2a789"
 *         brand:
 *           type: string
 *           example: "66f1c6c0e4b6b6d2c1b2a999"
 *         vendor:
 *           type: string
 *           example: "66f1c6c0e4b6b6d2c1b2a555"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2025-09-27T12:34:56.000Z"
 */

/**
 * @openapi
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     description: Add a new product with all details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Product"
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid data
 */
router.post("/", protect, admin, productController.createProduct);

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products
 *     description: Retrieve a list of all available products
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 *       500:
 *         description: Server error
 */
router.get("/", productController.getProducts);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID
 *     description: Retrieve details of a single product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 *       404:
 *         description: Product not found
 */
router.get("/:id", productController.getProductById);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update product
 *     description: Update product details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Product"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put("/:id", protect, admin, productController.updateProduct);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete product
 *     description: Delete a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete("/:id", protect, admin, productController.deleteProduct);

module.exports = router;









// const express = require("express");
// const router = express.Router();
// const productController = require("../controllers/productController");

// // Create Product
// router.post("/", productController.createProduct);

// // Get All Products
// router.get("/", productController.getProducts);

// // Get Single Product
// router.get("/:id", productController.getProductById);

// // Update Product
// router.put("/:id", productController.updateProduct);

// // Delete Product
// router.delete("/:id", productController.deleteProduct);

// module.exports = router;
