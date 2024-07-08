import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";
import databaseConnection from "./common/database/database.connection";

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
      url: `http://localhost:${PORT}`,
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_: Request, res: Response) => {
  res.send("Welcome To ExpressJS Typescript && MongoDB Template!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api/docs`);
});
