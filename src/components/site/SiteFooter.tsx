import { services } from "@/content/services";
import { company, contact, legalNotice, nav, site, whatsapp } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border">
      <div aria-hidden="true" className="grid-etch pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-14 2xl:px-20">
        <div className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] lg:gap-16 lg:py-24">
          <div className="min-w-0">
            <a href="/" className="flex items-center" aria-label={`${site.name} — página inicial`}>
              <picture>
                <source type="image/avif" srcSet="/brand/lockup-negative.avif" />
                <source type="image/webp" srcSet="/brand/lockup-negative.webp" />
                <img src="/brand/lockup-negative.png" alt={site.name} className="h-9 w-auto sm:h-10" />
              </picture>
            </a>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Projeto técnico, fabricação, instalação, sistemas e manutenção em aço inox,
              coordenados conforme a necessidade real do espaço e do uso.
            </p>

            <ul className="mt-8 flex flex-col gap-3 text-sm">
              <li>
                <a href={`tel:+${contact.whatsappNumber}`} className="link-underline font-display text-lg font-bold tracking-tight">
                  {contact.whatsappDisplay}
                </a>
              </li>
              <li className="min-w-0 break-words">
                <a href={`mailto:${contact.email}`} className="link-underline text-muted-foreground">
                  {contact.email}
                </a>
              </li>
              <li className="label-mono normal-case tracking-[0.1em]">{contact.hours}</li>
              <li className="label-mono normal-case tracking-[0.1em]">{site.region}</li>
            </ul>
          </div>

          <nav aria-label="Serviços" className="min-w-0">
            <h2 className="label-mono">Serviços</h2>
            <ul className="mt-6 flex flex-col gap-px bg-border/70">
              {services.map((s) => (
                <li key={s.slug} className="bg-background py-2.5">
                  <a href={`/${s.slug}/`} className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {s.navTitle}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Navegação do rodapé" className="min-w-0">
            <h2 className="label-mono">Navegação</h2>
            <ul className="mt-6 flex flex-col gap-px bg-border/70">
              {nav.map((l) => (
                <li key={l.href} className="bg-background py-2.5">
                  <a href={l.href} className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <ul className="mt-8 flex flex-wrap gap-3">
              <li>
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-ghost min-h-11 px-5"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={whatsapp("Olá! Gostaria de pedir um orçamento.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-ghost min-h-11 px-5"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <p className="max-w-3xl border-t border-border py-8 text-xs leading-relaxed text-muted-foreground">
          {legalNotice}
        </p>

        <div className="grid gap-4 border-t border-border py-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <p className="label-mono min-w-0 normal-case tracking-[0.1em]">
            © {new Date().getFullYear()} {site.name} · {company.legalName} · CNPJ{" "}
            {company.cnpj}
          </p>
          <p className="label-mono md:text-right">
            {site.city} / {site.state} · Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}
