import { useEffect, useState } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/helpers/getAuthHeaders";
import { Coupon } from "@/types/coupon";

export const CouponManager = () => {
  const [couponList, setCouponList] = useState<Coupon[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Coupon>({
    code: "",
    discount_percentage: 0,
    is_active: true,
    min_purchase: null,
    max_uses: null,
    valid_from: null,
    valid_until: null,
  });

  const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/coupons`;

  // ==============================
  // 🔹 Carregar cupons da API
  // ==============================
  const loadCoupons = async () => {
    try {
      const res = await fetch(`${API_URL}?select=*`, {
        headers: await getAuthHeaders(),
      });

      const data = await res.json();
      setCouponList(data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao carregar cupons",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // ==============================
  // 🔹 Editar Cupom
  // ==============================
  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData(coupon);
    setIsDialogOpen(true);
  };

  // ==============================
  // 🔹 Novo Cupom
  // ==============================
  const handleAdd = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      discount_percentage: 0,
      is_active: true,
      min_purchase: null,
      max_uses: null,
      valid_from: null,
      valid_until: null,
    });
    setIsDialogOpen(true);
  };

  // ==============================
  // 🔹 Salvar Cupom
  // ==============================
  const handleSave = async () => {
    const method = editingCoupon ? "PATCH" : "POST";
    const url = editingCoupon
      ? `${API_URL}?id=eq.${editingCoupon.id}`
      : API_URL;

    try {
      await fetch(url, {
        method,
        headers: await getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      toast({
        title: editingCoupon ? "Cupom atualizado!" : "Cupom criado!",
      });

      setIsDialogOpen(false);
      loadCoupons();
    } catch (err) {
      toast({
        title: "Erro ao salvar cupom",
        variant: "destructive",
      });
    }
  };

  // ==============================
  // 🔹 Deletar Cupom
  // ==============================
  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}?id=eq.${id}`, {
        method: "DELETE",
        headers: await getAuthHeaders(),
      });

      toast({ title: "Cupom removido!" });
      loadCoupons();
    } catch (err) {
      toast({
        title: "Erro ao deletar cupom",
        variant: "destructive",
      });
    }
  };

  // ==============================
  // 🔹 Ativar/Desativar Cupom
  // ==============================
  const handleToggleStatus = async (coupon: Coupon) => {
    try {
      await fetch(`${API_URL}?id=eq.${coupon.id}`, {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ is_active: !coupon.is_active }),
      });

      toast({ title: "Status atualizado!" });
      loadCoupons();
    } catch (err) {
      toast({
        title: "Erro ao atualizar status",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Cupons de Desconto</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="rose" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Cupom
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCoupon ? "Editar Cupom" : "Novo Cupom"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">

                <div>
                  <Label>Código do Cupom</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="Ex: DESCONTO10"
                    disabled={!!editingCoupon}
                  />
                </div>

                <div>
                  <Label>Desconto (%)</Label>
                  <Input
                    type="number"
                    value={formData.discount_percentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_percentage: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked })
                    }
                  />
                  <Label>Cupom Ativo</Label>
                </div>

                <Button variant="rose" className="w-full" onClick={handleSave}>
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Desconto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {couponList.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.code}</TableCell>
                <TableCell>{c.discount_percentage}%</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={c.is_active}
                      onCheckedChange={() => handleToggleStatus(c)}
                    />
                    <span className={c.is_active ? "text-green-600" : "text-muted-foreground"}>
                      {c.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(c)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(c.id!)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
