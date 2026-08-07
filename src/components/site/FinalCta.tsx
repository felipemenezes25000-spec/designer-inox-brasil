import { SectionShell, MagneticLink } from "./primitives";
import { CONTACT, SCENARIOS, whatsappLink } from "@/lib/site-data";

export function FinalCta() {
  return (
    <SectionShell id="contato" className="overflow-hidden py-20 sm:py-28 lg:py-36">
      <div aria-hidden="true" className="grid-etch pointer-events-none absolute inset-0" />

      <div className="relative grid gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
        <div className="min-w-0">
          <p className="reveal label-mono flex items-center gap-3" data-reveal>
            <span className="text-mineral">08</span>
            <span aria-hidden="true" className="h-px w-8 bg-border" />
            <span>Próximo passo</span>
          </p>
          <h2
            className="reveal display mt-6 text-[clamp(2.2rem,6.4vw,6rem)]"
            data-reveal
            style={{ transitionDelay: "70ms" }}
          >
            <span className="block text-titanium-fill pb-[0.06em]">Mostre a operação.</span>
            <span className="block text-foreground/85">A gente organiza o caminho.</span>
          </h2>

          <p
            className="reveal mt-8 max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg"
            data-reveal
            style={{ transitionDelay: "120ms" }}
          >
            Envie cidade, tipo de operação, fotos, medidas ou plantas. A avaliação inicial
            serve para entender o escopo e os levantamentos necessários.
          </p>

          <div className="reveal mt-10 flex flex-col gap-3 sm:flex-row" data-reveal>
            <MagneticLink href={whatsappLink("Olá! Gostaria de pedir um orçamento.")} external>
              Pedir orçamento no WhatsApp
            </MagneticLink>
            <MagneticLink href={`mailto:${CONTACT.email}`} variant="ghost">
              Enviar por e-mail
            </MagneticLink>
          </div>

          <dl className="mt-12 grid gap-px bg-border sm:grid-cols-2">
            {[
              { l: "Atendimento", v: CONTACT.area },
              { l: "Horário", v: CONTACT.hours },
              { l: "Telefone", v: CONTACT.phoneLabel, href: `tel:${CONTACT.phoneRaw}` },
              { l: "E-mail", v: CONTACT.email, href: `mailto:${CONTACT.email}` },
            ].map((c) => (
              <div key={c.l} className="min-w-0 bg-background p-6">
                <dt className="label-mono">{c.l}</dt>
                <dd className="mt-2 min-w-0 break-words font-display text-base font-bold tracking-tight sm:text-lg">
                  {c.href ? (
                    <a href={c.href} className="link-underline">
                      {c.v}
                    </a>
                  ) : (
                    c.v
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="reveal plate min-w-0 self-start p-6 sm:p-10" data-reveal style={{ transitionDelay: "140ms" }}>
          <p className="label-mono">Comece pela sua necessidade</p>
          <h3 className="mt-6 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            O que precisa ser resolvido agora?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Escolha o cenário mais próximo. O WhatsApp já abre com a pergunta certa e você
            revisa a mensagem antes de enviar.
          </p>

          <ul className="mt-8 flex flex-col gap-px bg-border">
            {SCENARIOS.map((s) => (
              <li key={s.id}>
                <a
                  href={whatsappLink(`Olá! Meu cenário: ${s.label}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="specular group grid min-h-[68px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 bg-card px-5 py-4 transition-colors duration-500 hover:bg-secondary"
                >
                  <span className="label-mono text-signal">{s.id}</span>
                  <span className="min-w-0 text-sm font-medium sm:text-base">{s.label}</span>
                  <span
                    aria-hidden="true"
                    className="text-muted-foreground transition-transform duration-500 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="label-mono mt-6 normal-case tracking-[0.1em]">
            Atendimento {CONTACT.hours.toLowerCase()}.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
