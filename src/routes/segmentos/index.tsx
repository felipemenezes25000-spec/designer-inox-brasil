import { createFileRoute } from "@tanstack/react-router";
import { segments } from "@/content/segments";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { CardGrid } from "@/components/site/CardGrid";
import { CtaSection } from "@/components/site/CtaSection";
import { seo, jsonLd, organizationLd } from "@/lib/seo";

export const Route = createFileRoute("/segmentos/")({
  head: () => {
    const base = seo({
      title: "Segmentos de atuação",
      description:
        "Restaurantes, hotelaria e alimentação coletiva, produção e varejo de alimentos, saúde e ambientes hospitalares.",
      path: "/segmentos",
    });
    return { ...base, scripts: [jsonLd([organizationLd])] };
  },
  component: SegmentsIndexPage,
});

function SegmentsIndexPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Contextos de operação"
        title={`${segments.length} segmentos. O que muda é tudo que decide o projeto.`}
        lead="Volume, fluxo, calor, higiene, carga e continuidade mudam conforme o contexto de operação. O material é o mesmo — as exigências, não."
      />

      <CardGrid
        index="02"
        eyebrow="Segmentos"
        title="O mesmo aço. Exigências diferentes."
        lead="Volume, fluxo, calor, higiene, carga e continuidade mudam conforme o segmento."
        linkLabel="Ver contexto"
        items={segments.map((s) => ({
          href: `/segmentos/${s.slug}/`,
          title: s.navTitle,
          text: s.short,
        }))}
      />

      <CtaSection subject="Segmentos" />
    </PageShell>
  );
}
