import { whatsapp } from "@/content/site";
import { MagneticLink, SectionShell } from "./primitives";

export function LeadBand({ subject }: { subject: string }) {
  return (
    <SectionShell className="bg-secondary/35 py-12 sm:py-16">
      <div
        className="reveal grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-14"
        data-reveal
      >
        <div className="min-w-0">
          <p className="label-mono text-signal">Orçamento mais rápido</p>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Já tem fotos, medidas ou planta?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Envie o material pelo WhatsApp. Isso ajuda a entender o cenário antes de definir os próximos levantamentos.
          </p>
        </div>
        <MagneticLink
          href={whatsapp(`Olá! Meu interesse é: ${subject}. Já tenho fotos, medidas ou planta e quero pedir uma avaliação.`)}
          external
          data-conversion="whatsapp_mid_page"
          data-subject={subject}
          className="w-full sm:w-auto"
        >
          Enviar material no WhatsApp
        </MagneticLink>
      </div>
    </SectionShell>
  );
}
