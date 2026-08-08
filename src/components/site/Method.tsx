import { Photo } from "./Photo";
import { SectionShell, SectionHeading } from "./primitives";

/**
 * As seis etapas do método de trabalho não têm equivalente em src/content/
 * — não são serviço, segmento nem dado de contato — então o texto, copiado
 * na íntegra da fonte de conteúdo anterior (removida nesta tarefa), mora
 * aqui, único lugar que o usa.
 */
const METHOD = [
  { id: "01", title: "Entender", text: "Operação, espaço e necessidade." },
  { id: "02", title: "Levantar", text: "Medidas, acesso e interferências." },
  { id: "03", title: "Definir", text: "Escopo, material e interfaces." },
  { id: "04", title: "Fabricar", text: "Corte, conformação e acabamento." },
  { id: "05", title: "Instalar", text: "Montagem e integração previstas." },
  { id: "06", title: "Acompanhar", text: "Testes e orientação pós-entrega." },
] as const;

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
        <div className="reveal specular min-h-[320px] bg-background" data-reveal>
          <Photo id="workshop" className="h-full w-full" sizes="(min-width: 1024px) 45vw, 100vw" />
        </div>

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
