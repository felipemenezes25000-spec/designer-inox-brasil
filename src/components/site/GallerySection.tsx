import { Photo } from "./Photo";
import { SectionShell, SectionHeading } from "./primitives";

export function GallerySection({ ids, index = "06" }: { ids: string[]; index?: string }) {
  if (!ids.length) return null;

  return (
    <SectionShell className="py-20 sm:py-28">
      <SectionHeading
        index={index}
        eyebrow="Execução"
        title="Trabalhos executados."
        lead="Registro de obras entregues pela equipe."
        align="between"
      />
      <div className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {ids.map((id, i) => (
          <div
            key={id}
            className="reveal bg-background"
            data-reveal
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <Photo
              id={id}
              className="aspect-[4/3] w-full"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
