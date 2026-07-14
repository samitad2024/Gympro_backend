import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GymPro Backend API",
      version: "1.0.0",
      description:
        "Backend API for single-gym member management, income/expense tracking, and content delivery",
    },
    servers: [{ url: "http://localhost:4000", description: "Local dev" }],
  },
  apis: ["./src/modules/**/*.routes.ts"],
});
