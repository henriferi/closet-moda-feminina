import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Diamond, Mail, Phone, Instagram, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import contactImage from "@/assets/contact-whatsapp.jpg";

const Contact = () => {
  const whatsappNumber = "5581985948766";
  const whatsappMessage = "Olá! Gostaria de mais informações sobre os produtos.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[128px] pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Diamond className="w-8 h-8 text-primary-rose" />
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                Entre em Contato
              </h1>
              <Diamond className="w-8 h-8 text-primary-rose" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Estamos aqui para ajudar! Entre em contato conosco através do formulário 
              ou pelos nossos canais de atendimento
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* WhatsApp Contact */}
            <div className="bg-gradient-subtle rounded-2xl p-8 shadow-card">
              <div className="text-center">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                  Fale Conosco pelo WhatsApp
                </h2>
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-6">
                  <img 
                    src={contactImage} 
                    alt="Atendimento Closet Moda Feminina"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-muted-foreground mb-6">
                  Estamos prontas para atender você! Clique no botão abaixo e converse 
                  diretamente com nossa equipe pelo WhatsApp.
                </p>
                <Button
                  variant="elegant"
                  size="lg"
                  className="w-full"
                  onClick={() => window.open(whatsappUrl, '_blank')}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Chamar no WhatsApp
                </Button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full gradient-rose flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">E-mail</h3>
                    <a
                      href="mailto:lojaclosett.adm@gmail.com"
                      className="text-muted-foreground hover:text-primary-rose transition-smooth"
                    >
                      lojaclosett.adm@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full gradient-rose flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Telefone / WhatsApp</h3>
                    <a
                      href="tel:+5581985948766"
                      className="text-muted-foreground hover:text-primary-rose transition-smooth"
                    >
                      (81) 98594-8766
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full gradient-rose flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Redes Sociais</h3>
                    <a
                      href="https://www.instagram.com/lojaclosett_/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary-rose transition-smooth"
                    >
                      @lojaclosett_
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full gradient-rose flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Horário de Atendimento</h3>
                    <p className="text-muted-foreground">
                      Segunda a Sabado: 10h às 18h<br />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Contact;