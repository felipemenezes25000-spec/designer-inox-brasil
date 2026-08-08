import { useEffect, useState } from "react";
import { contact, nav, site, whatsapp } from "@/content/site";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open
          ? "border-b border-border bg-background/85 backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Principal" className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-14 2xl:px-20">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <a href="/" className="flex min-w-0 items-center" aria-label={`${site.name} — página inicial`}>
            <picture>
              <source type="image/avif" srcSet="/brand/lockup-negative.avif" />
              <source type="image/webp" srcSet="/brand/lockup-negative.webp" />
              <img src="/brand/lockup-negative.png" alt={site.name} className="h-8 w-auto sm:h-9" />
            </picture>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {nav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="label-mono link-underline text-foreground/75 transition-colors hover:text-foreground">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-end gap-3">
            <a
              href={whatsapp("Olá! Gostaria de pedir um orçamento.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base btn-solid hidden min-h-11 px-6 sm:inline-flex"
            >
              Pedir orçamento
            </a>
            <button
              type="button"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((v) => !v)}
              className="grid h-12 w-12 shrink-0 place-items-center border border-border transition-colors hover:border-foreground/40 lg:hidden"
            >
              <span aria-hidden="true" className="flex flex-col items-end gap-[5px]">
                <span
                  className={`block h-px w-5 bg-foreground transition-transform duration-400 ${open ? "translate-y-[3px] rotate-45" : ""}`}
                />
                <span
                  className={`block h-px bg-foreground transition-all duration-400 ${open ? "w-5 -translate-y-[3px] -rotate-45" : "w-3.5"}`}
                />
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t border-border bg-background/95 backdrop-blur-2xl lg:hidden"
      >
        <div className="mx-auto w-full max-w-[1680px] px-5 pb-8 pt-2 sm:px-8">
          <ul>
            {nav.map((l) => (
              <li key={l.href} className="border-b border-border/70">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center justify-between py-4 font-display text-2xl font-bold uppercase tracking-tight"
                >
                  {l.label}
                  <span aria-hidden="true" className="label-mono">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={whatsapp("Olá! Gostaria de pedir um orçamento.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="btn-base btn-solid mt-6 w-full"
          >
            Pedir orçamento
          </a>
          <p className="label-mono mt-5 normal-case tracking-[0.1em]">
            {contact.whatsappDisplay} · {contact.hours}
          </p>
        </div>
      </div>
    </header>
  );
}
