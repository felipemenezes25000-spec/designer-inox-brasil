import { useEffect, useState } from "react";
import heroImg from "@/assets/hero-cozinha.jpg";
import { MagneticLink } from "./primitives";
import { whatsappLink } from "@/lib/site-data";

const marks = [
  "Sob medida para o espaço real",
  "Do projeto à manutenção",
  "Escopo definido antes da fabricação",
];

export function Hero() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setOffset(Math.min(window.scrollY, 900)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="topo" className="relative isolate min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt="Cozinha industrial em aço inox com bancadas e coifa sob medida"
          width={1920}
          height={1280}
          fetchPriority="high"
          decoding="async"
          className="h-[112%] w-full object-cover object-center"
          style={{ transform: `translate3d(0, ${offset * 0.12}px, 0)` }}
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
        <div className="grid-etch absolute inset-0" />
        {/* Assinatura: feixe especular atravessando a chapa */}
        <div
          aria-hidden="true"
          className="animate-scan absolute inset-y-0 -left-1/3 w-1/3 bg-linear-to-r from-transparent via-white/8 to-transparent"
        />
      </div>

      <div className="mx-auto flex min-h-[100svh] w-full max-w-[1680px] flex-col justify-end px-5 pb-8 pt-28 sm:px-8 sm:pb-12 lg:px-14 lg:pb-16 2xl:px-20">
        <p className="reveal label-mono" data-reveal>
          Projeto · Fabricação · Sistemas · Manutenção
        </p>

        <h1 className="display mt-6 text-[clamp(2.6rem,9.2vw,9rem)] sm:mt-8">
          <span
            className="reveal block text-titanium-fill pb-[0.06em]"
            data-reveal
            style={{ transitionDelay: "80ms" }}
          >
            Engenharia em inox
          </span>
          <span
            className="reveal block text-foreground/85"
            data-reveal
            style={{ transitionDelay: "170ms" }}
          >
            para a operação
          </span>
          <span
            className="reveal block text-foreground/85"
            data-reveal
            style={{ transitionDelay: "260ms" }}
          >
            funcionar de verdade.
          </span>
        </h1>

        <div
          className="reveal mt-10 grid gap-8 border-t border-border pt-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-14"
          data-reveal
          style={{ transitionDelay: "340ms" }}
        >
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Projeto técnico, fabricação sob medida, instalação, exaustão, refrigeração,
            aquecimento, automação e manutenção em Brasília / DF e entorno.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <MagneticLink href={whatsappLink("Olá! Gostaria de pedir um orçamento.")} external>
              Pedir orçamento
            </MagneticLink>
            <MagneticLink href="#solucoes" variant="ghost">
              Ver soluções
            </MagneticLink>
          </div>
        </div>

        <ul
          className="reveal mt-10 grid gap-x-8 gap-y-4 border-t border-border pt-6 sm:grid-cols-3"
          data-reveal
          style={{ transitionDelay: "420ms" }}
        >
          {marks.map((m, i) => (
            <li key={m} className="label-mono flex items-start gap-3 normal-case tracking-[0.12em]">
              <span aria-hidden="true" className="mt-2 block h-px w-4 shrink-0 bg-signal" />
              <span className="min-w-0">
                <span className="sr-only">{i + 1}. </span>
                {m}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
