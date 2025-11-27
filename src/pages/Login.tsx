import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Diamond, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../lib/supabaseClient";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // login falhou
        toast({
          title: "Erro ao fazer login",
          description: "E-mail ou senha incorretos",
          variant: "destructive",
        });
        return;
      }

      // login deu certo → redirecionar
      toast({
        title: "Login realizado",
        description: "Redirecionando...",
      });

      window.location.href = "/admin/dashboard";

    } catch (error) {

      toast({
        title: "Erro inesperado",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });

    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4">
      <div className="w-full max-w-md">
        <div className="bg-background rounded-lg shadow-elegant p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Diamond className="w-8 h-8 text-primary-rose" />
              <span className="text-2xl font-serif font-bold text-foreground">
                Closet <span className="text-primary-rose">Admin</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Painel Administrativo
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@closet.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="rose"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Development Credentials */}
          <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Desenvolvimento:</strong> admin@closet.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
