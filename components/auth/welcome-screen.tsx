import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-forest px-7 pb-8 pt-14 text-white">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-leaf/25 blur-3xl" />
      <div className="relative flex justify-center"><Logo light /></div>
      <section className="relative mt-auto min-w-0 max-w-full pb-10">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium">
          <ShieldCheck size={15} /> Organização sem complicação
        </span>
        <h1 className="max-w-full break-words text-4xl font-bold leading-tight tracking-tight">Seus gastos sob controle. Sua vida mais leve.</h1>
        <p className="mt-4 text-sm leading-6 text-white/70">
          Acompanhe seus gastos, crie limites e tome decisões melhores com uma visão simples da sua rotina financeira.
        </p>
        <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/80">
          <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-300" /> Fácil de usar</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-300" /> Feito para você</span>
        </div>
      </section>
      <button onClick={onStart} className="relative flex min-w-0 max-w-full items-center justify-center gap-2 rounded-2xl bg-leaf px-5 py-4 text-sm font-bold shadow-lg shadow-black/10 transition active:scale-[0.98]">
        Começar agora <ArrowRight size={17} />
      </button>
      <p className="relative mt-4 text-center text-xs text-white/55">Já possui uma conta? <button onClick={onStart} className="font-bold text-white">Entrar</button></p>
    </main>
  );
}
