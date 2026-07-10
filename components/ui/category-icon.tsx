import { BookOpen, Bus, HeartPulse, Home, MoreHorizontal, Popcorn, Utensils } from "lucide-react";
import { categories } from "@/data/mock-data";
import type { CategoryKey } from "@/types";

const icons = {
  food: Utensils,
  transport: Bus,
  home: Home,
  health: HeartPulse,
  leisure: Popcorn,
  education: BookOpen,
  other: MoreHorizontal,
};

export function CategoryIcon({ category, size = "md" }: { category: CategoryKey; size?: "sm" | "md" | "lg" }) {
  const Icon = icons[category];
  const details = categories.find((item) => item.key === category)!;
  const dimensions = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-9 w-9" : "h-10 w-10";

  return (
    <div className={`flex ${dimensions} shrink-0 items-center justify-center rounded-2xl`} style={{ backgroundColor: details.softColor }}>
      <Icon size={size === "lg" ? 20 : 17} strokeWidth={2.2} style={{ color: details.color }} />
    </div>
  );
}
