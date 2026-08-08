import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { Manifesto } from "@/components/site/Manifesto";
import { Solutions } from "@/components/site/Solutions";
import { Segments } from "@/components/site/Segments";
import { Clients } from "@/components/site/Clients";
import { Method } from "@/components/site/Method";
import { References } from "@/components/site/References";
import { Faq } from "@/components/site/Faq";
import { FinalCta } from "@/components/site/FinalCta";
import { SiteFooter } from "@/components/site/SiteFooter";
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
  useReveal();

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#conteudo"
        className="btn-base btn-solid sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60]"
      >
        Ir para o conteúdo principal
      </a>
      <SiteNav />
      <main id="conteudo">
        <Hero />
        <Manifesto />
        <Solutions />
        <Segments />
        <Clients />
        <Method />
        <References />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
