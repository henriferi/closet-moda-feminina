import { useState } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { coupons } from "@/data/coupons";
import { Coupon } from "@/types/coupon";

export const CouponManager = () => {
  const [couponList, setCouponList] = useState(coupons);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Coupon>({
    codigo: "",
    desconto: 0,
    ativo: true,
  });

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData(coupon);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCoupon(null);
    setFormData({
      codigo: "",
      desconto: 0,
      ativo: true,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingCoupon) {
      setCouponList(couponList.map(c => 
        c.codigo === editingCoupon.codigo ? formData : c
      ));
      toast({
        title: "Cupom atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      setCouponList([...couponList, formData]);
      toast({
        title: "Cupom adicionado!",
        description: "O novo cupom foi criado com sucesso.",
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (codigo: string) => {
    setCouponList(couponList.filter(c => c.codigo !== codigo));
    toast({
      title: "Cupom removido!",
      description: "O cupom foi excluído com sucesso.",
    });
  };

  const handleToggleStatus = (codigo: string) => {
    setCouponList(couponList.map(c => 
      c.codigo === codigo ? { ...c, ativo: !c.ativo } : c
    ));
    toast({
      title: "Status atualizado!",
      description: "O status do cupom foi alterado.",
    });
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
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    placeholder="Ex: LIQUIDACLOSET"
                    disabled={!!editingCoupon}
                  />
                </div>
                <div>
                  <Label>Desconto (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.desconto}
                    onChange={(e) => setFormData({ ...formData, desconto: parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                  />
                  <Label>Cupom Ativo</Label>
                </div>
                <Button variant="rose" onClick={handleSave} className="w-full">
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
            {couponList.map((coupon) => (
              <TableRow key={coupon.codigo}>
                <TableCell className="font-medium">{coupon.codigo}</TableCell>
                <TableCell>{coupon.desconto}%</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={coupon.ativo}
                      onCheckedChange={() => handleToggleStatus(coupon.codigo)}
                    />
                    <span className={coupon.ativo ? "text-green-600" : "text-muted-foreground"}>
                      {coupon.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(coupon)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(coupon.codigo)}
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
