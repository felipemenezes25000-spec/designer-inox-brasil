import { CONTACT, NAV_LINKS, whatsappLink } from "@/lib/site-data";

const services = [
  "Cozinhas industriais",
  "Equipamentos sob medida",
  "Coifas e exaustão",
  "Refrigeração",
  "Aquecimento",
  "Automação elétrica",
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border">
      <div aria-hidden="true" className="grid-etch pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-14 2xl:px-20">
        <div className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] lg:gap-16 lg:py-24">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-3">
              <span aria-hidden="true" className="relative grid h-9 w-9 shrink-0 place-items-center border border-border">
                <span className="block h-3.5 w-px bg-mineral" />
                <span className="absolute block h-px w-3.5 bg-mineral" />
              </span>
              <span className="min-w-0 font-display text-base font-bold uppercase tracking-[0.16em]">
                Designer Inox Brasil
              </span>
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Projeto técnico, fabricação, instalação, sistemas e manutenção em aço inox,
              coordenados conforme a necessidade real do espaço e do uso.
            </p>

            <ul className="mt-8 flex flex-col gap-3 text-sm">
              <li>
                <a href={`tel:${CONTACT.phoneRaw}`} className="link-underline font-display text-lg font-bold tracking-tight">
                  {CONTACT.phoneLabel}
                </a>
              </li>
              <li className="min-w-0 break-words">
                <a href={`mailto:${CONTACT.email}`} className="link-underline text-muted-foreground">
                  {CONTACT.email}
                </a>
              </li>
              <li className="label-mono normal-case tracking-[0.1em]">{CONTACT.hours}</li>
              <li className="label-mono normal-case tracking-[0.1em]">{CONTACT.area}</li>
            </ul>
          </div>

          <nav aria-label="Serviços" className="min-w-0">
            <h2 className="label-mono">Serviços</h2>
            <ul className="mt-6 flex flex-col gap-px bg-border/70">
              {services.map((s) => (
                <li key={s} className="bg-background py-2.5">
                  <a href="#solucoes" className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Navegação do rodapé" className="min-w-0">
            <h2 className="label-mono">Navegação</h2>
            <ul className="mt-6 flex flex-col gap-px bg-border/70">
              {NAV_LINKS.map((l) => (
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
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-ghost min-h-11 px-5"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink("Olá! Gostaria de pedir um orçamento.")}
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

        <p className="max-w-4xl border-t border-border py-8 text-xs leading-relaxed text-muted-foreground">
          As imagens deste site são ilustrativas e servem apenas de contexto: não
          representam obras, equipe ou clientes da Designer Inox Brasil.
        </p>

        <div className="grid gap-4 border-t border-border py-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <p className="label-mono min-w-0 normal-case tracking-[0.1em]">
            © {new Date().getFullYear()} Designer Inox Brasil · {CONTACT.legalName} · CNPJ{" "}
            {CONTACT.cnpj}
          </p>
          <p className="label-mono md:text-right">Brasília / DF · Brasil</p>
        </div>
      </div>
    </footer>
  );
}
