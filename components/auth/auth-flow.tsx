"use client";

import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { errorMessage } from "@/services/api-client";
import { loginAccount, registerAccount, requestPasswordReset, resetPassword } from "@/services/auth-service";
import type { UserAccount } from "@/types";

type AuthMode = "login" | "register" | "forgot" | "reset";

export function AuthFlow({ resetToken, onResetDone, onAuthenticated }: { resetToken: string | null; onResetDone: () => void; onAuthenticated: (account: UserAccount) => Promise<void> }) {
  const [mode, setMode] = useState<AuthMode>(resetToken ? "reset" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setSuccess("");
  };

  const copy = {
    login: ["Que bom ter você aqui", "Entre para continuar organizando seus gastos."],
    register: ["Crie sua conta", "Comece hoje a cuidar melhor da sua rotina financeira."],
    forgot: ["Recuperar senha", "Informe seu e-mail e enviaremos as instruções."],
    reset: ["Redefinir senha", "Escolha uma nova senha para acessar sua conta."],
  }[mode];

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (mode === "reset" && password !== confirmPassword) return setError("As senhas precisam ser iguais.");
    setSubmitting(true);
    try {
      if (mode === "forgot") {
        await requestPasswordReset(email);
        setSuccess("Se este e-mail tiver uma conta, enviaremos as instruções em instantes.");
      } else if (mode === "reset") {
        await resetPassword(resetToken ?? "", password);
        setPassword("");
        setConfirmPassword("");
        onResetDone();
        setMode("login");
        setSuccess("Senha redefinida. Entre com a nova senha.");
      } else {
        await onAuthenticated(mode === "register" ? await registerAccount({ name, email, password }) : await loginAccount(email, password));
      }
    } catch (submitError) {
      setError(errorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md overflow-hidden bg-white px-6 pb-8 pt-12">
      <button onClick={() => mode === "login" ? undefined : changeMode("login")} className={`mb-10 rounded-full p-2 ${mode === "login" ? "invisible" : "bg-slate-50"}`} aria-label="Voltar">
        <ArrowLeft size={19} />
      </button>
      <Logo />
      <section className="mt-10 animate-in">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf">SmartFinance</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">{copy[0]}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">{copy[1]}</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          {mode === "register" && <Input icon={User} label="Nome completo" placeholder="Como podemos te chamar?" value={name} onChange={(event) => setName(event.target.value)} />}
          {mode !== "reset" && <Input icon={Mail} label="E-mail" placeholder="voce@email.com" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />}
          {(mode === "login" || mode === "register" || mode === "reset") && (
            <Input icon={LockKeyhole} label={mode === "reset" ? "Nova senha" : "Senha"} placeholder={mode === "login" ? "Sua senha" : "Mínimo de 8 caracteres"} minLength={mode === "login" ? undefined : 8} value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} action={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            } />
          )}
          {mode === "reset" && <Input icon={LockKeyhole} label="Confirmar senha" placeholder="Digite novamente" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />}
          {mode === "login" && <button type="button" onClick={() => changeMode("forgot")} className="block w-full text-right text-xs font-bold text-leaf">Esqueci minha senha</button>}
          <button disabled={submitting} className="w-full rounded-2xl bg-forest px-5 py-4 text-sm font-bold text-white transition active:scale-[0.98] disabled:opacity-60">
            {mode === "login" ? "Entrar" : mode === "register" ? "Criar minha conta" : mode === "forgot" ? "Enviar instruções" : "Redefinir senha"}
          </button>
          {error && <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-xs font-bold text-red-500">{error}</p>}
          {success && <p role="status" className="rounded-2xl bg-mint px-4 py-3 text-xs font-bold text-forest">{success}</p>}
        </form>
        {(mode === "login" || mode === "register") && (
          <p className="mt-7 text-center text-sm text-slate-500">
            {mode === "login" ? "Ainda não possui uma conta?" : "Já possui uma conta?"}{" "}
            <button onClick={() => changeMode(mode === "login" ? "register" : "login")} className="font-bold text-leaf">
              {mode === "login" ? "Cadastre-se" : "Entrar"}
            </button>
          </p>
        )}
      </section>
    </main>
  );
}

function Input({ icon: Icon, label, action, ...props }: { icon: typeof Mail; label: string; action?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-slate-600">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3.5 focus-within:border-leaf focus-within:ring-2 focus-within:ring-leaf/10">
        <Icon size={17} className="text-slate-400" />
        <input required className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-300" {...props} />
        {action}
      </div>
    </label>
  );
}
