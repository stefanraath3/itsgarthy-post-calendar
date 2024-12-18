import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageCarouselProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export function ImageCarousel({ images, currentIndex, onIndexChange }: ImageCarouselProps) {
  const [loadedImages, setLoadedImages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextImagePreloading, setNextImagePreloading] = useState(false);

  // Preload the current image and the next image
  useEffect(() => {
    const preloadImage = (url: string, index: number) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setLoadedImages(prev => [...prev, index]);
        if (index === currentIndex) {
          setIsLoading(false);
        }
        if (index === (currentIndex + 1) % images.length) {
          setNextImagePreloading(false);
        }
      };
    };

    // Load current image
    if (!loadedImages.includes(currentIndex)) {
      setIsLoading(true);
      preloadImage(images[currentIndex], currentIndex);
    } else {
      setIsLoading(false);
    }

    // Preload next image
    const nextIndex = (currentIndex + 1) % images.length;
    if (!loadedImages.includes(nextIndex)) {
      setNextImagePreloading(true);
      preloadImage(images[nextIndex], nextIndex);
    }
  }, [currentIndex, images, loadedImages]);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    onIndexChange(nextIndex);
  };

  const handlePrevious = () => {
    const previousIndex = (currentIndex - 1 + images.length) % images.length;
    onIndexChange(previousIndex);
  };

  return (
    <div className="relative w-full aspect-square">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={handlePrevious}
            disabled={isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={handleNext}
            disabled={isLoading || nextImagePreloading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-gray-300"
                }`}
                onClick={() => onIndexChange(index)}
                disabled={isLoading}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
