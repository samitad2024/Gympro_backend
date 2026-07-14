import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "@config/swagger";
import { errorHandler } from "@middleware/error-handler";
import { notFound } from "@middleware/not-found";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// module routes are mounted here, one at a time, as each is built
import plansRoutes from "@modules/plans/plans.routes";

app.use("/api/plans", plansRoutes);

app.use(notFound);
app.use(errorHandler);
