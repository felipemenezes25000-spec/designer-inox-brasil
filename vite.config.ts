// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
//
// Prerendering: the wrapper's own `nitro` option only forwards `preset`/`output`/`cloudflare`
// (see node_modules/@lovable.dev/vite-tanstack-config/dist/index.d.ts) — it does NOT expose
// nitro's own prerender config. But `tanstackStart` below is passed through verbatim (merged,
// then handed to the real tanstackStart() plugin — see dist/index.js), and the installed
// @tanstack/start-plugin-core (1.171.31, pulled in by react-start@1.168.40) owns prerendering
// itself via top-level `prerender`/`pages` options, independent of nitro — confirmed by reading
// its schema.js/prerender.js/post-build.js directly. So prerendering is configured here, not
// under `nitro`, and there's no need to eject from the wrapper to reach it.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

import { serviceSlugs } from "./src/content/services";
import { segmentSlugs } from "./src/content/segments";

// Same 25 routes the sitemap script (scripts/sitemap.ts) generates from — sourced from content
// data, not hand-typed, so it can't drift from the actual slugs on the next content change.
const routes = [
  "/",
  "/servicos/",
  "/segmentos/",
  "/clientes/",
  "/empresa/",
  "/orcamento/",
  "/politica-de-privacidade/",
  "/termos-de-uso/",
  ...serviceSlugs.map((s) => `/${s}/`),
  ...segmentSlugs.map((s) => `/segmentos/${s}/`),
];

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    prerender: {
      enabled: true,
      // crawlLinks/autoStaticPathsDiscovery off: the prerendered set is exactly `routes` above,
      // nothing discovered/crawled in addition — keeps the output deterministic and checkable
      // against the indexed sitemap (see scripts/sitemap.ts and Step 7 of the migration task).
      crawlLinks: false,
      autoStaticPathsDiscovery: false,
      failOnError: true,
    },
    pages: routes.map((path) => ({ path })),
  },
  // nitro is OFF on purpose. Output lands in dist/client/ (25 HTML files + assets) and
  // dist/server/ (an SSR bundle that's only used locally, to serve the prerender crawl below via
  // `vite preview` — not deployed). Both are gitignored; only dist/client/ ships to Vercel.
  //
  // WHY: the installed nitro (3.0.260603-beta, pre-RC) is broken here in a way that's silent and
  // serious, not just a failed build. With nitro on (tried presets "static", "cloudflare-module",
  // "node-server", and nitro@3.0.260610-beta, the newest prerelease available): nitro's own
  // request renderer (dist/runtime/internal/routes/renderer-template.mjs) reads the project's
  // root index.html as a static template, finds no `{{{ }}}` template syntax in it (the
  // `<!--ssr-outlet-->` substitution that would add it never fires for this project's config),
  // and serves that ONE file verbatim for every request — including every request the prerender
  // crawler makes. Build output looked fine ("Prerendered 25 routes", exit 0 on most presets),
  // but every one of the 25 HTML files was byte-identical to the root index.html — same size,
  // same <title>, cozinhas-industriais/index.html not containing its own copy text. A
  // correct-looking, wrong-content build: the exact silent failure this migration exists to catch,
  // just one layer past a page count. The "static" preset routes around setting up that server
  // entry and instead crashes outright in the build's final "nitro environment" bundling pass
  // ("rolldownOptions.input should not be an html file when building for SSR").
  //
  // With nitro off, TanStack Start's own prerender adapter (start-plugin-core's
  // `prerenderWithVite`) takes over: it boots `vite preview` against the properly-built SSR
  // environment and crawls it directly, no nitro renderer/template layer involved. Content is
  // correct per route (verified), and the build exits 0. Root-caused to nitro/vite-8 compat in a
  // pre-release package, not to prerendering config — flag as a follow-up once nitro ships a fix.
  nitro: false,
});
