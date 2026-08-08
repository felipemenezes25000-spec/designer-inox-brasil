/**
 * Gera sitemap.xml e robots.txt na saída pré-renderizada.
 *
 * A lista de rotas sai dos mesmos dados que geram as páginas — sitemap
 * escrito à mão diverge do site na primeira mudança e ninguém percebe.
 */

import { writeFile } from "node:fs/promises";
import path from "node:path";

import { site } from "../src/content/site";
import { serviceSlugs } from "../src/content/services";
import { segmentSlugs } from "../src/content/segments";

// dist/client, não .output/public: o nitro instalado (3.0.260603-beta, pre-RC) corrompe o
// conteúdo pré-renderizado nesta versão do toolchain (ver comentário sobre `nitro: false` em
// vite.config.ts), então o build roda com nitro desligado e a saída do TanStack Start vai para
// dist/client/. Ajuste aqui se a pasta de saída real mudar.
const OUT = process.argv[2] ?? "dist/client";

const routes = [
  { path: "/", priority: "1.0" },
  { path: "/servicos/", priority: "0.9" },
  { path: "/segmentos/", priority: "0.8" },
  { path: "/clientes/", priority: "0.7" },
  { path: "/empresa/", priority: "0.7" },
  { path: "/orcamento/", priority: "0.9" },
  ...serviceSlugs.map((s) => ({ path: `/${s}/`, priority: "0.8" })),
  ...segmentSlugs.map((s) => ({ path: `/segmentos/${s}/`, priority: "0.7" })),
  { path: "/politica-de-privacidade/", priority: "0.3" },
  { path: "/termos-de-uso/", priority: "0.3" },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${site.origin}${r.path}</loc>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${site.origin}/sitemap.xml
`;

await writeFile(path.join(OUT, "sitemap.xml"), sitemap);
await writeFile(path.join(OUT, "robots.txt"), robots);

console.log(`sitemap.xml: ${routes.length} URLs`);
