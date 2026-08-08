import { createFileRoute } from "@tanstack/react-router";
import { company, contact, site, whatsapp } from "@/content/site";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Method } from "@/components/site/Method";
import { CtaSection } from "@/components/site/CtaSection";
import { SectionShell, SectionHeading } from "@/components/site/primitives";
import { seo, jsonLd, organizationLd } from "@/lib/seo";

export const Route = createFileRoute("/empresa")({
  head: () => {
    const base = seo({
      title: "Empresa",
      description:
        "A Designer Inox Brasil projeta, fabrica, instala, integra sistemas e mantém estruturas em aço inox para operações profissionais.",
      path: "/empresa",
    });
    return { ...base, scripts: [jsonLd([organizationLd])] };
  },
  component: CompanyPage,
});

// Dados de cadastro. "Nome fantasia" é literal do legado — não há campo
// dedicado em `company` para o nome curto, só a razão social completa.
const IDENTIFICATION: { label: string; value: string; href?: string; external?: boolean }[] = [
  { label: "Responsável", value: company.legalName },
  { label: "Nome fantasia", value: "Designer Inox" },
  { label: "CNPJ", value: company.cnpj },
  { label: "Região", value: company.address },
  { label: "Telefone", value: contact.phone, href: `tel:+${contact.whatsappNumber}` },
  { label: "WhatsApp", value: contact.whatsappDisplay, href: whatsapp(), external: true },
  { label: "E-mail", value: contact.email, href: `mailto:${contact.email}` },
];

function CompanyPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Empresa"
        title="Engenharia aplicada ao aço inox."
        lead={`A Designer Inox Brasil projeta, fabrica, instala, integra sistemas e mantém estruturas e equipamentos em aço inox para operações profissionais em ${site.region}.`}
        photo="real-exaustao-equipe"
      />

      <Method />

      <SectionShell className="py-20 sm:py-28">
        <SectionHeading index="06" eyebrow="Identificação" title="Dados da empresa." align="between" />
        <dl className="mt-14 grid gap-px bg-border sm:grid-cols-2">
          {IDENTIFICATION.map((row) => (
            <div key={row.label} className="min-w-0 bg-background p-6 sm:p-8">
              <dt className="label-mono">{row.label}</dt>
              <dd className="mt-2 min-w-0 break-words font-display text-base font-bold tracking-tight sm:text-lg">
                {row.href ? (
                  <a
                    href={row.href}
                    className="link-underline"
                    {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </SectionShell>

      <CtaSection subject="Empresa" />
    </PageShell>
  );
}
