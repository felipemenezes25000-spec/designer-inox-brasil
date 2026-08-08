import { SectionShell } from "./primitives";

export interface LegalBlock {
  heading: string;
  paragraphs: string[];
}

export function LegalDoc({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <SectionShell className="py-20 sm:py-28">
      <div className="max-w-3xl">
        {blocks.map((block, i) => (
          <section
            key={block.heading}
            className="reveal border-t border-border py-10 first:border-t-0 first:pt-0"
            data-reveal
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
              {block.heading}
            </h2>
            {block.paragraphs.map((p) => (
              <p key={p} className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </SectionShell>
  );
}
