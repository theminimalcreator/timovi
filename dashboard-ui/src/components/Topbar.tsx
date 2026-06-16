interface TopbarProps {
  title: string
  breadcrumb: string
  badges?: { label: string; color: string }[]
}

export function Topbar({ title, breadcrumb, badges }: TopbarProps) {
  return (
    <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-6 py-3 flex items-center justify-between">
      <div>
        <div className="text-base font-semibold font-[family-name:var(--font-heading)]">
          {title}
        </div>
        <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
          {breadcrumb}
        </div>
      </div>
      {badges && (
        <div className="flex gap-2">
          {badges.map((b, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: `${b.color}15`, color: b.color }}
            >
              {b.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
