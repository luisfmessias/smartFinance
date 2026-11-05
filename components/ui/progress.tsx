const tones = { normal: "bg-lime", warning: "bg-amber", over: "bg-coral" };

export type ProgressTone = keyof typeof tones;

export const getProgressTone = (ratio: number, alertThreshold: number): ProgressTone => ratio > 1 ? "over" : ratio >= alertThreshold / 100 ? "warning" : "normal";

export function Progress({ ratio, tone = "normal" }: { ratio: number; tone?: ProgressTone }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
      <div className={`h-full rounded-full ${tones[tone]}`} style={{ width: `${Math.min(ratio, 1) * 100}%` }} />
    </div>
  );
}
