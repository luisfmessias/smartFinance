export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
        <rect width="64" height="64" rx="19" fill="#DCF5A4" />
        <path d="M43 22.5c-2.400-3.300-6.300-5-11-5-6.700 0-11.500 3.400-11.500 8.800 0 12 22.500 6.300 22.500 14.200 0 2.900-3.200 4.700-7.800 4.700-4.800 0-8.700-2-11.200-5.400" fill="none" stroke="#12302A" strokeWidth="6" strokeLinecap="round" />
      </svg>
      <span className="text-lg font-semibold tracking-tight text-mist">SmartFinance</span>
    </div>
  );
}
