import { Router } from "express";
import { UserController } from "../controllers/users.controller";
import { authMiddlewareAsync } from "../middlewares/auth.middleware";
import { requireRoles } from "../middlewares/roles.middleware";

const router = Router();

// =================================================================
// AUTH ROUTES (Public)
// =================================================================

/**
 * POST /api/auth/register
 * Register a new user and send OTP for verification
 */
router.post("/api/auth/register", UserController.register);

/**
 * POST /api/auth/login
 * Login and receive accessToken (refreshToken set as httpOnly cookie)
 */
router.post("/api/auth/login", UserController.login);

/**
 * POST /api/auth/refresh
 * Silent refresh - get new accessToken using refreshToken cookie
 */
router.post("/api/auth/refresh", UserController.refresh);

/**
 * POST /api/auth/logout
 * Logout and clear refreshToken cookie
 */
router.post("/api/auth/logout", UserController.logout);

/**
 * POST /api/auth/send-otp
 * Resend OTP to user email
 */
router.post("/api/auth/send-otp", UserController.sendOtp);

/**
 * POST /api/auth/verify-otp
 * Verify OTP and activate account
 */
router.post("/api/auth/verify-otp", UserController.verifyOtp);

// =================================================================
// USER ROUTES (Protected)
// =================================================================

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get("/api/users/me", authMiddlewareAsync, UserController.getProfile);

/**
 * GET /api/users
 * Get all users (Admin only)
 */
router.get("/api/users", authMiddlewareAsync, requireRoles("admin"), UserController.getAllUsers);

/**
 * PUT /api/users/:id
 * Update user (own profile or admin)
 */
router.put("/api/users/:id", authMiddlewareAsync, UserController.updateUser);

/**
 * DELETE /api/users/:id
 * Delete user (own profile or admin)
 */
router.delete("/api/users/:id", authMiddlewareAsync, UserController.deleteUser);

export { router as userRouter };
