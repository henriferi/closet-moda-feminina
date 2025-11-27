import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-subtle">
      <div className="text-center max-w-md mx-auto px-4">
        <Diamond className="w-16 h-16 text-primary-rose mx-auto mb-6 animate-pulse" />
        <h1 className="mb-4 text-6xl font-serif font-bold text-foreground">404</h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Ops! Esta página não existe em nossa boutique
        </p>
        <Link to="/">
          <Button variant="elegant" size="lg">
            Voltar para o Início
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
