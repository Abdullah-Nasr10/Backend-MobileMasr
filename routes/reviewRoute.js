const express = require("express");
const { addReview, getReviews, deleteReview } = require("../controllers/reviewController");
const { protect,admin } = require("../middleware/authenticatMiddle");
const router = express.Router();

router.post("/products/:id/reviews", protect, addReview);
router.get("/products/:id/reviews", getReviews);
router.delete("/reviews/:id", protect, admin, deleteReview);




/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product Reviews Management
 */

/**
 * @swagger
 * /reviews/products/{id}/reviews:
 *   post:
 *     summary: Add a new review to a product
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Excellent phone, very good battery life!"
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *
 *   get:
 *     summary: Get all reviews for a specific product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of product reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   comment:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /reviews/reviews/{id}:
 *   delete:
 *     summary: Delete a review (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Require admin role
 *       404:
 *         description: Review not found
 */


module.exports = router;