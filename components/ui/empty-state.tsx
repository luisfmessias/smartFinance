export function EmptyState({ title, text, action, onClick }: { title: string; text: string; action?: string; onClick?: () => void }) {
  return (
    <div className="px-4 py-8 text-center">
      <p className="font-medium">{title}</p>
      <p className="mx-auto mt-1 max-w-xs text-sm leading-5 text-sage">{text}</p>
      {action && <button onClick={onClick} className="well mt-4 rounded-full px-5 py-2.5 text-sm font-medium">{action}</button>}
    </div>
  );
}
