const express = require("express");
const { addSiteReview, getSiteReviews, deleteSiteReview } = require("../controllers/siteReviewController");
const { protect } = require("../middleware/authenticatMiddle");
const router = express.Router();

router.post("/site-reviews", protect, addSiteReview);
router.get("/site-reviews", getSiteReviews);
router.delete("/site-reviews/:id", protect, deleteSiteReview);


/**
 * @swagger
 * tags:
 *   name: Site Reviews
 *   description: API for managing reviews about the whole website/service
 */

/**
 * @swagger
 * /reviews/site-reviews:
 *   get:
 *     summary: Get all site reviews
 *     tags: [Site Reviews]
 *     responses:
 *       200:
 *         description: List of all reviews
 *   post:
 *     summary: Add a new site review
 *     tags: [Site Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Excellent service and fast delivery!
 *     responses:
 *       201:
 *         description: Review added successfully
 *
 * /reviews/site-reviews/{id}:
 *   delete:
 *     summary: Delete a site review (Admin or Owner only)
 *     tags: [Site Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

module.exports = router;