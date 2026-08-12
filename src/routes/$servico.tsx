import { createFileRoute, notFound } from "@tanstack/react-router";
import { serviceBySlug } from "@/content/services";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { HeroLeadActions } from "@/components/site/HeroLeadActions";
import { LeadBand } from "@/components/site/LeadBand";
import { ListSection } from "@/components/site/ListSection";
import { DetailSection } from "@/components/site/DetailSection";
import { FaqSection } from "@/components/site/FaqSection";
import { RelatedSection } from "@/components/site/RelatedSection";
import { CtaSection } from "@/components/site/CtaSection";
import { GallerySection } from "@/components/site/GallerySection";
import { seo, jsonLd, organizationLd, serviceLd, faqLd } from "@/lib/seo";

export const Route = createFileRoute("/$servico")({
  loader: ({ params }) => {
    const service = serviceBySlug.get(params.servico);
    // Sem isto, slug inventado renderiza página vazia com status 200 — pior
    // que 404 para o crawler.
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { service } = loaderData;
    const base = seo({
      title: service.seoTitle ?? service.title,
      description: service.meta,
      path: `/${service.slug}`,
    });
    return {
      ...base,
      scripts: [
        jsonLd([
          organizationLd,
          serviceLd(service),
          ...(service.faq.length ? [faqLd(service.faq)] : []),
        ]),
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { service } = Route.useLoaderData();

  return (
    <PageShell accent={service.accent}>
      <PageHero
        eyebrow={service.navTitle}
        title={service.title}
        lead={service.lead}
        photo={service.photo}
        illustration={service.illustration}
      >
        <HeroLeadActions subject={service.navTitle} />
      </PageHero>

      {service.specialties && (
        <DetailSection
          index="02"
          eyebrow="O que fabricamos e mantemos"
          title="Especialidades deste serviço."
          lead="Equipamentos que fabricamos sob medida ou mantemos com assistência técnica especializada."
          items={service.specialties.map((s) => ({ title: s.name, text: s.desc }))}
        />
      )}

      <ListSection
        index="03"
        eyebrow="Quando faz sentido"
        title="Situações que orientam a avaliação."
        lead="O escopo final depende das condições reais, das informações disponíveis e dos itens aprovados na proposta."
        items={service.when}
        accent={service.accent}
      />

      <ListSection
        index="04"
        eyebrow="Entregáveis possíveis"
        title="O que pode entrar no escopo."
        lead="Nada é presumido. Cada item precisa estar descrito e aprovado antes da fabricação ou da intervenção."
        items={service.deliverables}
        accent={service.accent}
      />

      <LeadBand subject={service.navTitle} />

      <ListSection
        index="05"
        eyebrow="Pontos de decisão"
        title="O que muda o projeto."
        lead="Condições que precisam ser entendidas para evitar improviso, retrabalho e incompatibilidades."
        items={service.decisions}
        accent={service.accent}
      />

      {service.hub && (
        <RelatedSection
          slugs={service.hub}
          index="06"
          eyebrow="Sistemas que integramos"
          title="Cada sistema tem sua própria página."
          lead="A integração é o ponto de encontro. O detalhe de cada disciplina está aqui."
        />
      )}

      <GallerySection ids={service.gallery} index="07" />
      <FaqSection items={service.faq} index="08" />
      <RelatedSection slugs={service.related} index="09" />
      <CtaSection subject={service.navTitle} />
    </PageShell>
  );
}
