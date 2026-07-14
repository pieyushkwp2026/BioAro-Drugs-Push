import type { CSSProperties } from "react";
import PlaceholderBottle from "./PlaceholderBottle";

interface ProductImageStageProps {
  src?: string;
  alt?: string;
  initials: string;
  imageScale?: number;
  imagePositionX?: string;
  imagePositionY?: string;
}

export default function ProductImageStage({
  src,
  alt = "",
  initials,
  imageScale = 1,
  imagePositionX = "50%",
  imagePositionY = "50%",
}: ProductImageStageProps) {
  const imageStyle = {
    "--image-scale": imageScale,
    objectPosition: `${imagePositionX} ${imagePositionY}`,
  } as CSSProperties;

  return (
    <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[#eeeae1] p-6 sm:p-7 md:p-8">
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full origin-center scale-[var(--image-scale)] object-contain transition-transform duration-500 group-hover:scale-[calc(var(--image-scale)*1.05)]"
          style={imageStyle}
        />
      ) : (
        <PlaceholderBottle
          initials={initials}
          className="h-full w-full max-w-[140px] origin-center scale-[var(--image-scale)] transition-transform duration-500 group-hover:scale-[calc(var(--image-scale)*1.05)]"
          style={imageStyle}
        />
      )}
    </div>
  );
}
