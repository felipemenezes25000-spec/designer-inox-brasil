import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import readabilityCss from "../readability.css?url";
import { contact, site } from "@/content/site";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { RelatedSection } from "@/components/site/RelatedSection";
import { CtaSection } from "@/components/site/CtaSection";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md">
        <p className="label-mono">Erro</p>
        <h1 className="display mt-4 text-3xl">Esta página não carregou.</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Algo falhou do nosso lado. Tentar de novo costuma resolver; se persistir, fale
          direto no WhatsApp {contact.whatsappDisplay}.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-base btn-solid"
          >
            Tentar de novo
          </button>
          <a href="/" className="btn-base btn-ghost">
            Ir para a home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: site.name },
      { name: "description", content: site.description },
      { name: "author", content: site.name },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "stylesheet",
        href: readabilityCss,
      },
      {
        rel: "preload",
        href: "/fonts/archivo-latin-variable.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "icon", href: "/brand/icon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/brand/icon-16.png", type: "image/png", sizes: "16x16" },
      { rel: "apple-touch-icon", href: "/brand/icon-180.png", sizes: "180x180" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <PageShell>
      <PageHero
        eyebrow="Erro 404"
        title="Esta página não existe."
        lead="O endereço pode ter mudado ou nunca ter existido. Os caminhos abaixo levam ao que o site tem."
      />
      <RelatedSection slugs={["cozinhas-industriais", "coifas-ventilacao-e-exaustao", "manutencao"]} />
      <CtaSection subject="orientação" />
    </PageShell>
  ),
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
