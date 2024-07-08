import express from "express";
import { body } from "express-validator";
import { AuthController } from "./auth.controller";

const router = express.Router();
const authController = new AuthController();

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

export default router;
