import type { CSSProperties } from "react";
import type { Accent } from "@/content/types";

/**
 * Classe de cor por acento. Mapa literal, não template string — o Tailwind
 * varre o código-fonte e não enxerga classe montada em runtime.
 *
 * `Record<Accent, string>` é de propósito: acrescentar um acento ao tipo sem
 * dar cor a ele vira erro de compilação, não item invisível em produção.
 */
const TEXT: Record<Accent, string> = {
  steel: "text-accent-steel",
  teal: "text-accent-teal",
  ice: "text-accent-ice",
  mint: "text-accent-mint",
  ember: "text-accent-ember",
  volt: "text-accent-volt",
};

export function accentText(accent: Accent | undefined) {
  return accent ? TEXT[accent] : "text-signal";
}

const VAR: Record<Accent, string> = {
  steel: "var(--accent-steel)",
  teal: "var(--accent-teal)",
  ice: "var(--accent-ice)",
  mint: "var(--accent-mint)",
  ember: "var(--accent-ember)",
  volt: "var(--accent-volt)",
};

/**
 * Define `--page-accent` para um ancestral.
 *
 * Os 7 diagramas SVG portados do site anterior pintam traço e preenchimento com
 * `var(--page-accent)` e contam com herança — lá a variável vinha de uma classe
 * `.accent-*` no ancestral. Sem definir, `stroke` resolve para `none` e metade
 * de cada diagrama some: serpentinas, quadro tracejado e seta de fluxo.
 *
 * Vai como estilo inline, não classe: `accent-steel` colidiria com a utilidade
 * `accent-color` que o Tailwind gera a partir de `--color-accent-steel`.
 */
export function accentStyle(accent: Accent | undefined) {
  return { "--page-accent": accent ? VAR[accent] : "var(--signal)" } as CSSProperties;
}
