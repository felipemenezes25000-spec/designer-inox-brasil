import { illustrations } from "@/content/illustrations";

export function Illustration({ id, className = "" }: { id: string; className?: string }) {
  const svg = illustrations[id];
  if (!svg) return null;

  // O SVG é conteúdo do próprio projeto, versionado no repositório — não vem de
  // entrada de usuário nem de rede, então não há superfície de injeção aqui.
  return (
    <div
      className={`aspect-[4/3] w-full overflow-hidden [&>svg]:h-full [&>svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
