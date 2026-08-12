import { photos } from "@/content/site";

type Size = 640 | 1280 | 1920;

const SIZES: Size[] = [640, 1280, 1920];
const FALLBACK_WIDTH = 1280;
const FALLBACK_HEIGHT = 853; // derivados em scripts/images.mjs são recortados em 3:2

function srcSet(id: string, ext: "avif" | "webp") {
  return SIZES.map((s) => `/photos/${id}-${s}.${ext} ${s}w`).join(", ");
}

export function Photo({
  id,
  className = "",
  sizes = "100vw",
  priority = false,
  caption = true,
}: {
  id: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  caption?: boolean;
}) {
  const entry = photos[id];
  if (!entry) return null;

  return (
    <figure className={`relative overflow-hidden ${className}`}>
      <picture>
        <source type="image/avif" srcSet={srcSet(id, "avif")} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(id, "webp")} sizes={sizes} />
        <img
          src={`/photos/${id}-1280.jpg`}
          alt={entry.alt}
          width={FALLBACK_WIDTH}
          height={FALLBACK_HEIGHT}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          className="h-full w-full object-cover"
        />
      </picture>

      {caption && (
        <figcaption className="label-mono absolute bottom-0 left-0 bg-background/85 px-3 py-2 text-[0.65rem] backdrop-blur-sm">
          {entry.own ? (
            <span className="text-signal">Projeto Designer Inox</span>
          ) : (
            <span className="text-muted-foreground">
              Imagem ilustrativa · {entry.credit}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
