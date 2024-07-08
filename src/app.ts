import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";
import databaseConnection from "./common/database/database.connection";
import appRoutes from "./app.routes";

dotenv.config();

databaseConnection();

const app = express();
const PORT = process.env.PORT || 8000;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express TypeScript API",
    version: "1.0.0",
    description: "API documentation for the Express TypeScript application",
  },
  servers: [
    {
      url:
        process.env.NODE_ENV === "development"
          ? `http://localhost:${PORT}`
          : process.env.HOST,
      description:
        process.env.NODE_ENV === "development"
          ? "Development server"
          : process.env.SWAGGER_DESCRIPTION,
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", appRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api/docs`);
});
