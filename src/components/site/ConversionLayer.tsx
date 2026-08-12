import { useEffect } from "react";

const ATTRIBUTION_KEY = "designer-inox-attribution-v1";
const attributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

type AttributionKey = (typeof attributionKeys)[number];
type Attribution = Partial<Record<AttributionKey, string>>;
type TrackingWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

function clean(value: string | null): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized.slice(0, 180) : undefined;
}

function readAttribution(): Attribution {
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Attribution;
  } catch {
    return {};
  }
}

function captureAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const captured: Attribution = {};

  for (const key of attributionKeys) {
    const value = clean(params.get(key));
    if (value) captured[key] = value;
  }

  if (Object.keys(captured).length) {
    try {
      window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(captured));
    } catch {
      // A navegação e os CTAs continuam funcionando mesmo com storage bloqueado.
    }
  }

  return captured;
}

function attributionLabel(attribution: Attribution): string {
  const source =
    attribution.utm_source ??
    (attribution.gclid ? "Google Ads" : attribution.fbclid ? "Meta Ads" : undefined);
  const parts = [
    source && `origem: ${source}`,
    attribution.utm_campaign && `campanha: ${attribution.utm_campaign}`,
    attribution.utm_term && `termo: ${attribution.utm_term}`,
  ].filter(Boolean);

  return parts.join(" · ");
}

function trackConversion(eventName: string, attribution: Attribution, subject?: string) {
  const trackingWindow = window as TrackingWindow;
  const payload = {
    event: eventName,
    page_path: window.location.pathname,
    subject,
    ...attribution,
  };

  trackingWindow.dataLayer = trackingWindow.dataLayer ?? [];
  trackingWindow.dataLayer.push(payload);
  trackingWindow.gtag?.("event", eventName, payload);
  trackingWindow.fbq?.("trackCustom", eventName, payload);
}

/**
 * Camada de atribuição pronta para mídia paga.
 *
 * Sem IDs de Google/Meta configurados, nada é enviado para uma plataforma de
 * analytics. O componente apenas preserva parâmetros de campanha durante a
 * sessão, registra eventos numa dataLayer local e leva uma indicação legível
 * de origem até a mensagem do WhatsApp quando o visitante decide entrar em
 * contato. Se gtag/fbq forem instalados depois, os mesmos eventos já ficam
 * preparados para integração.
 */
export function ConversionLayer() {
  useEffect(() => {
    const captured = captureAttribution();
    const attribution = { ...readAttribution(), ...captured };

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      const isWhatsapp = url.hostname === "wa.me" || url.hostname.endsWith(".wa.me");
      const isPhone = url.protocol === "tel:";
      const isQuoteStart = url.origin === window.location.origin && url.pathname.replace(/\/+$/, "") === "/orcamento";

      if (isWhatsapp) {
        const label = attributionLabel(attribution);
        const currentText = url.searchParams.get("text") ?? "";
        if (label && !currentText.includes("Origem do anúncio:")) {
          url.searchParams.set("text", `${currentText}\n\nOrigem do anúncio: ${label}`.trim());
          anchor.href = url.toString();
        }
      }

      const inferredEvent = isWhatsapp
        ? "whatsapp_click"
        : isPhone
          ? "phone_click"
          : isQuoteStart
            ? "start_quote"
            : undefined;
      const eventName = anchor.dataset.conversion ?? inferredEvent;
      if (!eventName) return;

      trackConversion(eventName, attribution, anchor.dataset.subject);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
