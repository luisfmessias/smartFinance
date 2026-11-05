export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const formatShortDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(
    new Date(`${value}T12:00:00`),
  );

/** Máscara de dinheiro: lê só os dígitos e os trata como centavos. */
export const formatAmountInput = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  return (Number(digits) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const toAmountInput = (value: number) => formatAmountInput(String(Math.round(value * 100)));

export const formatLongDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));

export const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const toLocalDate = (date = new Date()) => date.toLocaleDateString("en-CA");

export const currentPeriod = () => toLocalDate().slice(0, 7);

export const formatDayLabel = (value: string) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (value === toLocalDate()) return "Hoje";
  if (value === toLocalDate(yesterday)) return "Ontem";
  return formatShortDate(value);
};

export const getInitials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

export const sumExpenses = (values: { amount: number }[]) =>
  values.reduce((total, expense) => total + expense.amount, 0);

/** Aceita "1.234,56", "1234,56" e "12.50". */
export const parseAmount = (value: string) => {
  const trimmed = value.trim();
  return Number(trimmed.includes(",") ? trimmed.replace(/\./g, "").replace(",", ".") : trimmed);
};
