const express = require("express");
const router = express.Router();
const WishlistController = require("../controllers/wishlistController");

/**
 * @openapi
 * /wishlist/{userId}:
 *   get:
 *     summary: Get wishlist for a user
 *     description: Retrieve wishlist details (with products) for a given user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, example: "66f1c6c0e4b6b6d2c1b2a345" }
 *     responses:
 *       200: { description: Wishlist retrieved successfully }
 *       404: { description: Wishlist not found }
 */
router.get("/:userId", WishlistController.getWishlist);

/**
 * @openapi
 * /wishlist/{userId}:
 *   post:
 *     summary: Add product to wishlist
 *     description: Add a product to the user's wishlist
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, example: "66f1c6c0e4b6b6d2c1b2a345" }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId: { type: string, example: "651234abcde12345fgh67890" }
 *     responses:
 *       201: { description: Product added to wishlist }
 *       500: { description: Server error }
 */
router.post("/:userId", WishlistController.addToWishlist);

/**
 * @openapi
 * /wishlist/{userId}/remove:
 *   put:
 *     summary: Remove product from wishlist
 *     description: Remove a product from the user's wishlist
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, example: "66f1c6c0e4b6b6d2c1b2a345" }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId: { type: string, example: "651234abcde12345fgh67890" }
 *     responses:
 *       200: { description: Product removed from wishlist }
 *       404: { description: Wishlist not found }
 */
router.put("/:userId/remove", WishlistController.removeFromWishlist);

/**
 * @openapi
 * /wishlist/{userId}:
 *   delete:
 *     summary: Delete wishlist
 *     description: Delete the entire wishlist of a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, example: "66f1c6c0e4b6b6d2c1b2a345" }
 *     responses:
 *       200: { description: Wishlist deleted successfully }
 *       404: { description: Wishlist not found }
 */
router.delete("/:userId", WishlistController.deleteWishlist);

module.exports = router;
