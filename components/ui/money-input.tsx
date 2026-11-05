import { formatAmountInput } from "@/lib/format";

/** Campo de valor: os dígitos entram pelos centavos, então 1234 vira 12,34. */
export function MoneyInput({ value, onChange, autoFocus }: { value: string; onChange: (value: string) => void; autoFocus?: boolean }) {
  return (
    <div className="field flex items-center gap-2">
      <span className="text-xl font-medium text-sage">R$</span>
      <input
        required
        autoFocus={autoFocus}
        inputMode="numeric"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(formatAmountInput(event.target.value))}
        placeholder="0,00"
        className="w-full bg-transparent text-[28px] font-semibold tracking-tight outline-none placeholder:text-sage/50"
      />
    </div>
  );
}
