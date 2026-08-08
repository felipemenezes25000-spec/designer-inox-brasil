import type { FaqItem } from "@/content/types";
import { SectionShell, SectionHeading } from "./primitives";

export function FaqSection({
  items,
  title = "Antes da proposta.",
  index = "07",
}: {
  items: FaqItem[];
  title?: string;
  index?: string;
}) {
  if (!items.length) return null;

  return (
    <SectionShell id="duvidas" className="py-20 sm:py-28">
      <SectionHeading
        index={index}
        eyebrow="Dúvidas"
        title={title}
        lead="O que costuma ser perguntado antes de uma avaliação técnica."
        align="between"
      />
      <dl className="mt-14 flex flex-col gap-px bg-border">
        {items.map((item, i) => (
          <div
            key={item.q}
            className="reveal bg-background py-8"
            data-reveal
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <dt className="font-display text-lg font-semibold tracking-tight sm:text-xl">
              {item.q}
            </dt>
            <dd className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
