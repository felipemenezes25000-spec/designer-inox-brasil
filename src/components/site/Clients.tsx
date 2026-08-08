import { SectionShell, SectionHeading } from "./primitives";
import { clientGroups } from "@/content/site";

export function Clients() {
  return (
    <SectionShell id="clientes" className="py-20 sm:py-28 lg:py-36">
      <SectionHeading
        index="04"
        eyebrow="Confiança construída"
        align="between"
        title={
          <>
            Operações exigentes não
            <span className="block text-muted-foreground">compram só uma peça.</span>
          </>
        }
        lead="Elas precisam de acesso coordenado, higiene, continuidade, instalação limpa e escopo explícito. A lista informada pela empresa reúne hospitais, embaixadas, redes, restaurantes e construtoras."
      />

      <ul className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {clientGroups.map((g, i) => (
          <li
            key={g.sector}
            className="reveal specular bg-background p-6 sm:p-8"
            data-reveal
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <h3 className="font-display text-lg font-bold tracking-tight sm:text-xl">{g.sector}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{g.note}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {g.clients.map((c) => (
                <li
                  key={c}
                  className="border border-border px-3 py-2 font-display text-xs font-bold uppercase leading-none tracking-[0.06em] text-foreground/80"
                >
                  {c}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className="label-mono mt-4 normal-case tracking-[0.1em]">
        Clientes informados pela empresa. Marcas citadas pertencem aos respectivos titulares.
      </p>

      <div className="reveal mt-10" data-reveal>
        <a
          href="/clientes/"
          className="label-mono group inline-flex min-h-11 items-center gap-3 text-foreground transition-colors hover:text-signal"
        >
          Ver todos os clientes
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </SectionShell>
  );
}
