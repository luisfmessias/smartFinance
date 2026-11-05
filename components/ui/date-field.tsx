"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { capitalize, formatLongDate, toLocalDate } from "@/lib/format";

const weekdays = ["D", "S", "T", "Q", "Q", "S", "S"];
const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });

const pad = (value: number) => String(value).padStart(2, "0");

function shiftMonth(period: string, amount: number) {
  const [year, month] = period.split("-").map(Number);
  const date = new Date(year, month - 1 + amount, 1);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function getYesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return toLocalDate(date);
}

export function DateField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState(value.slice(0, 7));
  const calendar = useRef<HTMLDivElement>(null);
  const today = toLocalDate();
  const [year, month] = period.split("-").map(Number);
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const lastDay = new Date(year, month, 0).getDate();

  useEffect(() => {
    if (open) calendar.current?.scrollIntoView({ block: "nearest" });
  }, [open]);

  const select = (date: string) => {
    onChange(date);
    setOpen(false);
  };

  const toggle = () => {
    setPeriod(value.slice(0, 7));
    setOpen(!open);
  };

  return (
    <div>
      <span className="label">{label}</span>
      <button type="button" onClick={toggle} aria-expanded={open} aria-label={`${label}: ${formatLongDate(value)}`} className="field flex items-center justify-between gap-3 text-left">
        {formatLongDate(value)}
        <CalendarDays size={18} strokeWidth={1.8} className="shrink-0 text-sage" />
      </button>

      {open && (
        <div ref={calendar} className="well animate-in mt-2 rounded-[22px] p-3">
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setPeriod(shiftMonth(period, -1))} aria-label="Mês anterior" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"><ChevronLeft size={18} /></button>
            <span className="font-medium">{capitalize(monthFormatter.format(new Date(year, month - 1, 1)))}</span>
            <button type="button" onClick={() => setPeriod(shiftMonth(period, 1))} aria-label="Próximo mês" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"><ChevronRight size={18} /></button>
          </div>
          <div className="mt-2 grid grid-cols-7 text-center text-xs text-sage">
            {weekdays.map((day, index) => <span key={index} className="py-1">{day}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstWeekday }, (_, index) => <span key={index} />)}
            {Array.from({ length: lastDay }, (_, index) => {
              const date = `${period}-${pad(index + 1)}`;
              const selected = date === value;
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => select(date)}
                  aria-label={formatLongDate(date)}
                  aria-pressed={selected}
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${selected ? "bg-lime font-semibold text-pine" : date === today ? "font-semibold shadow-[inset_0_0_0_1px_rgb(255_255_255/0.4)]" : "hover:bg-white/10"}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex gap-2 border-t border-white/10 pt-3">
            <button type="button" onClick={() => select(today)} className="well flex-1 rounded-full py-2 text-sm font-medium">Hoje</button>
            <button type="button" onClick={() => select(getYesterday())} className="well flex-1 rounded-full py-2 text-sm font-medium">Ontem</button>
          </div>
        </div>
      )}
    </div>
  );
}
