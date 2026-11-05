import { BookOpen, Bus, Gift, HeartPulse, Home, MoreHorizontal, PawPrint, Plane, Popcorn, Receipt, Repeat, Shirt, ShoppingCart, Sparkles, Utensils } from "lucide-react";
import type { CategoryKey } from "@/types";

const icons: Record<CategoryKey, typeof Home> = {
  food: Utensils,
  groceries: ShoppingCart,
  transport: Bus,
  home: Home,
  bills: Receipt,
  health: HeartPulse,
  beauty: Sparkles,
  clothing: Shirt,
  leisure: Popcorn,
  subscriptions: Repeat,
  travel: Plane,
  education: BookOpen,
  pets: PawPrint,
  gifts: Gift,
  other: MoreHorizontal,
};

export function CategoryIcon({ category }: { category: CategoryKey }) {
  const Icon = icons[category];
  return (
    <div className="well flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]">
      <Icon size={17} strokeWidth={1.8} />
    </div>
  );
}
