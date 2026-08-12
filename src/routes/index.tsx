import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Hero } from "@/components/site/Hero";
import { Manifesto } from "@/components/site/Manifesto";
import { Solutions } from "@/components/site/Solutions";
import { Segments } from "@/components/site/Segments";
import { Clients } from "@/components/site/Clients";
import { Method } from "@/components/site/Method";
import { References } from "@/components/site/References";
import { Faq } from "@/components/site/Faq";
import { FinalCta } from "@/components/site/FinalCta";
import { homeFaq } from "@/content/site";
import { seo, jsonLd, organizationLd, faqLd } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => {
    const base = seo({
      title: "Designer Inox Brasil | Cozinhas industriais e manutenção",
      description:
        "Projeto técnico, fabricação sob medida, instalação, exaustão, refrigeração, aquecimento, automação e manutenção em aço inox. Brasília / DF e entorno.",
      path: "/",
    });
    return { ...base, scripts: [jsonLd([organizationLd, faqLd(homeFaq)])] };
  },
  component: Index,
});

function Index() {
  return (
    <PageShell>
      <Hero />
      <Manifesto />
      <Solutions />
      <Segments />
      <Clients />
      <Method />
      <References />
      <Faq />
      <FinalCta />
    </PageShell>
  );
}
