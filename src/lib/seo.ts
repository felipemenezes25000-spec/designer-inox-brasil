import { site, contact, company } from "@/content/site";

/** Toda URL indexada termina com barra. Canonical tem que bater. */
export function canonical(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const withSlash = clean.endsWith("/") ? clean : `${clean}/`;
  return `${site.origin}${withSlash}`;
}

export function seo({
  title,
  description,
  path,
  image = "/og-default.jpg",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}) {
  const url = canonical(path);
  const fullTitle = path === "/" ? title : `${title} | ${site.name}`;

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: `${site.origin}${image}` },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: site.name },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export const organizationLd = {
  "@type": ["Organization", "LocalBusiness"],
  "@id": `${site.origin}/#organization`,
  name: site.name,
  legalName: company.legalName,
  taxID: company.cnpj,
  description: site.description,
  url: `${site.origin}/`,
  telephone: `+${contact.whatsappNumber}`,
  email: contact.email,
  sameAs: [contact.instagramUrl],
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address,
    addressLocality: site.city,
    addressRegion: site.state,
    addressCountry: "BR",
  },
  areaServed: { "@type": "AdministrativeArea", name: site.region },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "18:00",
  },
};

export function jsonLd(nodes: unknown[]) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }),
  };
}

export function serviceLd(s: { slug: string; title: string; meta: string }) {
  return {
    "@type": "Service",
    "@id": `${canonical(`/${s.slug}`)}#service`,
    name: s.title,
    description: s.meta,
    provider: { "@id": `${site.origin}/#organization` },
    areaServed: { "@type": "AdministrativeArea", name: site.region },
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
