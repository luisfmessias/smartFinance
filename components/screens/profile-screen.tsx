"use client";

import { useState } from "react";
import { Bell, ChevronRight, CircleHelp, LogOut, Settings2, ShieldCheck, UserRound } from "lucide-react";
import { ScreenHeader } from "@/components/ui/screen-header";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { updateAccount } from "@/services/account-service";
import type { UserAccount, UserPreferences } from "@/types";

export function ProfileScreen({ account, preferences, onPreferencesChange, onAccountChange, onLogout }: { account: UserAccount; preferences: UserPreferences; onPreferencesChange: (preferences: UserPreferences) => void; onAccountChange: (account: UserAccount) => void; onLogout: () => void }) {
  const [panel, setPanel] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState(account.name);
  const [email, setEmail] = useState(account.email);
  const openPanel = (name: string) => {
    setFeedback("");
    setPanel(name);
  };
  const saveProfile = () => {
    try {
      const updated = updateAccount(account.email, { name, email });
      onAccountChange(updated);
      setPanel(null);
    } catch (saveError) {
      setFeedback(saveError instanceof Error ? saveError.message : "Não foi possível salvar os dados.");
    }
  };
  return (
    <div className="animate-in">
      <ScreenHeader title="Meu perfil" subtitle="Preferências e configurações da conta." />
      <div className="flex items-center gap-4 rounded-3xl bg-forest p-5 text-white"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-lg font-bold">{getInitials(account.name)}</div><div><h2 className="font-bold">{account.name}</h2><p className="mt-1 text-xs text-white/60">{account.email}</p></div></div>
      <div className="mt-5 space-y-2"><ProfileItem icon={<UserRound size={18} />} label="Dados pessoais" onClick={() => openPanel("Dados pessoais")} /><ProfileItem icon={<Bell size={18} />} label="Notificações" onClick={() => openPanel("Notificações")} /><ProfileItem icon={<ShieldCheck size={18} />} label="Privacidade e segurança" onClick={() => openPanel("Privacidade e segurança")} /><ProfileItem icon={<Settings2 size={18} />} label="Preferências" onClick={() => openPanel("Preferências")} /><ProfileItem icon={<CircleHelp size={18} />} label="Ajuda e suporte" onClick={() => openPanel("Ajuda e suporte")} /></div>
      <button onClick={onLogout} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 py-3.5 text-sm font-bold text-red-500"><LogOut size={17} /> Sair da conta</button>
      <p className="mt-5 text-center text-[10px] text-slate-400">SmartFinance versão 1.0.0</p>
      <ModalSheet open={Boolean(panel)} onClose={() => setPanel(null)} title={panel ?? ""} subtitle="Gerencie suas configurações do SmartFinance.">
        {panel === "Dados pessoais" && <div className="space-y-3"><ProfileInput label="Nome" value={name} onChange={setName} /><ProfileInput label="E-mail" type="email" value={email} onChange={setEmail} /><SaveButton onClick={saveProfile} /></div>}
        {panel === "Notificações" && <div className="space-y-2"><Toggle label="Lembretes de orçamento" active={preferences.budgetAlerts} onClick={() => onPreferencesChange({ ...preferences, budgetAlerts: !preferences.budgetAlerts })} /><Toggle label="Resumo mensal" active={preferences.monthlySummary} onClick={() => onPreferencesChange({ ...preferences, monthlySummary: !preferences.monthlySummary })} /></div>}
        {panel === "Privacidade e segurança" && <div className="space-y-2"><Action label="Alterar senha" onClick={() => setFeedback("As instruções para alterar sua senha foram enviadas por e-mail.")} /><Action label="Gerenciar sessões ativas" onClick={() => setFeedback("Você possui somente esta sessão ativa.")} /></div>}
        {panel === "Preferências" && <div className="space-y-3"><label className="block text-xs font-bold text-slate-600">Moeda<select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"><option>Real brasileiro (R$)</option></select></label><Toggle label="Modo compacto" active={preferences.compactMode} onClick={() => onPreferencesChange({ ...preferences, compactMode: !preferences.compactMode })} /></div>}
        {panel === "Ajuda e suporte" && <div className="space-y-2"><Action label="Perguntas frequentes" onClick={() => setFeedback("A central de ajuda será conectada na próxima integração.")} /><Action label="Falar com o suporte" onClick={() => setFeedback("Atendimento disponível de segunda a sexta, das 9h às 18h.")} /><Action label="Termos de uso" onClick={() => setFeedback("Termos de uso atualizados em junho de 2026.")} /></div>}
        {feedback && <p className="mt-4 rounded-2xl bg-mint p-3 text-xs leading-5 text-forest">{feedback}</p>}
      </ModalSheet>
    </div>
  );
}

function ProfileItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm"><span className="text-leaf">{icon}</span><span className="flex-1 text-sm font-bold">{label}</span><ChevronRight size={16} className="text-slate-300" /></button>;
}

function ProfileInput({ label, type = "text", value, onChange }: { label: string; type?: string; value: string; onChange: (value: string) => void }) {
  return <label className="block text-xs font-bold text-slate-600">{label}<input required type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-normal outline-none focus:border-leaf" /></label>;
}

function SaveButton({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="w-full rounded-2xl bg-forest px-5 py-3.5 text-sm font-bold text-white">Salvar alterações</button>;
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className="flex w-full items-center justify-between rounded-2xl border border-slate-100 px-4 py-3.5 text-left text-sm font-bold"><span>{label}</span><span className={`flex h-6 w-11 items-center rounded-full px-1 transition ${active ? "justify-end bg-leaf" : "justify-start bg-slate-200"}`}><i className="h-4 w-4 rounded-full bg-white" /></span></button>;
}

function Action({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick} className="flex w-full items-center justify-between rounded-2xl border border-slate-100 px-4 py-3.5 text-left text-sm font-bold">{label}<ChevronRight size={16} className="text-slate-300" /></button>;
}

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}
