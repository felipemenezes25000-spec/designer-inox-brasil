import type { Accent } from "@/content/types";
import { accentText } from "@/lib/accent";
import { SectionShell, SectionHeading } from "./primitives";

export function ListSection({
  id,
  index,
  eyebrow,
  title,
  lead,
  items,
  accent,
}: {
  id?: string;
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
  items: string[];
  accent?: Accent;
}) {
  return (
    <SectionShell id={id} className="py-20 sm:py-28">
      <SectionHeading index={index} eyebrow={eyebrow} title={title} lead={lead} align="between" />
      <ul className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li
            key={item}
            className="reveal specular flex min-w-0 gap-4 bg-background p-6 sm:p-8"
            data-reveal
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <span className={`label-mono shrink-0 ${accentText(accent)}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 text-sm leading-relaxed text-foreground/85">{item}</span>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
