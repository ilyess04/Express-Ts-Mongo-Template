import express from "express";
import { body } from "express-validator";
import { AuthController } from "./auth.controller";
import refreshMiddleware from "../../common/middlewares/refresh.middleware";

const router = express.Router();
const authController = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Registration successful
 *       400:
 *         description: Bad request, validation error
 */
router.post(
  "/register",
  [
    body("firstname").notEmpty(),
    body("lastname").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
  ],
  authController.register.bind(authController)
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request, validation error
 *       401:
 *         description: Unauthorized, invalid credentials
 */
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  authController.login.bind(authController)
);

/**
 * @swagger
 * /auth/forgotpassword:
 *   post:
 *     summary: Forgot password with email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: resetpassword email has been sent successfuly!
 *       400:
 *         description: Bad request, validation error
 *       401:
 *         description: Unauthorized, invalid credentials
 */
router.post(
  "/forgotpassword",
  [body("email").isEmail()],
  authController.forgotPassword.bind(authController)
);

/**
 * @swagger
 * /auth/resetpassword/{token}:
 *   put:
 *     summary: Reset user password
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Reset password token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *              password:
 *                 type: string
 *                 format: password
 *              confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Bad request
 */
router.put(
  "/resetpassword/:token",
  [
    body("password").isLength({ min: 8 }),
    body("confirmPassword").isLength({ min: 8 }),
  ],
  authController.resetPassword.bind(authController)
);

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Refresh token
 *     tags: 
 *       - Authentication
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/refresh",
  refreshMiddleware,
  authController.refreshToken.bind(authController)
);

export default router;
