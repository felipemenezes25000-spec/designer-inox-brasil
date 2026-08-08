import { SectionShell, SectionHeading } from "./primitives";

export interface CardItem {
  href: string;
  title: string;
  text: string;
}

export function CardGrid({
  index,
  eyebrow,
  title,
  lead,
  items,
  linkLabel = "Ver",
}: {
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
  items: CardItem[];
  /** Legado varia o rótulo por índice ("Ver serviço", "Ver contexto"). */
  linkLabel?: string;
}) {
  if (!items.length) return null;

  return (
    <SectionShell className="py-20 sm:py-28">
      <SectionHeading index={index} eyebrow={eyebrow} title={title} lead={lead} align="between" />
      <ul className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li
            key={item.href}
            className="reveal specular group bg-background"
            data-reveal
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <a href={item.href} className="flex min-h-full flex-col p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              <span className="label-mono mt-auto inline-flex items-center gap-3 pt-8 transition-colors group-hover:text-signal">
                {linkLabel}
                <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
