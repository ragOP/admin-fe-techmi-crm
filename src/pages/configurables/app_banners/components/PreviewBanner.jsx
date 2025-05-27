import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const PreviewBanner = ({ config }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? config.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === config.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-2/6">
      <h2 className="text-xl font-semibold mb-4">Preview</h2>
      {config.length > 0 ? (
        <div className="relative">
          <div className="p-1 relative">
            <div className="flex aspect-video items-center justify-center bg-muted rounded-lg relative overflow-hidden">
              <img
                src={config[currentIndex]?.url || config[currentIndex]}
                alt={`Banner ${currentIndex + 1}`}
                className="object-cover h-full w-full"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-sm px-3 py-1 rounded">
                {currentIndex + 1} / {config.length}
              </div>
              {config[currentIndex]?.type === "new" && (
                <div className="absolute top-2 right-2">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                </div>
              )}
              
              {/* Navigation Controls - Bottom Right */}
              {config.length > 1 && (
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <button
                    onClick={goToPrevious}
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors duration-200"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors duration-200"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <Upload className="h-12 w-12 mx-auto mb-2" />
              <p>No banners to preview</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PreviewBanner;