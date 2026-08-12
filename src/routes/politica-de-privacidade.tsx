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
      description: "Como a Designer Inox Brasil trata dados e parâmetros de campanha neste site.",
      path: "/politica-de-privacidade",
    });
    return { ...base, scripts: [jsonLd([organizationLd])] };
  },
  component: PrivacyPage,
});

const BLOCKS: LegalBlock[] = [
  {
    heading: "Que dados este site trata",
    paragraphs: [
      "Este site é estático e não possui cadastro, login, banco de dados próprio nem formulário que envie informações para um servidor da Designer Inox Brasil. Quando o acesso vem de uma campanha, parâmetros presentes no endereço — como UTM, gclid ou fbclid — podem ser preservados temporariamente no armazenamento de sessão do navegador para manter a origem do acesso durante a navegação.",
    ],
  },
  {
    heading: "Como usamos a origem da campanha",
    paragraphs: [
      "Os parâmetros de campanha não são enviados automaticamente para a Designer Inox Brasil. Se você decidir abrir o WhatsApp pelo site, uma indicação legível de origem, campanha ou termo pode ser acrescentada à mensagem pronta para ajudar a identificar de qual anúncio veio o contato. Você pode editar ou apagar esse texto antes de enviar a mensagem.",
      "O site também prepara eventos de clique em uma camada técnica local para futura integração com ferramentas de mensuração. Enquanto nenhuma ferramenta externa de analytics ou publicidade estiver configurada, esses eventos não são enviados a Google, Meta ou outra plataforma por esse mecanismo.",
    ],
  },
  {
    heading: "Como funciona o pedido de avaliação",
    paragraphs: [
      "Os atalhos de orçamento executam no seu navegador e abrem o WhatsApp com uma mensagem pré-preenchida. Nada do conteúdo dessa mensagem é transmitido para a Designer Inox Brasil até que você mesmo escolha enviá-la no aplicativo.",
    ],
  },
  {
    heading: "Dados enviados por WhatsApp",
    paragraphs: [
      "Ao iniciar uma conversa, as informações que você enviar passam a ser tratadas pela Designer Inox Brasil para responder à sua solicitação, elaborar proposta e executar o serviço contratado. O tratamento da mensagem dentro do aplicativo segue a política do próprio WhatsApp, que é um serviço de terceiro.",
    ],
  },
  {
    heading: "Cookies e armazenamento local",
    paragraphs: [
      "O site não grava cookies próprios para publicidade ou medição de audiência. A origem de campanha pode ser mantida apenas no armazenamento de sessão do navegador e é descartada quando essa sessão termina, salvo comportamento específico do navegador.",
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
      "Nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode solicitar confirmação de tratamento, acesso, correção ou eliminação dos dados que tenha nos enviado diretamente. O pedido pode ser feito pelos canais de contato abaixo.",
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
      <PageHero eyebrow="Documento legal" title="Política de privacidade" lead="Atualizada em agosto de 2026." />
      <LegalDoc blocks={BLOCKS} />
    </PageShell>
  );
}
