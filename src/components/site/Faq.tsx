import { SectionShell, SectionHeading } from "./primitives";
import { homeFaq, whatsapp } from "@/content/site";

export function Faq() {
  return (
    <SectionShell id="duvidas" className="py-20 sm:py-28 lg:py-36">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            index="07"
            eyebrow="Dúvidas comuns"
            title={
              <>
                Dúvidas antes de
                <span className="block text-titanium-fill pb-[0.06em]">pedir orçamento.</span>
              </>
            }
          />
          <a
            href={whatsapp("Olá! Tenho uma dúvida antes de pedir orçamento.")}
            target="_blank"
            rel="noopener noreferrer"
            className="label-mono link-underline mt-8 inline-flex min-h-11 items-center text-foreground"
          >
            Perguntar direto no WhatsApp
          </a>
        </div>

        <dl className="min-w-0">
          {homeFaq.map((item, i) => (
            <div key={item.q} className="reveal border-b border-border first:border-t" data-reveal>
              <details className="group">
                <summary className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-4 py-6 marker:hidden [&::-webkit-details-marker]:hidden sm:gap-6 sm:py-8">
                  <span className="label-mono pt-1.5 text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <dt className="min-w-0 font-display text-lg font-bold leading-snug tracking-tight transition-colors group-hover:text-foreground sm:text-2xl">
                    {item.q}
                  </dt>
                  <span
                    aria-hidden="true"
                    className="relative mt-2 grid h-5 w-5 shrink-0 place-items-center"
                  >
                    <span className="block h-px w-4 bg-foreground" />
                    <span className="absolute block h-4 w-px bg-foreground transition-transform duration-500 group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>
                <dd className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 pb-8 sm:gap-6">
                  <span aria-hidden="true" />
                  <p className="min-w-0 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.a}
                  </p>
                </dd>
              </details>
            </div>
          ))}
        </dl>
      </div>
    </SectionShell>
  );
}
