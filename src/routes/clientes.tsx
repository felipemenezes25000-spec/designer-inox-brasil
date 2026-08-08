import { createFileRoute } from "@tanstack/react-router";
import { clientGroups, clientCount } from "@/content/site";
import { segments } from "@/content/segments";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { CtaSection } from "@/components/site/CtaSection";
import { SectionShell, SectionHeading } from "@/components/site/primitives";
import { accentText } from "@/lib/accent";
import { seo, jsonLd, organizationLd } from "@/lib/seo";

export const Route = createFileRoute("/clientes")({
  head: () => {
    const base = seo({
      title: "Clientes",
      description:
        "Hospitais, embaixadas, redes de varejo, restaurantes, hotelaria e construtoras atendidas pela Designer Inox Brasil.",
      path: "/clientes",
    });
    return { ...base, scripts: [jsonLd([organizationLd])] };
  },
  component: ClientsPage,
});

function ClientsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Clientes"
        title={`${clientCount} clientes listados.`}
        lead={`Hospitais, embaixadas, redes de varejo, restaurantes, hotelaria e construtoras organizados em ${clientGroups.length} grupos de atuação — um recorte por tipo de cliente, diferente dos ${segments.length} segmentos de solução.`}
        photo="real-varejo-expositor"
      />

      <SectionShell className="py-20 sm:py-28">
        <div className="flex flex-col gap-px bg-border">
          {clientGroups.map((group, i) => (
            <div
              key={group.sector}
              className="reveal specular bg-background p-6 sm:p-8 lg:p-10"
              data-reveal
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="min-w-0 max-w-xl">
                  <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                    {group.sector}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.note}</p>
                </div>
                <span className="label-mono shrink-0 text-muted-foreground">
                  {group.clients.length} clientes
                </span>
              </div>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.clients.map((c) => (
                  <li key={c} className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 shrink-0 rounded-full bg-current ${accentText(group.accent)}`}
                    />
                    <span className="min-w-0 text-sm font-medium leading-snug text-foreground/85">
                      {c}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="py-20 sm:py-28">
        <SectionHeading
          index="03"
          eyebrow="Sobre esta lista"
          title="Nomes, não números."
          lead="A relação acima traz organizações atendidas pela Designer Inox Brasil, informadas pela direção da empresa. Não publicamos faturamento, quantidade de obras, prazos médios nem depoimentos que não possam ser verificados — e não exibimos marcas de terceiros como endosso comercial."
          align="between"
        />
      </SectionShell>

      <CtaSection subject="Clientes" />
    </PageShell>
  );
}
