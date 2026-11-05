"use client";

import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { errorMessage } from "@/services/api-client";
import { loginAccount, registerAccount, requestPasswordReset, resetPassword } from "@/services/auth-service";
import type { UserAccount } from "@/types";

type AuthMode = "login" | "register" | "forgot" | "reset";

export function AuthFlow({ resetToken, initialMode = "login", onResetDone, onAuthenticated }: { resetToken: string | null; initialMode?: "login" | "register"; onResetDone: () => void; onAuthenticated: (account: UserAccount, isNewAccount: boolean) => Promise<void> }) {
  const [mode, setMode] = useState<AuthMode>(resetToken ? "reset" : initialMode);
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
        await onAuthenticated(mode === "register" ? await registerAccount({ name, email, password }) : await loginAccount(email, password), mode === "register");
      }
    } catch (submitError) {
      setError(errorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="mb-6 flex items-center justify-between px-1">
        <Logo />
        {mode !== "login" && (
          <button onClick={() => changeMode("login")} className="glass flex h-10 w-10 items-center justify-center rounded-full" aria-label="Voltar">
            <ArrowLeft size={18} />
          </button>
        )}
      </div>
      <section className="glass animate-in rounded-[32px] p-6">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight">{copy[0]}</h1>
        <p className="mt-1.5 text-sm leading-5 text-sage">{copy[1]}</p>
        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          {mode === "register" && <Input label="Nome completo" placeholder="Como podemos te chamar?" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />}
          {mode !== "reset" && <Input label="E-mail" placeholder="voce@email.com" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />}
          {mode !== "forgot" && (
            <Input
              label={mode === "reset" ? "Nova senha" : "Senha"}
              placeholder={mode === "login" ? "Sua senha" : "Mínimo de 8 caracteres"}
              minLength={mode === "login" ? undefined : 8}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type={showPassword ? "text" : "password"}
              action={<button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sage" aria-label={showPassword ? "Ocultar" : "Mostrar"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
            />
          )}
          {mode === "reset" && <Input label="Confirmar senha" placeholder="Digite novamente" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />}
          {mode === "login" && <button type="button" onClick={() => changeMode("forgot")} className="-mt-1 self-end text-sm font-medium text-sage hover:text-mist">Esqueci minha senha</button>}
          {error && <p role="alert" className="alert-error">{error}</p>}
          {success && <p role="status" className="alert-success">{success}</p>}
          <button disabled={submitting} className="btn-primary mt-1">
            {mode === "login" ? "Entrar" : mode === "register" ? "Criar minha conta" : mode === "forgot" ? "Enviar instruções" : "Redefinir senha"}
          </button>
        </form>
      </section>
      {(mode === "login" || mode === "register") && (
        <p className="mt-5 text-center text-sm text-sage">
          {mode === "login" ? "Ainda não possui uma conta?" : "Já possui uma conta?"}{" "}
          <button onClick={() => changeMode(mode === "login" ? "register" : "login")} className="font-medium text-mist underline-offset-4 hover:underline">
            {mode === "login" ? "Cadastre-se" : "Entrar"}
          </button>
        </p>
      )}
    </main>
  );
}

function Input({ label, action, ...props }: { label: string; action?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <div className="field flex items-center gap-3">
        <input required className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-sage/70" {...props} />
        {action}
      </div>
    </label>
  );
}
