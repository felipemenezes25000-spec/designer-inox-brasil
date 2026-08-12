import type { ReactNode } from "react";
import type { Accent } from "@/content/types";
import { accentStyle } from "@/lib/accent";
import { useReveal } from "@/hooks/use-reveal";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import { ConversionLayer } from "./ConversionLayer";
import { MobileLeadBar } from "./MobileLeadBar";

export function PageShell({ children, accent }: { children: ReactNode; accent?: Accent }) {
  useReveal();

  return (
    <div className="min-h-screen bg-background pb-[4.75rem] md:pb-0" style={accentStyle(accent)}>
      <a
        href="#conteudo"
        className="btn-base btn-solid sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60]"
      >
        Ir para o conteúdo principal
      </a>
      <ConversionLayer />
      <SiteNav />
      <main id="conteudo">{children}</main>
      <SiteFooter />
      <MobileLeadBar />
    </div>
  );
}
