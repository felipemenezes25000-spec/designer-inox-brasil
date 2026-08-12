import { whatsapp } from "@/content/site";
import { SectionShell, MagneticLink } from "./primitives";

export function CtaSection({ subject }: { subject: string }) {
  return (
    <SectionShell className="py-20 sm:py-28">
      <div className="reveal" data-reveal>
        <p className="label-mono text-signal">Próximo passo</p>
        <h2 className="display mt-4 text-[clamp(1.75rem,4vw,3.25rem)]">
          Descreva a operação.
          <span className="block text-muted-foreground">Se tiver fotos ou medidas, mande junto.</span>
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          A avaliação inicial organiza o cenário e indica quais informações ainda precisam ser levantadas antes da proposta.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <MagneticLink
            href={whatsapp(`Olá! Meu interesse é: ${subject}. Quero enviar fotos e pedir um orçamento. Minha necessidade é:`)}
            external
            data-conversion="whatsapp_final_cta"
            data-subject={subject}
          >
            Enviar fotos e pedir orçamento
          </MagneticLink>
          <MagneticLink
            href="/orcamento/"
            variant="ghost"
            data-conversion="start_quote_final_cta"
            data-subject={subject}
          >
            Ver como pedir avaliação
          </MagneticLink>
        </div>
      </div>
    </SectionShell>
  );
}
