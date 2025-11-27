import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Diamond, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Admin Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Diamond className="w-6 h-6 text-primary-rose" />
              <span className="text-xl font-serif font-bold text-foreground">
                Closet <span className="text-primary-rose">Admin</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
              >
                <Home className="w-4 h-4 mr-2" />
                Ir para o Site
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">
          {title}
        </h1>
        {children}
      </main>
    </div>
  );
};
