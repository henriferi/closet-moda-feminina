import { Link } from "react-router-dom";
import { Diamond, Instagram, Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Diamond className="w-6 h-6 text-primary-rose" />
              <span className="text-xl font-serif font-bold">
                Closet <span className="text-primary-rose">Moda Feminina</span>
              </span>
            </Link>
            <p className="text-sm text-secondary-foreground/80">
              Elegância, sofisticação e estilo em cada peça.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Links Rápidos</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm hover:text-primary-rose transition-smooth">
                Início
              </Link>
              <Link to="/produtos" className="text-sm hover:text-primary-rose transition-smooth">
                Produtos
              </Link>
              <Link to="/sobre" className="text-sm hover:text-primary-rose transition-smooth">
                Sobre Nós
              </Link>
              <Link to="/contato" className="text-sm hover:text-primary-rose transition-smooth">
                Contato
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contato</h3>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:lojaclosett.adm@gmail.com"
                className="flex items-center gap-2 text-sm hover:text-primary-rose transition-smooth"
              >
                <Mail className="w-4 h-4" />
                lojaclosett.adm@gmail.com
              </a>
              <a
                href="tel:+5581985948766"
                className="flex items-center gap-2 text-sm hover:text-primary-rose transition-smooth"
              >
                <Phone className="w-4 h-4" />
                (81) 98594-8766
              </a>
              <a
                href="https://www.instagram.com/lojaclosett_/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary-rose transition-smooth"
              >
                <Instagram className="w-4 h-4" />
                @lojaclosett_
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-secondary-foreground/60">
            © 2025 Closet Moda Feminina. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};