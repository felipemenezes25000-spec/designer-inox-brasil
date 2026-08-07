import { SectionShell, SectionHeading } from "./primitives";
import { CLIENTS, CLIENT_CONTEXTS } from "@/lib/site-data";

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

      <div className="reveal mt-14 border-y border-border" data-reveal>
        <ul className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-4">
          {CLIENTS.map((c) => (
            <li
              key={c}
              className="specular flex min-h-[104px] items-center bg-background px-5 py-6 sm:px-8"
            >
              <span className="font-display text-sm font-bold uppercase leading-tight tracking-[0.08em] text-foreground/80 sm:text-base">
                {c}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="label-mono mt-4 normal-case tracking-[0.1em]">
        Clientes informados pela empresa. Marcas citadas pertencem aos respectivos titulares.
      </p>

      <ul className="mt-16 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {CLIENT_CONTEXTS.map((c, i) => (
          <li
            key={c.title}
            className="reveal bg-background p-6 sm:p-8"
            data-reveal
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <h3 className="font-display text-lg font-bold tracking-tight sm:text-xl">{c.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
