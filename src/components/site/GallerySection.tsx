import { photos } from "@/content/site";
import { Photo } from "./Photo";
import { SectionShell, SectionHeading } from "./primitives";

/**
 * O título da seção também é uma afirmação.
 *
 * "Trabalhos executados" só é verdade se toda foto da galeria for obra da
 * empresa. Em 10 dos 13 serviços a galeria mistura foto de banco licenciado —
 * a legenda de cada foto continua correta, mas o título faria uma alegação
 * ampla que não se sustenta. Quando há mistura, o título recua para uma
 * afirmação que é verdadeira: são referências do tipo de operação.
 *
 * Isto fica no código pelo mesmo motivo que a legenda de `Photo`: alguém vai
 * acrescentar uma foto a uma galeria daqui a um ano sem lembrar da regra.
 */
export function GallerySection({ ids, index = "06" }: { ids: string[]; index?: string }) {
  if (!ids.length) return null;

  const allOwn = ids.every((id) => photos[id]?.own === true);

  return (
    <SectionShell className="py-20 sm:py-28">
      <SectionHeading
        index={index}
        eyebrow={allOwn ? "Execução" : "Referências"}
        title={allOwn ? "Trabalhos executados." : "Como esse trabalho aparece."}
        lead={
          allOwn
            ? "Registro de obras entregues pela equipe."
            : "Obras da Designer Inox e imagens de contexto, identificadas uma a uma."
        }
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
