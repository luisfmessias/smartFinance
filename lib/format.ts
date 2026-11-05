export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const formatShortDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(
    new Date(`${value}T12:00:00`),
  );

export const sumExpenses = (values: { amount: number }[]) =>
  values.reduce((total, expense) => total + expense.amount, 0);

/** Aceita "1.234,56", "1234,56" e "12.50". */
export const parseAmount = (value: string) => {
  const trimmed = value.trim();
  return Number(trimmed.includes(",") ? trimmed.replace(/\./g, "").replace(",", ".") : trimmed);
};
