import { createFileRoute } from "@tanstack/react-router";
import { legalNotice } from "@/content/site";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { LegalDoc, type LegalBlock } from "@/components/site/LegalDoc";
import { seo, jsonLd, organizationLd } from "@/lib/seo";

export const Route = createFileRoute("/termos-de-uso")({
  head: () => {
    const base = seo({
      title: "Termos de uso",
      description: "Condições de uso do site da Designer Inox Brasil e natureza informativa do conteúdo publicado.",
      path: "/termos-de-uso",
    });
    return { ...base, scripts: [jsonLd([organizationLd])] };
  },
  component: TermsPage,
});

// Texto copiado na íntegra de termsPage() em src/templates-legacy/pages.mjs.
// Documento jurídico: nenhuma frase é reescrita, resumida ou reordenada.
const BLOCKS: LegalBlock[] = [
  {
    heading: "Finalidade do site",
    paragraphs: [
      "Este site apresenta os serviços da Designer Inox Brasil e serve como canal de contato inicial. O conteúdo tem caráter informativo.",
    ],
  },
  {
    heading: "O conteúdo não é proposta comercial",
    paragraphs: [
      "Descrições de serviço, listas de entregáveis e exemplos de escopo publicados aqui são ilustrativos do tipo de trabalho realizado. Não constituem oferta, orçamento, garantia de disponibilidade nem compromisso de execução. Qualquer contratação depende de proposta específica, elaborada após avaliação, com escopo, prazo e valor descritos.",
    ],
  },
  {
    heading: "Imagens",
    paragraphs: [
      `${legalNotice} Os esquemas técnicos são representações didáticas de princípio de funcionamento e não substituem projeto executivo.`,
    ],
  },
  {
    heading: "Escopo técnico",
    paragraphs: [
      "Viabilidade, dimensionamento e solução final dependem das condições encontradas no local, das informações fornecidas pelo cliente e de levantamento técnico. Informações imprecisas ou incompletas podem alterar escopo, prazo e valor.",
    ],
  },
  {
    heading: "Marcas de terceiros",
    paragraphs: [
      "Nomes de organizações citados na página de clientes identificam operações atendidas e pertencem aos seus respectivos titulares. A menção não implica endosso, patrocínio ou parceria comercial dessas organizações com a Designer Inox Brasil.",
    ],
  },
  {
    heading: "Links externos",
    paragraphs: [
      "O site contém links para WhatsApp e Instagram. Não respondemos pelo conteúdo, pela disponibilidade ou pelas práticas de privacidade de plataformas de terceiros.",
    ],
  },
  {
    heading: "Propriedade intelectual",
    paragraphs: [
      "A marca, os textos e os esquemas técnicos autorais deste site pertencem à Designer Inox Brasil. As fotografias pertencem aos seus autores e são utilizadas sob a licença declarada.",
    ],
  },
  {
    heading: "Alterações",
    paragraphs: [
      "Estes termos podem ser atualizados a qualquer momento. A versão publicada nesta página é a vigente.",
    ],
  },
];

function TermsPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Documento legal" title="Termos de uso" lead="Atualizados em julho de 2026." />
      <LegalDoc blocks={BLOCKS} />
    </PageShell>
  );
}
