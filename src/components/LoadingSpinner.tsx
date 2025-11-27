import { Diamond } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Diamond className="w-12 h-12 text-primary-rose animate-pulse mx-auto mb-4" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
};