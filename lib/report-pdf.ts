import { categories } from "@/data/categories";
import { capitalize, formatCurrency, sumExpenses } from "@/lib/format";
import type { Expense, UserAccount, UserPreferences } from "@/types";

const PINE: [number, number, number] = [30, 65, 53];
const INK: [number, number, number] = [23, 35, 30];
const MUTED: [number, number, number] = [92, 112, 101];
const PANEL: [number, number, number] = [240, 245, 241];
const MARGIN = 16;

// O espaço rígido do Intl não existe em todas as fontes padrão do PDF.
const money = (value: number) => formatCurrency(value).replace(/\s/g, " ");
const dayMonthYear = (date: string) => date.split("-").reverse().join("/");

interface ReportInput {
  account: UserAccount;
  period: string;
  periodLabel: string;
  expenses: Expense[];
  previousTotal: number;
  preferences: UserPreferences;
}

export async function downloadReportPdf({ account, period, periodLabel, expenses, previousTotal, preferences }: ReportInput) {
  // Carregadas só no clique, para não pesar na abertura do app.
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - MARGIN * 2;
  const total = sumExpenses(expenses);
  const lastTableY = () => (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

  doc.setFillColor(...PINE);
  doc.rect(0, 0, pageWidth, 36, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("SmartFinance", MARGIN, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Relatório de gastos", MARGIN, 23);
  doc.text(account.name, pageWidth - MARGIN, 16, { align: "right" });
  doc.text(capitalize(periodLabel), pageWidth - MARGIN, 23, { align: "right" });

  const change = previousTotal ? Math.round(((total - previousTotal) / previousTotal) * 100) : null;
  const summary = [
    { label: "Total do mês", value: money(total), note: `${expenses.length} ${expenses.length === 1 ? "lançamento" : "lançamentos"}` },
    { label: "Mês anterior", value: money(previousTotal), note: change === null ? "Sem dados para comparar" : `${change > 0 ? "+" : ""}${change}% neste mês` },
    { label: "Limite mensal", value: money(preferences.monthlyBudget), note: `${Math.round((total / preferences.monthlyBudget) * 100)}% utilizado` },
  ];
  const gap = 4;
  const boxWidth = (contentWidth - gap * (summary.length - 1)) / summary.length;
  summary.forEach((item, index) => {
    const x = MARGIN + index * (boxWidth + gap);
    doc.setFillColor(...PANEL);
    doc.roundedRect(x, 44, boxWidth, 25, 3, 3, "F");
    doc.setTextColor(...MUTED);
    doc.setFontSize(9);
    doc.text(item.label, x + 4, 51);
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(item.value, x + 4, 58.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.setFontSize(8.5);
    doc.text(item.note, x + 4, 64.5);
  });

  const heading = (text: string, y: number) => {
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(text, MARGIN, y);
    doc.setFont("helvetica", "normal");
  };

  const tableStyle = {
    margin: { left: MARGIN, right: MARGIN, bottom: 18 },
    styles: { fontSize: 9.5, cellPadding: 2.4, textColor: INK, lineColor: [225, 232, 227] as [number, number, number], lineWidth: { bottom: 0.2 } },
    headStyles: { fillColor: PANEL, textColor: MUTED, fontStyle: "normal" as const, lineWidth: 0 },
  };

  const byCategory = categories
    .map((category) => ({ ...category, spent: sumExpenses(expenses.filter((expense) => expense.category === category.key)) }))
    .filter((category) => category.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  heading("Gastos por categoria", 80);
  autoTable(doc, {
    ...tableStyle,
    startY: 84,
    head: [["Categoria", "Valor", "% do mês", "Limite", "Uso do limite"]],
    body: byCategory.map((category) => {
      const budget = preferences.categoryBudgets[category.key];
      return [category.name, money(category.spent), `${Math.round((category.spent / total) * 100)}%`, money(budget), `${Math.round((category.spent / budget) * 100)}%`];
    }),
    columnStyles: { 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "right" } },
    didParseCell: (data) => {
      if (data.section === "head" && data.column.index > 0) data.cell.styles.halign = "right";
    },
  });

  heading("Lançamentos", lastTableY() + 11);
  autoTable(doc, {
    ...tableStyle,
    startY: lastTableY() + 15,
    head: [["Data", "Descrição", "Categoria", "Valor"]],
    body: expenses.map((expense) => [dayMonthYear(expense.date), expense.title, categories.find((item) => item.key === expense.category)?.name ?? "", money(expense.amount)]),
    columnStyles: { 0: { cellWidth: 24 }, 3: { halign: "right", cellWidth: 32 } },
    didParseCell: (data) => {
      if (data.section === "head" && data.column.index === 3) data.cell.styles.halign = "right";
    },
  });

  const generatedAt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date());
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setTextColor(...MUTED);
    doc.setFontSize(8.5);
    doc.text(`Gerado em ${generatedAt}`, MARGIN, pageHeight - 9);
    doc.text(`Página ${page} de ${pages}`, pageWidth - MARGIN, pageHeight - 9, { align: "right" });
  }

  doc.save(`smartfinance-relatorio-${period}.pdf`);
}
