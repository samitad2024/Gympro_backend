import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "@core/config/swagger";
import { getCorsOrigins } from "@core/config/env";
import { errorHandler } from "@core/middleware/error-handler";
import { notFound } from "@core/middleware/not-found";
import { registerRoutes } from "@core/router";
import { sendSuccess } from "@core/utils/api-response";

export const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: getCorsOrigins(),
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  sendSuccess(res, { status: "ok" });
});

app.get("/api-docs.json", (_req, res) => {
  res.json(swaggerSpec);
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "GymPro API — Login first, then Authorize",
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

registerRoutes(app);

app.use(notFound);
app.use(errorHandler);
