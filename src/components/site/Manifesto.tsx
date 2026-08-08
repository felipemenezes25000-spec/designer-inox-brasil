import { Photo } from "./Photo";
import { SectionShell, SectionHeading, MagneticLink } from "./primitives";
import { whatsapp } from "@/content/site";

const axes = [
  { id: "01 / LER", title: "Espaço e fluxo" },
  { id: "02 / DEFINIR", title: "Materiais e interfaces" },
  { id: "03 / PRODUZIR", title: "Corte, dobra e solda" },
  { id: "04 / ENTREGAR", title: "Instalação e testes" },
];

export function Manifesto() {
  return (
    <SectionShell id="precisao" className="py-20 sm:py-28 lg:py-36">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
        <div className="min-w-0">
          <SectionHeading
            index="01"
            eyebrow="Precisão antes da fabricação"
            title={
              <>
                O inox é o resultado.
                <span className="block text-titanium-fill pb-[0.06em]">A decisão começa antes.</span>
              </>
            }
          />

          <p
            className="reveal mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg"
            data-reveal
            style={{ transitionDelay: "140ms" }}
          >
            Temperatura, umidade, limpeza, carga, circulação e interfaces com outros
            sistemas mudam o projeto. Por isso orçamento sério começa pela operação —
            não por uma lista genérica de equipamentos.
          </p>

          <ol className="mt-14 grid gap-px bg-border sm:grid-cols-2">
            {axes.map((a, i) => (
              <li
                key={a.id}
                className="reveal specular bg-background p-6 transition-colors duration-500 hover:bg-secondary/60 sm:p-8"
                data-reveal
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <p className="label-mono text-signal">{a.id}</p>
                <p className="mt-4 font-display text-xl font-bold tracking-tight sm:text-2xl">
                  {a.title}
                </p>
              </li>
            ))}
          </ol>

          <div className="reveal mt-10" data-reveal>
            <MagneticLink
              href={whatsapp("Olá! Quero entender melhor como funciona o projeto antes do orçamento.")}
              variant="ghost"
              external
            >
              Falar com um especialista
            </MagneticLink>
          </div>
        </div>

        <div className="reveal min-w-0 lg:sticky lg:top-28 lg:self-start" data-reveal>
          <Photo id="welding" className="aspect-4/5 w-full" sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
      </div>
    </SectionShell>
  );
}
