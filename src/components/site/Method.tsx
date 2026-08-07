import atelier from "@/assets/atelier.jpg";
import { SectionShell, SectionHeading } from "./primitives";
import { METHOD } from "@/lib/site-data";

export function Method() {
  return (
    <SectionShell id="metodo" className="py-20 sm:py-28 lg:py-36">
      <SectionHeading
        index="05"
        eyebrow="Método"
        align="between"
        title={
          <>
            Seis movimentos.
            <span className="block text-titanium-fill pb-[0.06em]">Um escopo claro.</span>
          </>
        }
        lead="Cada etapa reduz incerteza e deixa explícito o que entra, o que depende de terceiros e o que precisa ser levantado."
      />

      <div className="mt-14 grid gap-px bg-border lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <figure className="reveal specular relative min-h-[320px] bg-background" data-reveal>
          <img
            src={atelier}
            alt="Fabricação de peça em chapa de aço inox na oficina"
            loading="lazy"
            decoding="async"
            width={1600}
            height={1008}
            className="h-full w-full object-cover"
          />
          <figcaption className="label-mono absolute bottom-4 left-4 right-4 bg-background/70 px-3 py-2 normal-case tracking-[0.12em] backdrop-blur-md">
            Imagem ilustrativa · etapa de fabricação
          </figcaption>
        </figure>

        <ol className="grid gap-px bg-border sm:grid-cols-2">
          {METHOD.map((m, i) => (
            <li
              key={m.id}
              className="reveal specular group flex min-h-[168px] flex-col justify-between bg-background p-6 transition-colors duration-500 hover:bg-secondary/50 sm:p-8"
              data-reveal
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="label-mono text-signal">{m.id}</span>
              <div className="mt-8">
                <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}
