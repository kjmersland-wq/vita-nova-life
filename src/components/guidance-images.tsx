import plate from "@/assets/vita-guide-protein-plate.jpg";
import water from "@/assets/vita-guide-water.jpg";
import strength from "@/assets/vita-guide-strength.jpg";
import walk from "@/assets/vita-guide-walk.jpg";
import scoop from "@/assets/vita-guide-scoop.jpg";

/** Free Unsplash photos (Unsplash License). Credit is shown under every picture. */
export const GUIDE_IMG = {
  plate: { src: plate, by: "Orkun Orcan", href: "https://unsplash.com/photos/3ru16c1mSsU", pos: "object-center" },
  water: { src: water, by: "Aneta Voborilova", href: "https://unsplash.com/photos/V2TubGSIf0w", pos: "object-[50%_68%]" },
  strength: { src: strength, by: "Centre for Ageing Better", href: "https://unsplash.com/photos/kB4FXX1KXhQ", pos: "object-center" },
  walk: { src: walk, by: "Age Cymru", href: "https://unsplash.com/photos/0OQMAnA8aLQ", pos: "object-center" },
  scoop: { src: scoop, by: "HowToGym", href: "https://unsplash.com/photos/S9NchuPb79I", pos: "object-center" },
} as const;

export type GuideImgKey = keyof typeof GUIDE_IMG;

export function GuideFigure({
  img,
  alt,
  photoLabel,
  className = "aspect-[16/8]",
}: {
  img: GuideImgKey;
  alt: string;
  photoLabel: string;
  className?: string;
}) {
  const i = GUIDE_IMG[img];
  return (
    <figure className="m-0">
      <img src={i.src} alt={alt} loading="lazy" className={`w-full rounded-md object-cover ${i.pos} ${className}`} />
      <figcaption className="mt-1 text-[11px] leading-snug text-muted-foreground">
        {photoLabel}:{" "}
        <a href={i.href} target="_blank" rel="noopener noreferrer" className="underline">
          {i.by}
        </a>{" "}
        /{" "}
        <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">
          Unsplash
        </a>
      </figcaption>
    </figure>
  );
}
