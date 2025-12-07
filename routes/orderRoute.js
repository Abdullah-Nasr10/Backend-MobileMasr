const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect } = require("../middleware/authenticatMiddle");

// ==================== Routes ====================
router.post("/", protect, orderController.createOrder);
router.get("/", protect, orderController.getAllOrders);
router.get("/:id", protect, orderController.getOrderById);
router.put("/:id", protect, orderController.updateOrderStatus);
router.delete("/:id", protect, orderController.deleteOrder);

module.exports = router;

// ==================== Swagger Documentation ====================

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management API
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order from cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *               - governorate
 *               - city
 *               - street
 *               - paymentMethod
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Ahmed Mohamed"
 *               phone:
 *                 type: string
 *                 example: "01012345678"
 *               governorate:
 *                 type: string
 *                 example: "Cairo"
 *               city:
 *                 type: string
 *                 example: "Nasr City"
 *               street:
 *                 type: string
 *                 example: "123 Main Street, Building 5, Apt 10"
 *               notes:
 *                 type: string
 *                 example: "Please call before delivery"
 *               paymentMethod:
 *                 type: string
 *                 enum: ["cod", "online"]
 *                 example: "cod"
 *     responses:
 *       201:
 *         description: Order created successfully
 *       404:
 *         description: Cart is empty
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *         example: "67140dc76464e2544c0b6d9a"
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *         example: "67140dc76464e2544c0b6d9a"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
 *                 example: "confirmed"
 *               paymentStatus:
 *                 type: string
 *                 enum: ["pending", "paid", "failed", "refunded"]
 *                 example: "paid"
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *         example: "67140dc76464e2544c0b6d9a"
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */