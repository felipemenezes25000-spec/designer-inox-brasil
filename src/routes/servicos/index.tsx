import { createFileRoute } from "@tanstack/react-router";
import { categories, services } from "@/content/services";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { CardGrid } from "@/components/site/CardGrid";
import { CtaSection } from "@/components/site/CtaSection";
import { seo, jsonLd, organizationLd } from "@/lib/seo";

export const Route = createFileRoute("/servicos/")({
  head: () => {
    const base = seo({
      title: "Serviços",
      description: `Os ${services.length} serviços da Designer Inox Brasil: cozinhas industriais, equipamentos em inox, corte CNC, exaustão, refrigeração, aquecimento, CO₂, automação e manutenção.`,
      path: "/servicos",
    });
    return { ...base, scripts: [jsonLd([organizationLd])] };
  },
  component: ServicesIndexPage,
});

function ServicesIndexPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Todos os serviços"
        title={`${services.length} serviços. Um só interlocutor.`}
        lead="Projeto, fabricação, sistemas térmicos, elétrica, exaustão e manutenção. Quando o mesmo fornecedor responde por estrutura e sistema, some a discussão sobre de quem é a responsabilidade da interface."
        photo="real-copa-bancada"
      />

      {categories.map((cat, i) => (
        <CardGrid
          key={cat.id}
          index={String(i + 2).padStart(2, "0")}
          eyebrow={`Frente ${String(i + 1).padStart(2, "0")}`}
          title={cat.label}
          lead={cat.note}
          linkLabel="Ver serviço"
          items={services
            .filter((s) => s.category === cat.id)
            .map((s) => ({ href: `/${s.slug}/`, title: s.navTitle, text: s.short }))}
        />
      ))}

      <CtaSection subject="Serviços" />
    </PageShell>
  );
}
