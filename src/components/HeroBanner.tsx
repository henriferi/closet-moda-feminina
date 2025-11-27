import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroSlides } from "@/data/mockData";
import { Link } from "react-router-dom";

export const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden mt-[88px]">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary-rose/20 to-transparent" />
          </div>
          
          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex items-center justify-center">
            <div className="text-center max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-secondary mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-secondary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 drop-shadow-md">
                {slide.subtitle}
              </p>
              <Link to={slide.buttonLink}>
                <Button
                  size="lg"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-elegant animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
                >
                  {slide.buttonText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-smooth shadow-elegant"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-smooth shadow-elegant"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-6 h-6 text-foreground" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-smooth diamond-icon ${
              index === currentSlide ? "bg-secondary scale-125" : "bg-secondary/40"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};