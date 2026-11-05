"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { categories } from "@/data/categories";
import type { CategoryKey } from "@/types";

const QUICK_COUNT = 6;

export function CategoryPicker({ value, onChange }: { value: CategoryKey; onChange: (value: CategoryKey) => void }) {
  const [expanded, setExpanded] = useState(false);
  const quick = categories.slice(0, QUICK_COUNT);
  const selected = categories.find((item) => item.key === value);
  // A categoria escolhida continua visível mesmo com a lista recolhida.
  const collapsed = selected && !quick.includes(selected) ? [...quick.slice(0, -1), selected] : quick;
  const visible = expanded ? categories : collapsed;

  return (
    <fieldset>
      <legend className="label">Categoria</legend>
      <div className="flex flex-wrap gap-2">
        {visible.map((item) => (
          <button key={item.key} type="button" aria-pressed={value === item.key} onClick={() => onChange(item.key)} className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${value === item.key ? "bg-lime text-pine" : "well text-mist"}`}>
            {item.name}
          </button>
        ))}
        <button type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="flex items-center gap-1 rounded-full px-2.5 py-2 text-sm font-medium text-sage hover:text-mist">
          {expanded ? "Ver menos" : "Ver todas"}
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>
    </fieldset>
  );
}
