import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { HeaderManager } from "@/components/admin/HeaderManager";
import { HeroManager } from "@/components/admin/HeroManager";
import { ProductManager } from "@/components/admin/ProductManager";
import { CouponManager } from "@/components/admin/CouponManager";
import { useAdmin } from "@/contexts/AdminContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout title="Painel Administrativo">
      <Tabs defaultValue="header" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="hero">Hero Slides</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="coupons">Cupons</TabsTrigger>
        </TabsList>

        <TabsContent value="header" className="space-y-6">
          <HeaderManager />
        </TabsContent>

        <TabsContent value="hero" className="space-y-6">
          <HeroManager />
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <ProductManager />
        </TabsContent>

        <TabsContent value="coupons" className="space-y-6">
          <CouponManager />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
