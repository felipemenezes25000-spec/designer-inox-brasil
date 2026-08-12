import { contact, whatsapp } from "@/content/site";

export function MobileLeadBar() {
  return (
    <aside
      aria-label="Contato rápido"
      className="fixed inset-x-0 bottom-0 z-[55] border-t border-border bg-background/95 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-12px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid max-w-xl grid-cols-2 gap-2">
        <a
          href={whatsapp("Olá! Quero enviar fotos e pedir uma avaliação para minha necessidade.")}
          target="_blank"
          rel="noopener noreferrer"
          data-conversion="whatsapp_mobile_bar"
          data-subject="barra móvel"
          className="btn-base btn-solid min-h-12 px-3 text-center"
        >
          WhatsApp
        </a>
        <a
          href={`tel:+${contact.whatsappNumber}`}
          data-conversion="phone_mobile_bar"
          data-subject="barra móvel"
          className="btn-base btn-ghost min-h-12 px-3 text-center"
        >
          Ligar agora
        </a>
      </div>
    </aside>
  );
}
