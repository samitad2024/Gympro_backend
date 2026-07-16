import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "@core/config/swagger";
import { errorHandler } from "@core/middleware/error-handler";
import { notFound } from "@core/middleware/not-found";
import { registerRoutes } from "@core/router";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

registerRoutes(app);

app.use(notFound);
app.use(errorHandler);
