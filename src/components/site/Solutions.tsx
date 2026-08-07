import { SectionShell, SectionHeading, MagneticLink } from "./primitives";
import { FRONTS, whatsappLink } from "@/lib/site-data";

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
        {FRONTS.map((f, i) => (
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
                <li key={item} className="bg-background py-3">
                  <span className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 text-sm text-foreground/85">
                    <span aria-hidden="true" className="mt-2.5 block h-px w-3 bg-border" />
                    <span className="min-w-0">{item}</span>
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={whatsappLink(`Olá! Meu interesse é: ${f.title}.`)}
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

      <div className="reveal mt-12 flex flex-col gap-3 sm:flex-row" data-reveal>
        <MagneticLink
          href={whatsappLink("Olá! Não sei por onde começar. Pode me orientar?")}
          variant="ghost"
          external
        >
          Não sei por onde começar
        </MagneticLink>
      </div>
    </SectionShell>
  );
}
