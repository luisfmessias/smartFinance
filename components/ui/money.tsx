import { formatCurrency } from "@/lib/format";

/** Valor em destaque, com os centavos mais discretos. */
export function Money({ value, className = "" }: { value: number; className?: string }) {
  const formatted = formatCurrency(value);
  const cents = formatted.lastIndexOf(",");
  return (
    <span className={`sensitive font-semibold tracking-tight ${className}`}>
      {formatted.slice(0, cents)}
      <span className="text-[0.62em] font-medium opacity-70">{formatted.slice(cents)}</span>
    </span>
  );
}
