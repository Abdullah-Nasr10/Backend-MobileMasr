import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
} from "../controllers/adminController.js";

import { protect, admin } from "../middleware/authenticatMiddle.js";

const router = express.Router();

router.get("/users", protect, admin, getAllUsers);
router.get("/users/:id", protect, admin, getUserById);
router.put("/users/:id", protect, admin, updateUserByAdmin);
router.delete("/users/:id", protect, admin, deleteUserByAdmin);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Require admin role
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Require admin role
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: Update user by ID (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Gehad
 *               email:
 *                 type: string
 *                 example: gehad@example.com
 *               phone:
 *                 type: string
 *                 example: "01012345678"
 *               role:
 *                 type: string
 *                 enum: [customer, admin]
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Require admin role
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete user by ID (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: hard
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *         description: If true, user is permanently deleted, otherwise soft delete
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Require admin role
 *       404:
 *         description: User not found
 */

export default router;
