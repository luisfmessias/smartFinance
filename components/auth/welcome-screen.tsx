import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Money } from "@/components/ui/money";
import { Progress } from "@/components/ui/progress";

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const month = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date());
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] lg:max-w-5xl lg:px-10">
      <Logo />
      <div className="flex flex-1 flex-col justify-end gap-10 pt-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        <div aria-hidden="true" className="animate-in lg:order-2">
          <div className="glass mx-auto max-w-sm rounded-[30px] p-6">
            <p className="text-sm text-sage">Gastos de {month}</p>
            <Money value={2480.9} className="mt-1 block text-[40px] leading-tight" />
            <div className="mt-6"><Progress ratio={0.5} /></div>
            <div className="mt-3 flex justify-between text-sm text-sage"><span>Limite de R$ 5.000</span><span>50%</span></div>
          </div>
        </div>
        <section>
          <h1 className="text-[40px] font-semibold leading-[1.08] tracking-tight [text-wrap:balance] lg:text-6xl">Seus gastos sob controle. Sua vida mais leve.</h1>
          <p className="mt-4 max-w-md leading-6 text-sage">Registre o que gastou, defina limites e veja para onde seu dinheiro está indo.</p>
          <div className="mt-8 flex max-w-sm flex-col gap-4">
            <button onClick={onStart} className="btn-primary">Começar agora <ArrowRight size={18} /></button>
            <p className="text-center text-sm text-sage">Já possui uma conta? <button onClick={onStart} className="font-medium text-mist underline-offset-4 hover:underline">Entrar</button></p>
          </div>
        </section>
      </div>
    </main>
  );
}
