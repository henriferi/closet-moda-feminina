import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Diamond, Heart, Sparkles, Star } from "lucide-react";

const About = () => {
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
                Sobre Nós
              </h1>
              <Diamond className="w-8 h-8 text-primary-rose" />
            </div>
            <div className="w-24 h-1 bg-gradient-rose mx-auto rounded-full" />
          </div>

          {/* Story Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-subtle rounded-2xl p-8 md:p-12 shadow-card">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                Nossa História
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                A <span className="text-primary-rose font-semibold">Closet Moda Feminina</span> nasceu 
                do sonho de criar um espaço onde elegância, sofisticação e conforto se encontram. 
                Acreditamos que cada mulher merece se sentir especial e confiante em suas escolhas de moda.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Nossa coleção é cuidadosamente selecionada para oferecer peças atemporais que 
                transcendem as tendências passageiras. Buscamos qualidade, caimento perfeito e 
                designs que celebram a feminilidade em todas as suas formas.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Mais do que uma loja, somos um espaço de expressão pessoal, onde cada peça conta 
                uma história e ajuda você a escrever a sua.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-card rounded-xl shadow-card transition-smooth hover:shadow-elegant">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-rose flex items-center justify-center">
                <Heart className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                Paixão pela Moda
              </h3>
              <p className="text-muted-foreground">
                Cada peça é escolhida com amor e atenção aos detalhes
              </p>
            </div>

            <div className="text-center p-8 bg-card rounded-xl shadow-card transition-smooth hover:shadow-elegant">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-rose flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                Qualidade Premium
              </h3>
              <p className="text-muted-foreground">
                Tecidos nobres e acabamento impecável em todas as peças
              </p>
            </div>

            <div className="text-center p-8 bg-card rounded-xl shadow-card transition-smooth hover:shadow-elegant">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-rose flex items-center justify-center">
                <Star className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                Estilo Único
              </h3>
              <p className="text-muted-foreground">
                Peças exclusivas que expressam sua personalidade
              </p>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="text-2xl md:text-3xl font-serif italic text-primary-rose leading-relaxed">
              "Moda é a armadura para sobreviver à realidade do dia a dia. 
              Nós fornecemos as melhores peças para você brilhar."
            </blockquote>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default About;