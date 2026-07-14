import * as reportsRepo from "./reports.repository";
import { MonthlyReport } from "./reports.types";

export async function getMonthlyReport(month: string): Promise<MonthlyReport> {
  const aggregates = await reportsRepo.getMonthlyAggregates(month);
  const income = parseFloat(aggregates.totalIncome);
  const expenseTotal = parseFloat(aggregates.totalExpenses);
  const netProfit = (income - expenseTotal).toFixed(2);

  return {
    month,
    totalIncome: aggregates.totalIncome,
    totalExpenses: aggregates.totalExpenses,
    netProfit,
    paymentCount: aggregates.paymentCount,
    expenseCount: aggregates.expenseCount,
  };
}
