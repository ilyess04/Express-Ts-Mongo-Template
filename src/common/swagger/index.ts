import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

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
          ? `http://localhost:${process.env.PORT || 8000}`
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

export const swaggerSpec = swaggerJSDoc(options);
