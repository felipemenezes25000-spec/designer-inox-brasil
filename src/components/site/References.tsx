import { Photo } from "./Photo";
import { SectionShell, SectionHeading } from "./primitives";
import { serviceBySlug } from "@/content/services";

/**
 * Cada referência aponta para o serviço real dono da foto (via slug
 * explícito, não busca automática em `gallery` — várias fotos aparecem em
 * mais de um serviço, então a busca seria ambígua). Título e legenda vêm de
 * services.ts, não são reescritos aqui.
 */
const refs = [
  { label: "Ref. 02", photoId: "real-coifa-operacao", serviceSlug: "coifas-ventilacao-e-exaustao" },
  { label: "Ref. 03", photoId: "real-saponificacao", serviceSlug: "saponificacao-em-exaustao" },
  { label: "Ref. 04", photoId: "real-hospital-cme", serviceSlug: "equipamentos-hospitalares" },
] as const;

export function References() {
  return (
    <SectionShell id="referencias" className="py-20 sm:py-28 lg:py-36">
      <SectionHeading
        index="06"
        eyebrow="Referências visuais"
        align="between"
        title={
          <>
            Ambientes profissionais
            <span className="block text-muted-foreground">pedem soluções diferentes.</span>
          </>
        }
        lead="Cozinha, fabricação e produção mudam carga, higiene, acabamento, ventilação e integração entre sistemas."
      />

      <ul className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {refs.map((r, i) => {
          const service = serviceBySlug.get(r.serviceSlug);
          return (
            <li
              key={r.photoId}
              className="reveal group min-w-0 bg-background"
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <figure className="min-w-0">
                <div className="specular relative">
                  <Photo
                    id={r.photoId}
                    className="aspect-4/5 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <span className="label-mono absolute left-4 top-4 border border-border bg-background/60 px-3 py-2 backdrop-blur-md">
                    {r.label}
                  </span>
                </div>
                <figcaption className="p-6">
                  <h3 className="font-display text-lg font-bold tracking-tight sm:text-xl">
                    {service?.navTitle ?? r.serviceSlug}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{service?.short ?? ""}</p>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
