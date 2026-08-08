import type { ReactNode } from "react";
import type { Accent } from "@/content/types";
import { accentStyle } from "@/lib/accent";
import { useReveal } from "@/hooks/use-reveal";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ children, accent }: { children: ReactNode; accent?: Accent }) {
  useReveal();

  return (
    <div className="min-h-screen bg-background" style={accentStyle(accent)}>
      <a
        href="#conteudo"
        className="btn-base btn-solid sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60]"
      >
        Ir para o conteúdo principal
      </a>
      <SiteNav />
      <main id="conteudo">{children}</main>
      <SiteFooter />
    </div>
  );
}
