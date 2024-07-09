import express from "express";
import authRoutes from "./components/auth/auth.routes";
import companyRoutes from "./components/company/company.routes";

const router = express.Router();

router.get("/", (_, res) => {
  res.send("Welcome To ExpressJS Typescript && MongoDB Template!");
});

router.use("/auth", authRoutes);
router.use("/company", companyRoutes);

export default router;
