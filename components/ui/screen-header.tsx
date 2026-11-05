import { NavArrows } from "@/components/layout/navigation";

export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-5 flex items-center gap-3 lg:mb-7">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-sage">{subtitle}</p>}
      </div>
      <NavArrows />
    </header>
  );
}
