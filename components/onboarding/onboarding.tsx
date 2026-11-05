"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Bike, Car, Check, Coffee, ShoppingBag, Tv } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { getProgressTone, Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format";

const habits = [
  { key: "coffee", label: "Café na rua todo dia", monthly: 176, icon: Coffee },
  { key: "delivery", label: "Delivery duas vezes por semana", monthly: 280, icon: Bike },
  { key: "rides", label: "Corridas de app no fim de semana", monthly: 200, icon: Car },
  { key: "streaming", label: "Assinaturas que quase não uso", monthly: 60, icon: Tv },
  { key: "impulse", label: "Compras por impulso", monthly: 150, icon: ShoppingBag },
];

const simulatedExpenses = [
  { key: "home", label: "Casa", share: 0.3 },
  { key: "groceries", label: "Mercado", share: 0.25 },
  { key: "bills", label: "Contas", share: 0.2 },
  { key: "transport", label: "Transporte", share: 0.15 },
  { key: "leisure", label: "Lazer", share: 0.1 },
  { key: "gifts", label: "Presentes", share: 0.1 },
];

const LAST_STEP = 3;
const MIN_LIMIT = 500;
const MAX_LIMIT = 10000;

// Posição da luz de fundo em cada etapa: ela acompanha a pessoa pela introdução.
const lightPositions = ["translate(55vw, -8vh)", "translate(-20vw, 18vh)", "translate(45vw, 52vh)", "translate(5vw, 8vh)"];

const whole = (value: number) => formatCurrency(value).replace(/,\d{2}$/, "");

function useCountUp(target: number) {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      current.current = target;
      setValue(target);
      return;
    }
    const initial = current.current;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 550, 1);
      current.current = initial + (target - initial) * (1 - (1 - progress) ** 3);
      setValue(current.current);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}

export function Onboarding({ initialLimit, onSkip, onFinish }: { initialLimit: number; onSkip: () => void; onFinish: (result: { monthlyBudget: number; useLimit: boolean }) => void }) {
  const [step, setStep] = useState(0);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [limit, setLimit] = useState(Math.min(Math.max(Math.round(initialLimit / 100) * 100, MIN_LIMIT), MAX_LIMIT));
  const [simulated, setSimulated] = useState<string[]>([]);
  const touchStart = useRef<number | null>(null);
  const yearlyLeak = habits.filter((habit) => selectedHabits.includes(habit.key)).reduce((total, habit) => total + habit.monthly * 12, 0);

  const go = (next: number) => setStep(Math.min(Math.max(next, 0), LAST_STEP));

  const onTouchStart = (event: React.TouchEvent) => {
    // Arrastar o controle de limite não deve trocar de etapa.
    touchStart.current = (event.target as HTMLElement).tagName === "INPUT" ? null : event.touches[0].clientX;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(distance) > 60) go(step + (distance < 0 ? 1 : -1));
    touchStart.current = null;
  };

  return (
    <main onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 -z-[1] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgb(220_245_164/0.3),transparent_65%)] transition-transform duration-1000 ease-out" style={{ transform: lightPositions[step] }} />

      <header className="flex items-center justify-between">
        <Logo />
        {step < LAST_STEP && <button onClick={onSkip} className="px-1 py-2 text-sm font-medium text-sage hover:text-mist">Pular</button>}
      </header>

      <div className="mt-5 flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={LAST_STEP + 1} aria-valuenow={step + 1} aria-label="Etapa da introdução">
        {Array.from({ length: LAST_STEP + 1 }, (_, index) => (
          <span key={index} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
            <span className={`block h-full rounded-full bg-lime transition-all duration-500 ${index <= step ? "w-full" : "w-0"}`} />
          </span>
        ))}
      </div>

      <section key={step} className="animate-in flex flex-1 flex-col justify-center py-6">
        {step === 0 && <LeakStep selected={selectedHabits} yearlyLeak={yearlyLeak} onToggle={(key) => setSelectedHabits((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])} />}
        {step === 1 && <LimitStep limit={limit} onChange={setLimit} />}
        {step === 2 && <SimulationStep limit={limit} selected={simulated} onToggle={(key) => setSimulated((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])} />}
        {step === 3 && <PlanStep limit={limit} yearlyLeak={yearlyLeak} />}
      </section>

      <footer className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {step > 0 && <button onClick={() => go(step - 1)} aria-label="Etapa anterior" className="glass flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full"><ArrowLeft size={19} /></button>}
          {step < LAST_STEP
            ? <button onClick={() => go(step + 1)} className="btn-primary">Continuar <ArrowRight size={18} /></button>
            : <button onClick={() => onFinish({ monthlyBudget: limit, useLimit: true })} className="btn-primary">Usar este limite <ArrowRight size={18} /></button>}
        </div>
        {step === LAST_STEP && <button onClick={() => onFinish({ monthlyBudget: limit, useLimit: false })} className="text-center text-sm font-medium text-sage hover:text-mist">Manter o limite padrão</button>}
      </footer>
    </main>
  );
}

function Heading({ title, text }: { title: string; text: string }) {
  return (
    <>
      <h1 className="text-[32px] font-semibold leading-[1.1] tracking-tight [text-wrap:balance]">{title}</h1>
      <p className="mt-2 leading-6 text-sage">{text}</p>
    </>
  );
}

