import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loopingTexts } from "@/data/mockData";
import { CartDrawer } from "@/components/CartDrawer";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % loopingTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { name: "Início", path: "/" },
    { name: "Produtos", path: "/produtos" },
    { name: "Sobre Nós", path: "/sobre" },
    { name: "Contato", path: "/contato" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Looping Text Banner */}
      <div className="gradient-rose py-2 overflow-hidden">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-secondary-foreground font-medium transition-smooth">
            {loopingTexts[currentTextIndex].text}
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Diamond className="w-6 h-6 text-primary-rose transition-smooth group-hover:scale-110" />
            <span className="text-xl md:text-2xl font-serif font-bold text-foreground">
              Closet <span className="text-primary-rose">Moda Feminina</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-foreground hover:text-primary-rose transition-smooth font-medium"
              >
                {item.name}
              </Link>
            ))}
            <CartDrawer />
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <CartDrawer />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-foreground hover:text-primary-rose transition-smooth font-medium px-4 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};