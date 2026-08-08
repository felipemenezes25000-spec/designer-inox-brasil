import { createFileRoute } from "@tanstack/react-router";
import { company, contact } from "@/content/site";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { LegalDoc, type LegalBlock } from "@/components/site/LegalDoc";
import { seo, jsonLd, organizationLd } from "@/lib/seo";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => {
    const base = seo({
      title: "Política de privacidade",
      description: "Como a Designer Inox Brasil trata dados neste site. O site é estático e não coleta dados.",
      path: "/politica-de-privacidade",
    });
    return { ...base, scripts: [jsonLd([organizationLd])] };
  },
  component: PrivacyPage,
});

// Texto copiado na íntegra de privacyPage() em src/templates-legacy/pages.mjs.
// Documento jurídico: nenhuma frase é reescrita, resumida ou reordenada.
const BLOCKS: LegalBlock[] = [
  {
    heading: "Que dados este site coleta",
    paragraphs: [
      "Este site não coleta dados pessoais diretamente. Ele é estático e não possui banco de dados, cadastro, login, formulário que envie informações para um servidor nosso, nem ferramenta de analytics ou rastreamento publicitário.",
    ],
  },
  {
    heading: "Como funciona o formulário de avaliação",
    paragraphs: [
      "O formulário da página de orçamento executa inteiramente no seu navegador. Ele apenas organiza o que você digitou em um texto e abre o WhatsApp com essa mensagem pronta. Nada é transmitido para a Designer Inox Brasil até que você mesmo envie a mensagem. Os dados digitados não são gravados nem enviados a terceiros por este site.",
    ],
  },
  {
    heading: "Dados enviados por WhatsApp",
    paragraphs: [
      "Ao iniciar uma conversa, as informações que você enviar passam a ser tratadas pela Designer Inox Brasil para responder à sua solicitação, elaborar proposta e executar o serviço contratado. O tratamento da mensagem dentro do aplicativo segue a política do próprio WhatsApp, que é um serviço de terceiro.",
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "Este site não grava cookies próprios nem utiliza cookies de terceiros para publicidade ou medição de audiência.",
    ],
  },
  {
    heading: "Serviços de terceiros",
    paragraphs: [
      "Links para WhatsApp e Instagram levam a plataformas externas, com políticas de privacidade próprias. A hospedagem do site pode registrar dados técnicos de acesso, como endereço IP e tipo de navegador, para operação e segurança da infraestrutura.",
    ],
  },
  {
    heading: "Seus direitos",
    paragraphs: [
      "Nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode solicitar confirmação de tratamento, acesso, correção ou eliminação dos dados que tenha nos enviado por WhatsApp. O pedido pode ser feito pelo mesmo canal de contato.",
    ],
  },
  {
    heading: "Controlador",
    paragraphs: [`${company.legalName}, CNPJ ${company.cnpj}.`],
  },
  {
    heading: "Contato",
    paragraphs: [
      `Para qualquer questão sobre privacidade ou exercício de direitos previstos na LGPD, entre em contato pelo e-mail ${contact.email} ou pelo WhatsApp ${contact.whatsappDisplay}.`,
    ],
  },
];

function PrivacyPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Documento legal" title="Política de privacidade" lead="Atualizada em julho de 2026." />
      <LegalDoc blocks={BLOCKS} />
    </PageShell>
  );
}
