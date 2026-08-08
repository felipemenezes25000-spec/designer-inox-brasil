import { serviceBySlug } from "@/content/services";
import { SectionShell, SectionHeading } from "./primitives";

export function RelatedSection({
  slugs,
  index = "08",
  eyebrow = "Relacionados",
  title = "O que costuma entrar junto.",
  lead = "Serviços que aparecem no mesmo escopo com frequência.",
}: {
  slugs: string[];
  index?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
}) {
  const related = slugs.map((s) => serviceBySlug.get(s)).filter((s) => s !== undefined);
  if (!related.length) return null;

  return (
    <SectionShell className="py-20 sm:py-28">
      <SectionHeading index={index} eyebrow={eyebrow} title={title} lead={lead} align="between" />
      <ul className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {related.map((s, i) => (
          <li
            key={s.slug}
            className="reveal specular group bg-background"
            data-reveal
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <a href={`/${s.slug}/`} className="flex min-h-full flex-col p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold tracking-tight">{s.navTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.short}</p>
              <span className="label-mono mt-auto inline-flex items-center gap-3 pt-8 transition-colors group-hover:text-signal">
                Ver serviço
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
