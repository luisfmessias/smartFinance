import cors from "cors";
import express from "express";
import { initialExpenses } from "../data/mock-data";
import type { Expense } from "../types";

const app = express();
const port = Number(process.env.PORT ?? 3333);
const expenses: Expense[] = [...initialExpenses];

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => response.json({ status: "ok" }));
app.get("/expenses", (_request, response) => response.json(expenses));
app.post("/expenses", (request, response) => {
  const expense = request.body as Expense;
  expenses.unshift(expense);
  response.status(201).json(expense);
});

app.listen(port, () => console.log(`SmartFinance API running on http://localhost:${port}`));
