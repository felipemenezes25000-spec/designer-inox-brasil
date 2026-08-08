import { SectionShell, SectionHeading, MagneticLink } from "./primitives";
import { categories, services } from "@/content/services";
import { whatsapp } from "@/content/site";

const fronts = categories.map((cat, i) => {
  const items = services.filter((s) => s.category === cat.id);
  return {
    id: String(i + 1).padStart(2, "0"),
    title: cat.label,
    count: `${items.length} ${items.length === 1 ? "serviço" : "serviços"}`,
    summary: cat.note,
    items,
  };
});

export function Solutions() {
  return (
    <SectionShell id="solucoes" className="py-20 sm:py-28 lg:py-36">
      <SectionHeading
        index="02"
        eyebrow="Soluções por objetivo"
        align="between"
        title={
          <>
            Menos catálogo.
            <span className="block text-muted-foreground">Mais clareza sobre o que resolve.</span>
          </>
        }
        lead="Os 13 serviços estão organizados em quatro frentes. É possível contratar uma etapa isolada ou coordenar projeto, fabricação, sistemas e instalação."
      />

      <ul className="mt-14 grid gap-px bg-border lg:grid-cols-2 xl:grid-cols-4">
        {fronts.map((f, i) => (
          <li
            key={f.id}
            className="reveal specular group flex min-w-0 flex-col bg-background p-6 transition-colors duration-500 hover:bg-secondary/50 sm:p-8 lg:p-10"
            data-reveal
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-4">
              <span className="label-mono text-signal">{f.id}</span>
              <span className="label-mono min-w-0 text-right">{f.count}</span>
            </div>

            <h3 className="mt-8 font-display text-2xl font-bold tracking-tight sm:text-[1.7rem]">
              {f.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.summary}</p>

            <ul className="mt-8 flex flex-col gap-px bg-border/70">
              {f.items.map((item) => (
                <li key={item.slug} className="bg-background py-3">
                  <a
                    href={`/${item.slug}/`}
                    className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 text-sm text-foreground/85 transition-colors hover:text-signal"
                  >
                    <span aria-hidden="true" className="mt-2.5 block h-px w-3 bg-border" />
                    <span className="min-w-0">{item.navTitle}</span>
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={whatsapp(`Olá! Meu interesse é: ${f.title}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="label-mono mt-auto inline-flex min-h-11 items-center gap-3 pt-10 text-foreground transition-colors hover:text-signal"
            >
              Começar por esta frente
              <span
                aria-hidden="true"
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="reveal mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" data-reveal>
        <MagneticLink
          href={whatsapp("Olá! Não sei por onde começar. Pode me orientar?")}
          variant="ghost"
          external
        >
          Não sei por onde começar
        </MagneticLink>
        <a
          href="/servicos/"
          className="label-mono group inline-flex min-h-11 items-center gap-3 text-foreground transition-colors hover:text-signal"
        >
          Ver todos os serviços
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </SectionShell>
  );
}
