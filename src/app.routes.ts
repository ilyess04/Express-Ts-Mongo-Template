import express from "express";
import authRoutes from "./components/auth/auth.routes";

const router = express.Router();

router.get("/", (_, res) => {
  res.send("Welcome To ExpressJS Typescript && MongoDB Template!");
});

router.use("/auth", authRoutes);

export default router;
