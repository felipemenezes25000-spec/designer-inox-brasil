import { site } from "@/content/site";

/**
 * A marca, ciente da superfície.
 *
 * O símbolo positivo é escuro e o negativo é claro. Como CSS não troca o
 * `src` de um `<img>`, os dois vão no DOM e `.surface-dark` decide qual aparece
 * — ver `brand-on-light` / `brand-on-dark` em styles.css.
 *
 * Os símbolos são decorativos; o nome visível é a única fonte textual da
 * marca, evitando anúncios duplicados por leitores de tela.
 */
export function Brand({ className = "h-10 w-auto sm:h-11" }: { className?: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2 sm:gap-3">
      <span className="inline-flex shrink-0 items-center" aria-hidden="true">
        <picture className="brand-on-light">
          <source type="image/avif" srcSet="/brand/symbol-positive.avif" />
          <source type="image/webp" srcSet="/brand/symbol-positive.webp" />
          <img
            src="/brand/symbol-positive.png"
            alt=""
            width="512"
            height="512"
            className={className}
          />
        </picture>

        <picture className="brand-on-dark">
          <source type="image/avif" srcSet="/brand/symbol-negative.avif" />
          <source type="image/webp" srcSet="/brand/symbol-negative.webp" />
          <img
            src="/brand/symbol-negative.png"
            alt=""
            width="512"
            height="512"
            className={className}
          />
        </picture>
      </span>

      <span className="min-w-0 whitespace-nowrap font-display text-[12.5px] font-semibold leading-none tracking-[-0.025em] text-foreground sm:text-[15px]">
        {site.name}
      </span>
    </span>
  );
}
