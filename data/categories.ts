import type { Category } from "@/types";

export const categories: Category[] = [
  { key: "food", name: "Alimentação", color: "#F59E0B", softColor: "#FEF3C7", budget: 1200 },
  { key: "transport", name: "Transporte", color: "#3B82F6", softColor: "#DBEAFE", budget: 650 },
  { key: "home", name: "Casa", color: "#8B5CF6", softColor: "#EDE9FE", budget: 1900 },
  { key: "health", name: "Saúde", color: "#EF4444", softColor: "#FEE2E2", budget: 500 },
  { key: "leisure", name: "Lazer", color: "#EC4899", softColor: "#FCE7F3", budget: 600 },
  { key: "education", name: "Educação", color: "#14B8A6", softColor: "#CCFBF1", budget: 450 },
  { key: "other", name: "Outros", color: "#64748B", softColor: "#E2E8F0", budget: 400 },
];
