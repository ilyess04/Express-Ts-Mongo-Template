import express from "express";
import { body } from "express-validator";
import { CompanyController } from "./company.controller";
import authMiddleware from "../../common/middlewares/auth.middleware";

const router = express.Router();
router.use(authMiddleware);
const companyController = new CompanyController();

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Company APIs
 */

/**
 * @swagger
 * /company/create:
 *   post:
 *     summary: Create company
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Bad request, validation error
 */
router.post(
  "/create",
  [body("name").notEmpty().isString()],
  companyController.createCompany.bind(companyController)
);

export default router;
