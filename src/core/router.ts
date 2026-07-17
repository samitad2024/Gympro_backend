import { Express } from "express";
import { requireOwnerAuth } from "@core/middleware/require-owner-auth";
import authRoutes from "@modules/auth";
import plansRoutes from "@modules/plans";
import membersRoutes from "@modules/members";
import paymentsRoutes from "@modules/payments";
import expensesRoutes from "@modules/expenses";
import servicesRoutes from "@modules/services";
import contentRoutes from "@modules/content";
import notificationsRoutes from "@modules/notifications";
import reportsRoutes from "@modules/reports";

export function registerRoutes(app: Express) {
  app.use("/api/auth", authRoutes);
  app.use("/api/plans", plansRoutes);
  app.use("/api/members", membersRoutes);
  app.use("/api/payments", requireOwnerAuth, paymentsRoutes);
  app.use("/api/expenses", requireOwnerAuth, expensesRoutes);
  app.use("/api/services", servicesRoutes);
  app.use("/api/content", contentRoutes);
  app.use("/api/notifications", requireOwnerAuth, notificationsRoutes);
  app.use("/api/reports", requireOwnerAuth, reportsRoutes);
}
