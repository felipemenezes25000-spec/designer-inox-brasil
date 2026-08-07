import exaustao from "@/assets/sistema-exaustao.jpg";
import cnc from "@/assets/fabricacao-cnc.jpg";
import automacao from "@/assets/sistemas-automacao.jpg";
import { SectionShell, SectionHeading } from "./primitives";

const refs = [
  {
    img: cnc,
    ratio: "aspect-4/5",
    label: "Ref. 02",
    title: "Corte e conformação",
    caption: "Chapa, corte CNC e preparação de peças.",
  },
  {
    img: exaustao,
    ratio: "aspect-4/5",
    label: "Ref. 03",
    title: "Ar e exaustão",
    caption: "Coifas, dutos, filtragem e condução.",
  },
  {
    img: automacao,
    ratio: "aspect-4/5",
    label: "Ref. 04",
    title: "Frio, calor e comando",
    caption: "Refrigeração, quadros e automação elétrica.",
  },
];

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
        {refs.map((r, i) => (
          <li
            key={r.label}
            className="reveal group min-w-0 bg-background"
            data-reveal
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <figure className="min-w-0">
              <div className="specular relative overflow-hidden">
                <img
                  src={r.img}
                  alt={r.title}
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={1408}
                  className={`w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] ${r.ratio}`}
                />
                <span className="label-mono absolute left-4 top-4 border border-border bg-background/60 px-3 py-2 backdrop-blur-md">
                  {r.label}
                </span>
              </div>
              <figcaption className="p-6">
                <h3 className="font-display text-lg font-bold tracking-tight sm:text-xl">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.caption}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <p className="reveal label-mono mt-6 max-w-3xl normal-case leading-relaxed tracking-[0.1em]" data-reveal>
        Imagens ilustrativas de contexto. Não representam obras, equipe ou clientes da
        Designer Inox Brasil.
      </p>
    </SectionShell>
  );
}
