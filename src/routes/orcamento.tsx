import { createFileRoute } from "@tanstack/react-router";
import { contact, contactScenarios, site, whatsapp } from "@/content/site";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { ListSection } from "@/components/site/ListSection";
import { SectionShell, SectionHeading, MagneticLink } from "@/components/site/primitives";
import { seo, jsonLd, organizationLd } from "@/lib/seo";

export const Route = createFileRoute("/orcamento")({
  head: () => {
    const base = seo({
      title: "Pedir orçamento",
      description:
        "Monte uma mensagem organizada com cidade, tipo de operação e necessidade, e abra o WhatsApp com o texto pronto.",
      path: "/orcamento",
    });
    return { ...base, scripts: [jsonLd([organizationLd])] };
  },
  component: QuotePage,
});

function QuotePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Orçamento pelo WhatsApp"
        title="Conte o que precisa ser resolvido."
        lead="Envie cidade, tipo de operação, fotos, medidas ou plantas. A avaliação inicial serve para entender o escopo e os levantamentos necessários."
      />

      <SectionShell className="py-20 sm:py-28">
        <SectionHeading
          index="02"
          eyebrow="Comece pela sua necessidade"
          title="O que precisa ser resolvido agora?"
          lead="Escolha o cenário mais próximo. O WhatsApp já abre com a pergunta certa e você revisa a mensagem antes de enviar."
          align="between"
        />

        <ul className="mt-14 grid gap-px bg-border sm:grid-cols-2">
          {contactScenarios.map((s, i) => (
            <li
              key={s.id}
              className="reveal specular bg-background"
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <a
                href={whatsapp(`Olá! Meu cenário: ${s.label}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[96px] items-center gap-4 p-6 sm:p-8"
              >
                <span className="label-mono shrink-0 text-signal">{s.id}</span>
                <span className="min-w-0 flex-1 text-sm font-medium sm:text-base">{s.label}</span>
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
      </SectionShell>

      <ListSection
        index="03"
        eyebrow="Antes de enviar"
        title="O que enviar."
        lead="Projetos complexos podem exigir levantamento técnico no local."
        items={[
          "cidade",
          "tipo de operação",
          "fotos gerais e dos pontos críticos",
          "medidas disponíveis",
          "descrição do que precisa mudar",
        ]}
      />

      <SectionShell className="py-20 sm:py-28">
        <SectionHeading index="04" eyebrow="Outro caminho" title="Prefere falar direto?" align="between" />

        <div className="reveal mt-10" data-reveal>
          <MagneticLink href={whatsapp()} variant="ghost" external>
            Abrir WhatsApp direto
          </MagneticLink>
        </div>

        <dl className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            { l: "Atendimento", v: site.region },
            { l: "Horário", v: contact.hours },
            { l: "Telefone", v: contact.whatsappDisplay, href: `tel:+${contact.whatsappNumber}` },
            { l: "E-mail", v: contact.email, href: `mailto:${contact.email}` },
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
      </SectionShell>
    </PageShell>
  );
}
