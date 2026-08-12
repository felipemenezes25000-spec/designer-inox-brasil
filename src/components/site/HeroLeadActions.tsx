import { clientCount, contact, site, whatsapp } from "@/content/site";
import { MagneticLink } from "./primitives";

export function HeroLeadActions({ subject }: { subject: string }) {
  const facts = [
    `${clientCount} organizações na lista de clientes`,
    "Fotos de obras executadas",
    site.region,
  ];

  return (
    <div className="reveal mt-8" data-reveal style={{ transitionDelay: "170ms" }}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <MagneticLink
          href={whatsapp(`Olá! Meu interesse é: ${subject}. Quero enviar fotos e pedir um orçamento.`)}
          external
          data-conversion="whatsapp_service_hero"
          data-subject={subject}
        >
          Enviar fotos e pedir orçamento
        </MagneticLink>
        <MagneticLink
          href={`tel:+${contact.whatsappNumber}`}
          variant="ghost"
          data-conversion="phone_service_hero"
          data-subject={subject}
        >
          Ligar agora
        </MagneticLink>
      </div>

      <ul className="mt-8 grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
        {facts.map((fact) => (
          <li key={fact} className="label-mono flex items-start gap-2 normal-case tracking-[0.09em]">
            <span aria-hidden="true" className="mt-2 block h-px w-3 shrink-0 bg-signal" />
            <span>{fact}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
