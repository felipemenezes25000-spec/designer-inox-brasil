import { site } from "@/content/site";

/**
 * A marca, ciente da superfície.
 *
 * O lockup positivo é escuro e o negativo é claro. Como CSS não troca o `src`
 * de um `<img>`, os dois vão no DOM e `.surface-dark` decide qual aparece —
 * ver `brand-on-light` / `brand-on-dark` em styles.css.
 *
 * O alternativo fica só num deles: dois `alt` iguais fariam o leitor de tela
 * anunciar a marca duas vezes.
 */
export function Brand({ className = "h-8 w-auto sm:h-9" }: { className?: string }) {
  return (
    <>
      <picture className="brand-on-light">
        <source type="image/avif" srcSet="/brand/lockup-positive.avif" />
        <source type="image/webp" srcSet="/brand/lockup-positive.webp" />
        <img src="/brand/lockup-positive.png" alt={site.name} className={className} />
      </picture>
      <picture className="brand-on-dark">
        <source type="image/avif" srcSet="/brand/lockup-negative.avif" />
        <source type="image/webp" srcSet="/brand/lockup-negative.webp" />
        <img src="/brand/lockup-negative.png" alt="" aria-hidden="true" className={className} />
      </picture>
    </>
  );
}
