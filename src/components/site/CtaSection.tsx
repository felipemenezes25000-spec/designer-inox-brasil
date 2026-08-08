import { whatsapp } from "@/content/site";
import { SectionShell, MagneticLink } from "./primitives";

export function CtaSection({ subject }: { subject: string }) {
  return (
    <SectionShell className="py-20 sm:py-28">
      <div className="reveal" data-reveal>
        <h2 className="display text-[clamp(1.75rem,4vw,3.25rem)]">
          Descreva a operação.
          <span className="block text-muted-foreground">A avaliação começa por aí.</span>
        </h2>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <MagneticLink
            href={whatsapp(`Olá! Meu interesse é: ${subject}. Minha necessidade é:`)}
            external
          >
            Falar no WhatsApp
          </MagneticLink>
          <MagneticLink href="/orcamento/" variant="ghost">
            Pedir avaliação
          </MagneticLink>
        </div>
      </div>
    </SectionShell>
  );
}