function LeakStep({ selected, yearlyLeak, onToggle }: { selected: string[]; yearlyLeak: number; onToggle: (key: string) => void }) {
  const total = useCountUp(yearlyLeak);
  return (
    <>
      <Heading title="Para onde vai o seu dinheiro?" text="Toque no que faz parte do seu mês." />
      <div className="glass mt-5 rounded-[28px] p-5">
        <p className="text-sm text-sage">{yearlyLeak ? "Isso soma, em um ano" : "Seu total anual aparece aqui"}</p>
        <p className={`mt-1 text-[42px] font-semibold leading-tight tracking-tight ${yearlyLeak ? "text-lime" : ""}`}>{whole(total)}</p>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {habits.map(({ key, label, monthly, icon: Icon }) => {
          const active = selected.includes(key);
          return (
            <button key={key} onClick={() => onToggle(key)} aria-pressed={active} className={`flex items-center gap-3 rounded-[20px] px-3 py-2.5 text-left transition-colors ${active ? "bg-lime text-pine" : "well"}`}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center">{active ? <Check size={18} /> : <Icon size={18} strokeWidth={1.8} />}</span>
              <span className="min-w-0 flex-1 text-sm font-medium">{label}</span>
              <span className={`shrink-0 text-sm ${active ? "" : "text-sage"}`}>{whole(monthly)}/mês</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-sage">Estimativas com valores médios.</p>
    </>
  );
}

function LimitStep({ limit, onChange }: { limit: number; onChange: (limit: number) => void }) {
  const ratio = (limit - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT);
  return (
    <>
      <Heading title="Quanto você quer gastar por mês?" text="Arraste para definir seu limite. Você pode mudar depois." />
      <div className="glass mt-6 rounded-[28px] px-6 pb-6 pt-7">
        <div className="relative mx-auto max-w-[260px]">
          <svg viewBox="0 0 200 110" className="w-full" aria-hidden="true">
            <path d="M 14 100 A 86 86 0 0 1 186 100" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="12" strokeLinecap="round" />
            <path d="M 14 100 A 86 86 0 0 1 186 100" fill="none" stroke="#DCF5A4" strokeWidth="12" strokeLinecap="round" pathLength={100} strokeDasharray={`${ratio * 100} 100`} />
          </svg>
          <div className="absolute inset-x-0 bottom-0 text-center">
            <p className="text-[32px] font-semibold leading-tight tracking-tight">{whole(limit)}</p>
            <p className="text-sm text-sage">por mês</p>
          </div>
        </div>
        <input
          type="range"
          min={MIN_LIMIT}
          max={MAX_LIMIT}
          step={100}
          value={limit}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label="Limite mensal"
          className="range mt-7"
          style={{ "--range-fill": `${ratio * 100}%` } as React.CSSProperties}
        />
        <div className="mt-2 flex justify-between text-xs text-sage"><span>{whole(MIN_LIMIT)}</span><span>{whole(MAX_LIMIT)}</span></div>
      </div>
      <p className="mt-4 text-center leading-6">Isso dá cerca de <span className="font-semibold text-lime">{whole(limit / 30)} por dia</span>.</p>
    </>
  );
}

function SimulationStep({ limit, selected, onToggle }: { limit: number; selected: string[]; onToggle: (key: string) => void }) {
  const amountOf = (share: number) => Math.round((limit * share) / 10) * 10;
  const spent = simulatedExpenses.filter((item) => selected.includes(item.key)).reduce((total, item) => total + amountOf(item.share), 0);
  const shownSpent = useCountUp(spent);
  const ratio = shownSpent / limit;
  const tone = getProgressTone(spent / limit, 80);
  const message = { normal: selected.length ? "Tudo sob controle." : "Toque em um gasto para começar.", warning: "Perto do limite. Hora de segurar.", over: "Limite ultrapassado neste mês." }[tone];
  const color = { normal: "text-sage", warning: "text-amber", over: "text-coral" }[tone];

  return (
    <>
      <Heading title="Veja seu mês em tempo real" text="Simule alguns gastos e acompanhe o limite que você definiu." />
      <div className="glass mt-5 rounded-[28px] p-5">
        <p className="text-sm text-sage">Gastos do mês</p>
        <p className="mt-1 text-[38px] font-semibold leading-tight tracking-tight">{whole(shownSpent)}</p>
        <div className="mt-4"><Progress ratio={ratio} tone={tone} /></div>
        <div className="mt-2.5 flex items-center justify-between gap-3 text-sm">
          <span className={color}>{message}</span>
          <span className="shrink-0 text-sage">de {whole(limit)}</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {simulatedExpenses.map((item) => {
          const active = selected.includes(item.key);
          return (
            <button key={item.key} onClick={() => onToggle(item.key)} aria-pressed={active} className={`rounded-[20px] px-4 py-3 text-left transition-colors ${active ? "bg-lime text-pine" : "well"}`}>
              <span className="block text-sm font-medium">{item.label}</span>
              <span className={`block text-sm ${active ? "" : "text-sage"}`}>{whole(amountOf(item.share))}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function PlanStep({ limit, yearlyLeak }: { limit: number; yearlyLeak: number }) {
  const saving = useCountUp(yearlyLeak / 2);
  return (
    <>
      <Heading title="Seu plano está pronto" text="Agora é só registrar o dia a dia." />
      <div className="glass mt-6 rounded-[28px] p-6">
        {yearlyLeak > 0 && (
          <div className="mb-5 border-b border-white/10 pb-5">
            <p className="text-sm text-sage">Cortando pela metade o que você marcou</p>
            <p className="mt-1 text-[42px] font-semibold leading-tight tracking-tight text-lime">{whole(saving)}</p>
            <p className="text-sm text-sage">a mais no bolso em um ano</p>
          </div>
        )}
        <ul className="flex flex-col gap-3">
          <PlanItem text={`Limite mensal de ${whole(limit)}`} />
          <PlanItem text="Aviso ao chegar a 80% do limite" />
          <PlanItem text="Relatório mensal em PDF" />
        </ul>
      </div>
    </>
  );
}

function PlanItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime text-pine"><Check size={14} strokeWidth={2.6} /></span>
      <span className="font-medium">{text}</span>
    </li>
  );
}
