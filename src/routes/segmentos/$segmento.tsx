import { createFileRoute, notFound } from "@tanstack/react-router";
import { segmentBySlug } from "@/content/segments";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { DetailSection } from "@/components/site/DetailSection";
import { ListSection } from "@/components/site/ListSection";
import { RelatedSection } from "@/components/site/RelatedSection";
import { CtaSection } from "@/components/site/CtaSection";
import { seo, jsonLd, organizationLd } from "@/lib/seo";

export const Route = createFileRoute("/segmentos/$segmento")({
  loader: ({ params }) => {
    const segment = segmentBySlug.get(params.segmento);
    // Sem isto, slug inventado renderiza página vazia com status 200 — pior
    // que 404 para o crawler.
    if (!segment) throw notFound();
    return { segment };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { segment } = loaderData;
    const base = seo({
      title: segment.title,
      description: segment.meta,
      path: `/segmentos/${segment.slug}`,
    });
    return {
      ...base,
      scripts: [jsonLd([organizationLd])],
    };
  },
  component: SegmentPage,
});

function SegmentPage() {
  const { segment } = Route.useLoaderData();

  return (
    <PageShell accent={segment.accent}>
      <PageHero
        eyebrow={segment.navTitle}
        title={segment.title}
        lead={segment.lead}
        photo={segment.photo}
      />

      <DetailSection
        index="02"
        eyebrow="O que pressiona"
        title="As forças deste contexto."
        lead="São elas que definem material, dimensionamento e frequência de manutenção."
        items={segment.pressures.map((p) => ({ title: p.label, text: p.note }))}
      />

      <ListSection
        index="03"
        eyebrow="Prioridades"
        title="O que costuma vir primeiro."
        lead="Ordem sugerida a partir do que mais afeta a operação — sujeita ao que o levantamento encontrar."
        items={segment.priorities}
        accent={segment.accent}
      />

      <RelatedSection
        slugs={segment.services}
        index="04"
        eyebrow="Serviços aplicáveis"
        title="O que este contexto costuma exigir."
        lead=""
      />

      <CtaSection subject={segment.navTitle} />
    </PageShell>
  );
}
