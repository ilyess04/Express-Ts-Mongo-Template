import express from "express";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import databaseConnection from "./common/database/database.connection";
import appRoutes from "./app.routes";
import { swaggerSpec } from "./common/swagger";

dotenv.config();

databaseConnection();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", appRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api/docs`);
});
