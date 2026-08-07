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
import { CONTACT, FAQ } from "@/lib/site-data";

const title = "Designer Inox Brasil | Cozinhas industriais e manutenção";
const description =
  "Projeto técnico, fabricação sob medida, instalação, exaustão, refrigeração, aquecimento, automação e manutenção em aço inox. Brasília / DF e entorno.";

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": "#organization",
      name: CONTACT.name,
      legalName: CONTACT.legalName,
      description:
        "Projeto técnico, fabricação, instalação, automação, refrigeração, exaustão e manutenção em aço inox para cozinhas industriais, hospitais e operações profissionais.",
      telephone: CONTACT.phoneRaw,
      email: CONTACT.email,
      sameAs: [CONTACT.instagram],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Brasília",
        addressRegion: "DF",
        addressCountry: "BR",
      },
      areaServed: { "@type": "AdministrativeArea", name: CONTACT.area },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "#faq",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(organizationSchema) },
    ],
  }),
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
