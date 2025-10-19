const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authenticatMiddle");
const cartController = require("../controllers/cartController");

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart retrieved successfully
 */
router.get("/", protect, cartController.getCart);

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add a product to the cart (auto create if not exist)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product added to cart
 */
router.post("/add", protect, cartController.addToCart);

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Update quantity of a product in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 */
router.put("/update", protect, cartController.updateQuantity);

/**
 * @swagger
 * /cart/remove:
 *   put:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product removed from cart
 */
router.put("/remove", protect, cartController.removeFromCart);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear all products from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */
router.delete("/clear", protect, cartController.clearCart);

module.exports = router;
