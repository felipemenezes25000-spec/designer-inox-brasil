import { site } from "@/content/site";

/**
 * Assinatura visual da marca.
 *
 * O símbolo se adapta à superfície (clara/escura) e o lockup textual destaca
 * "AUTOMAÇÃO INDUSTRIAL" sem substituir o nome institucional da empresa.
 * Assim a navegação ganha mais presença sem criar divergência de SEO, rodapé
 * ou dados legais.
 */
export function Brand({
  className = "h-11 w-auto sm:h-12 lg:h-[52px]",
  textClassName = "text-[15px] sm:text-[18px] lg:text-[20px]",
}: {
  className?: string;
  textClassName?: string;
}) {
  return (
    <span className="group/brand inline-flex min-w-0 items-center gap-2.5 sm:gap-3">
      <span
        className="relative inline-flex shrink-0 items-center drop-shadow-[0_5px_12px_rgba(0,0,0,0.22)]"
        aria-hidden="true"
      >
        <span className="pointer-events-none absolute inset-1 rounded-full bg-signal/10 blur-md transition-opacity duration-500 group-hover/brand:opacity-90" />

        <picture className="brand-on-light relative">
          <source type="image/avif" srcSet="/brand/symbol-positive.avif" />
          <source type="image/webp" srcSet="/brand/symbol-positive.webp" />
          <img
            src="/brand/symbol-positive.png"
            alt=""
            width="512"
            height="512"
            className={`${className} transition-transform duration-500 group-hover/brand:scale-[1.035]`}
          />
        </picture>

        <picture className="brand-on-dark relative">
          <source type="image/avif" srcSet="/brand/symbol-negative.avif" />
          <source type="image/webp" srcSet="/brand/symbol-negative.webp" />
          <img
            src="/brand/symbol-negative.png"
            alt=""
            width="512"
            height="512"
            className={`${className} transition-transform duration-500 group-hover/brand:scale-[1.035]`}
          />
        </picture>
      </span>

      <span
        aria-hidden="true"
        className="h-8 w-px shrink-0 bg-[linear-gradient(to_bottom,transparent,var(--signal),transparent)] opacity-80 sm:h-10"
      />

      <span className="min-w-0">
        <span
          className={`block whitespace-nowrap bg-clip-text font-display font-black uppercase leading-[0.92] tracking-[-0.045em] text-transparent ${textClassName}`}
          style={{ backgroundImage: "var(--gradient-titanium)" }}
        >
          <span className="block sm:inline">AUTOMAÇÃO</span>
          <span className="block text-signal sm:ml-1.5 sm:inline">INDUSTRIAL</span>
        </span>

        <span className="mt-1.5 flex items-center gap-1.5 whitespace-nowrap font-mono text-[8px] font-semibold uppercase leading-none tracking-[0.12em] text-foreground/70 sm:text-[9px] lg:text-[10px]">
          <span className="h-px w-3 bg-signal/80 sm:w-4" aria-hidden="true" />
          {site.name}
          <span className="h-px flex-1 bg-gradient-to-r from-signal/55 to-transparent" aria-hidden="true" />
        </span>
      </span>
    </span>
  );
}
