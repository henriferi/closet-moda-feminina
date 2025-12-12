import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getApiKey } from "@/helpers/getAuthHeaders";

type HeroSlide = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  order_position: number | null;
  is_active: boolean;
};

export const HeroBanner = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 🔥 Buscar slides do Supabase
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const headers = await getApiKey();

        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hero_slides?is_active=eq.true&order=order_position.asc`,
          {
            method: "GET",
            headers,
          }
        );

        if (!res.ok) {
          console.error(await res.text());
          throw new Error("Erro ao buscar slides do HeroBanner");
        }

        const data = await res.json();
        setSlides(data);
      } catch (err) {
        console.error("Erro ao carregar hero slides:", err);
      }
    };

    fetchSlides();
  }, []);

  // 🔄 Autoplay
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides]);

  const goToSlide = (index: number) => setCurrentSlide(index);

  const goToPrevious = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden mt-[88px]">
      {/* Se não houver slides, não renderiza nada */}
      {slides.length === 0 && (
        <div className="flex items-center justify-center h-full bg-muted">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      )}

      {/* Slides reais vindo do Supabase */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary-rose/20 to-transparent" />
          </div>

          {/* Conteúdo */}
          <div className="relative h-full container mx-auto px-4 flex items-center justify-center">
            <div className="text-center max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-secondary mb-4 drop-shadow-lg">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-lg md:text-xl text-secondary mb-8 drop-shadow-md">
                  {slide.subtitle}
                </p>
              )}

              {slide.button_link && slide.button_text && (
                <Link to={slide.button_link}>
                  <Button
                    size="lg"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-elegant"
                  >
                    {slide.button_text}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Botões de navegação */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background shadow-elegant"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background shadow-elegant"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-smooth ${
                  index === currentSlide
                    ? "bg-secondary scale-125"
                    : "bg-secondary/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
