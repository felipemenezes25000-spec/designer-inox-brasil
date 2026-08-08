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
