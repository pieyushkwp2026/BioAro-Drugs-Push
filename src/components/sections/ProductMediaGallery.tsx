import { useEffect, useState, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

export interface ProductGalleryImage {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  position?: string;
}

interface ProductMediaGalleryProps {
  images: ProductGalleryImage[];
}

export default function ProductMediaGallery({ images }: ProductMediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const selectedImage = images[selectedIndex];

  const selectPrevious = () => setSelectedIndex((current) => (current - 1 + images.length) % images.length);
  const selectNext = () => setSelectedIndex((current) => (current + 1) % images.length);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLightboxOpen(false);
      if (event.key === "ArrowLeft") selectPrevious();
      if (event.key === "ArrowRight") selectNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, images.length]);

  const handleTouchStart = (event: TouchEvent<HTMLButtonElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLButtonElement>) => {
    if (touchStartX === null) return;

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
    const delta = touchEndX - touchStartX;

    if (Math.abs(delta) > 48) {
      if (delta > 0) selectPrevious();
      else selectNext();
    }

    setTouchStartX(null);
  };

  if (images.length === 0) return null;

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-1 sm:w-[76px] sm:flex-col sm:overflow-visible md:w-[80px] lg:w-[88px]">
          {images.map((image, index) => {
            const isActive = index === selectedIndex;

            return (
              <button
                key={image.src}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`View image ${index + 1} of ${images.length}: ${image.alt}`}
                aria-pressed={isActive}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 bg-[#f5f1ea] transition-[border-color,opacity] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 sm:h-[76px] sm:w-[76px] md:h-[80px] md:w-[80px] lg:h-[88px] lg:w-[88px] ${
                  isActive ? "border-[#d85f4d] opacity-100" : "border-[#e2ded2] opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={image.src}
                  alt=""
                  loading={index === 0 ? "eager" : "lazy"}
                  className={image.fit === "contain" ? "h-full w-full object-contain" : "h-full w-full object-cover"}
                  style={{ objectPosition: image.position ?? "center" }}
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-label={`Open larger view of image ${selectedIndex + 1} of ${images.length}: ${selectedImage.alt}`}
          className="group relative order-1 aspect-square w-full overflow-hidden rounded-[20px] border border-[#e2ded2] bg-[#f5f1ea] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-600 sm:order-2"
        >
          <img
            key={selectedImage.src}
            src={selectedImage.src}
            alt={selectedImage.alt}
            loading={selectedIndex === 0 ? "eager" : "lazy"}
            className={`h-full w-full transition-opacity duration-200 ${selectedImage.fit === "contain" ? "object-contain" : "object-cover"}`}
            style={{ objectPosition: selectedImage.position ?? "center" }}
          />
          <span className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1.5 text-xs font-medium text-ink backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </span>
          <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-ink opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
            <Expand size={17} aria-hidden="true" />
          </span>
        </button>
      </div>

      {isLightboxOpen && (
        <div role="dialog" aria-modal="true" aria-label="Product image viewer" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close image viewer"
            className="absolute inset-0 bg-[#17130f]/80 backdrop-blur-sm"
          />
          <div className="relative z-10 flex h-full w-full max-w-6xl items-center justify-center">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className={`max-h-full max-w-full rounded-[20px] border border-white/15 bg-[#f5f1ea] shadow-2xl ${selectedImage.fit === "contain" ? "object-contain" : "object-contain"}`}
            />
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close image viewer"
              className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-lg transition-colors hover:bg-[#f5f1ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={selectPrevious}
              aria-label="View previous image"
              className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-lg transition-colors hover:bg-[#f5f1ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={selectNext}
              aria-label="View next image"
              className="absolute right-0 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-lg transition-colors hover:bg-[#f5f1ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
