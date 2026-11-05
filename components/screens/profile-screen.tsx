"use client";

import { useState } from "react";
import { Bell, ChevronRight, CircleHelp, LogOut, Settings2, ShieldCheck, UserRound } from "lucide-react";
import { getInitials } from "@/lib/format";
import { ScreenHeader } from "@/components/ui/screen-header";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { categories } from "@/data/categories";
import { errorMessage } from "@/services/api-client";
import { changePassword, logoutOtherSessions, updateAccount } from "@/services/auth-service";
import type { AppScreen, CategoryKey, UserAccount, UserPreferences } from "@/types";

const thresholds = [70, 80, 90].map((value) => ({ value, label: `${value}%` }));
const startScreens: { value: AppScreen; label: string }[] = [
  { value: "home", label: "Início" },
  { value: "expenses", label: "Gastos" },
  { value: "reports", label: "Relatórios" },
];
const categoryOptions = categories.map((category): { value: CategoryKey; label: string } => ({ value: category.key, label: category.name }));

export function ProfileScreen({ account, preferences, onPreferencesChange, onAccountChange, onLogout, onSessionError }: { account: UserAccount; preferences: UserPreferences; onPreferencesChange: (preferences: UserPreferences) => void; onAccountChange: (account: UserAccount) => void; onLogout: () => Promise<void>; onSessionError: (error: unknown) => never }) {
  const [panel, setPanel] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState(account.name);
  const [email, setEmail] = useState(account.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const update = (change: Partial<UserPreferences>) => onPreferencesChange({ ...preferences, ...change });
  const openPanel = (name: string) => {
    setFeedback("");
    setPanel(name);
  };
  const run = async (action: () => Promise<void>) => {
    setFeedback("");
    setSaving(true);
    try {
      await action().catch(onSessionError);
    } catch (actionError) {
      setFeedback(errorMessage(actionError));
    } finally {
      setSaving(false);
    }
  };
  const saveProfile = () => run(async () => {
    onAccountChange(await updateAccount({ name, email }));
    setPanel(null);
  });
  const savePassword = () => {
    if (newPassword !== confirmPassword) return setFeedback("As senhas precisam ser iguais.");
    return run(async () => {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFeedback("Senha alterada. As outras sessões foram encerradas.");
    });
  };
  const endOtherSessions = () => run(async () => {
    await logoutOtherSessions();
    setFeedback("As outras sessões foram encerradas.");
  });
  return (
    <div className="animate-in lg:max-w-xl">
      <ScreenHeader title="Meu perfil" subtitle="Sua conta e preferências." />
      <div className="glass flex items-center gap-4 rounded-[28px] p-5"><div className="well flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold">{getInitials(account.name)}</div><div className="min-w-0"><h2 className="truncate text-lg font-semibold tracking-tight">{account.name}</h2><p className="truncate text-sm text-sage">{account.email}</p></div></div>
      <div className="glass mt-4 divide-y divide-white/10 rounded-[28px] p-2"><ProfileItem icon={<UserRound size={18} strokeWidth={1.8} />} label="Dados pessoais" onClick={() => openPanel("Dados pessoais")} /><ProfileItem icon={<Bell size={18} strokeWidth={1.8} />} label="Notificações" onClick={() => openPanel("Notificações")} /><ProfileItem icon={<ShieldCheck size={18} strokeWidth={1.8} />} label="Privacidade e segurança" onClick={() => openPanel("Privacidade e segurança")} /><ProfileItem icon={<Settings2 size={18} strokeWidth={1.8} />} label="Preferências" onClick={() => openPanel("Preferências")} /><ProfileItem icon={<CircleHelp size={18} strokeWidth={1.8} />} label="Ajuda e suporte" onClick={() => openPanel("Ajuda e suporte")} /></div>
      <button disabled={saving} onClick={() => void run(onLogout)} className="glass mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-medium text-coral disabled:opacity-60"><LogOut size={17} /> Sair da conta</button>
      <p className="mt-5 text-center text-xs text-sage">SmartFinance versão 1.0.0</p>
      <ModalSheet open={Boolean(panel)} onClose={() => setPanel(null)} title={panel ?? ""} subtitle="Gerencie sua conta.">
        {panel === "Dados pessoais" && <div className="space-y-3"><ProfileInput label="Nome" value={name} onChange={setName} /><ProfileInput label="E-mail" type="email" value={email} onChange={setEmail} /><SaveButton disabled={saving} onClick={() => void saveProfile()} /></div>}
        {panel === "Notificações" && <div className="space-y-2"><Toggle label="Lembretes de orçamento" active={preferences.budgetAlerts} onClick={() => onPreferencesChange({ ...preferences, budgetAlerts: !preferences.budgetAlerts })} /><Toggle label="Resumo mensal" active={preferences.monthlySummary} onClick={() => onPreferencesChange({ ...preferences, monthlySummary: !preferences.monthlySummary })} /></div>}
        {panel === "Privacidade e segurança" && <div className="space-y-3"><ProfileInput label="Senha atual" type="password" value={currentPassword} onChange={setCurrentPassword} /><ProfileInput label="Nova senha" type="password" value={newPassword} onChange={setNewPassword} /><ProfileInput label="Confirmar nova senha" type="password" value={confirmPassword} onChange={setConfirmPassword} /><SaveButton disabled={saving} label="Alterar senha" onClick={() => void savePassword()} /><Action label="Encerrar outras sessões" onClick={() => void endOtherSessions()} /></div>}
        {panel === "Preferências" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Toggle label="Ocultar valores" active={preferences.hideValues} onClick={() => update({ hideValues: !preferences.hideValues })} />
              <Toggle label="Modo compacto" active={preferences.compactMode} onClick={() => update({ compactMode: !preferences.compactMode })} />
              <Toggle label="Reduzir animações" active={preferences.reduceMotion} onClick={() => update({ reduceMotion: !preferences.reduceMotion })} />
            </div>
            <Options label="Avisar quando o orçamento chegar a" value={preferences.alertThreshold} options={thresholds} onChange={(alertThreshold) => update({ alertThreshold })} />
            <Options label="Abrir o app em" value={preferences.startScreen} options={startScreens} onChange={(startScreen) => update({ startScreen })} />
            <Options label="Categoria padrão de novos gastos" value={preferences.defaultCategory} options={categoryOptions} onChange={(defaultCategory) => update({ defaultCategory })} />
          </div>
        )}
        {panel === "Ajuda e suporte" && <div className="space-y-2"><Action label="Perguntas frequentes" onClick={() => setFeedback("A central de ajuda será conectada na próxima integração.")} /><Action label="Falar com o suporte" onClick={() => setFeedback("Atendimento disponível de segunda a sexta, das 9h às 18h.")} /><Action label="Termos de uso" onClick={() => setFeedback("Termos de uso atualizados em junho de 2026.")} /></div>}
        {feedback && <p role="status" className="alert-success mt-4">{feedback}</p>}
      </ModalSheet>
    </div>
  );
}

function ProfileItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return <div><button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left transition-colors hover:bg-white/5"><span className="text-sage">{icon}</span><span className="flex-1 font-medium">{label}</span><ChevronRight size={16} className="text-sage" /></button></div>;
}

function ProfileInput({ label, type = "text", value, onChange }: { label: string; type?: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="label">{label}</span><input required type={type} value={value} onChange={(event) => onChange(event.target.value)} className="field" /></label>;
}

function SaveButton({ onClick, disabled, label = "Salvar alterações" }: { onClick: () => void; disabled: boolean; label?: string }) {
  return <button disabled={disabled} onClick={onClick} className="btn-primary">{label}</button>;
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button role="switch" aria-checked={active} onClick={onClick} className="well flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left font-medium"><span>{label}</span><span className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors ${active ? "justify-end bg-lime" : "justify-start bg-white/15"}`}><i className={`h-5 w-5 rounded-full ${active ? "bg-pine" : "bg-mist"}`} /></span></button>;
}

function Options<Value extends string | number>({ label, value, options, onChange }: { label: string; value: Value; options: { value: Value; label: string }[]; onChange: (value: Value) => void }) {
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button key={option.value} aria-pressed={option.value === value} onClick={() => onChange(option.value)} className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${option.value === value ? "bg-lime text-pine" : "well"}`}>{option.label}</button>
        ))}
      </div>
    </fieldset>
  );
}

function Action({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick} className="well flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left font-medium">{label}<ChevronRight size={16} className="text-sage" /></button>;
}
