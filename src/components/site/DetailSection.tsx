import { gridFillerCount } from "@/lib/utils";
import { SectionShell, SectionHeading } from "./primitives";

export interface DetailItem {
  title: string;
  text: string;
}

export function DetailSection({
  index,
  eyebrow,
  title,
  lead,
  items,
  columns = 2,
}: {
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
  items: DetailItem[];
  columns?: 2 | 3;
}) {
  if (!items.length) return null;

  return (
    <SectionShell className="py-20 sm:py-28">
      <SectionHeading index={index} eyebrow={eyebrow} title={title} lead={lead} align="between" />
      <ul
        className={`mt-14 grid gap-px bg-border ${
          columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        {items.map((item, i) => (
          <li
            key={item.title}
            className="reveal specular bg-background p-6 sm:p-8 lg:p-10"
            data-reveal
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <h3 className="font-display text-xl font-bold tracking-tight">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </li>
        ))}
        {Array.from({ length: gridFillerCount(items.length, columns) }).map((_, i) => (
          // Preenche a última linha para o fundo do container (bg-border) não
          // aparecer como célula cinza — ver gridFillerCount em lib/utils.
          <li key={`filler-${i}`} aria-hidden="true" className="bg-background" />
        ))}
      </ul>
    </SectionShell>
  );
}
