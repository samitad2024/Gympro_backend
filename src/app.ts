import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "@config/swagger";
import { errorHandler } from "@middleware/error-handler";
import { notFound } from "@middleware/not-found";
import plansRoutes from "@modules/plans/plans.routes";
import membersRoutes from "@modules/members/members.routes";
import paymentsRoutes from "@modules/payments/payments.routes";
import expensesRoutes from "@modules/expenses/expenses.routes";
import servicesRoutes from "@modules/services/services.routes";
import contentRoutes from "@modules/content/content.routes";
import notificationsRoutes from "@modules/notifications/notifications.routes";
import reportsRoutes from "@modules/reports/reports.routes";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/plans", plansRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/reports", reportsRoutes);

app.use(notFound);
app.use(errorHandler);
