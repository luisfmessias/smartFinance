export function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`text-[29px] font-bold leading-none tracking-[-0.18em] ${light ? "text-white" : "text-forest"}`}>
        S<span className="text-leaf">F</span>
      </div>
      {!compact && (
        <span className={`text-xl font-bold tracking-tight ${light ? "text-white" : "text-forest"}`}>
          Smart<span className="text-leaf">Finance</span>
        </span>
      )}
    </div>
  );
}
