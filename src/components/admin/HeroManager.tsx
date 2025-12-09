import { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getAuthHeaders } from "@/helpers/getAuthHeaders"; // seu helper existente

// Tipagem mínima do slide (ajuste se tiver fields extras)
type HeroSlide = {
  id: string;
  image: string | null;
  title: string;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  orderPosition?: number | null;
  isActive?: boolean;
  createdAt?: string;
};

export const HeroManager = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<HeroSlide>>({
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    image: "",
    orderPosition: undefined,
    isActive: true,
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const headers = await getAuthHeaders();

      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hero_slides?select=*`;
      const res = await fetch(url, { method: "GET", headers });

      if (!res.ok) throw new Error("Erro ao buscar hero slides");

      const data = await res.json();

      // mapear snake_case -> camelCase (se necessário)
      const mapped: HeroSlide[] = data.map((row: any) => ({
        id: row.id,
        image: row.image ?? null,
        title: row.title,
        subtitle: row.subtitle ?? null,
        buttonText: row.button_text ?? null,
        buttonLink: row.button_link ?? null,
        orderPosition: row.order_position ?? null,
        isActive: row.is_active ?? true,
        createdAt: row.created_at ?? undefined,
      }));

      setSlides(mapped);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao carregar slides",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle ?? "",
      buttonText: slide.buttonText ?? "",
      buttonLink: slide.buttonLink ?? "",
      image: slide.image ?? "",
      orderPosition: slide.orderPosition ?? undefined,
      isActive: slide.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingSlide(null);
    setFormData({
      title: "",
      subtitle: "",
      buttonText: "",
      buttonLink: "",
      image: "",
      orderPosition: undefined,
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    try {
      toast({ title: "Enviando imagem...", description: "Aguarde." });

      const url = await uploadToCloudinary(file);

      setFormData((prev) => ({ ...prev, image: url }));

      toast({ title: "Imagem enviada!", description: "Imagem salva no Cloudinary." });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar a imagem.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" });
  };

  const handleSave = async () => {
    // validações simples
    if (!formData.title || !formData.title.trim()) {
      toast({
        title: "Validação",
        description: "O título é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.image || !String(formData.image).trim()) {
      toast({
        title: "Validação",
        description: "Adicione uma imagem ao slide.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      title: formData.title,
      subtitle: formData.subtitle ?? null,
      button_text: formData.buttonText ?? null,
      button_link: formData.buttonLink ?? null,
      image: formData.image,
      order_position: formData.orderPosition ?? null,
      is_active: formData.isActive ?? true,
    };

    try {
      const headers = await getAuthHeaders();
      const method = editingSlide ? "PATCH" : "POST";
      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hero_slides${editingSlide ? `?id=eq.${editingSlide.id}` : ""}`;

      const res = await fetch(url, {
        method,
        headers: {
          ...headers,
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Supabase error:", text);
        throw new Error("Erro ao salvar slide");
      }

      const [saved] = await res.json();

      // mapear de volta
      const savedSlide: HeroSlide = {
        id: saved.id,
        image: saved.image ?? null,
        title: saved.title,
        subtitle: saved.subtitle ?? null,
        buttonText: saved.button_text ?? null,
        buttonLink: saved.button_link ?? null,
        orderPosition: saved.order_position ?? null,
        isActive: saved.is_active ?? true,
        createdAt: saved.created_at ?? undefined,
      };

      setSlides((prev) =>
        editingSlide ? prev.map((s) => (s.id === savedSlide.id ? savedSlide : s)) : [...prev, savedSlide]
      );

      toast({
        title: editingSlide ? "Slide atualizado!" : "Slide criado!",
        description: "Operação concluída com sucesso.",
      });

      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao salvar",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const headers = await getAuthHeaders();
      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hero_slides?id=eq.${id}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        throw new Error("Erro ao excluir slide");
      }

      setSlides((prev) => prev.filter((s) => s.id !== id));

      toast({
        title: "Slide removido!",
        description: "O slide foi excluído com sucesso.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao remover",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (slide: HeroSlide) => {
    try {
      const headers = await getAuthHeaders();
      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hero_slides?id=eq.${slide.id}`;

      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          ...headers,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ is_active: !(slide.isActive ?? true) }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar ativo");

      const [updated] = await res.json();

      setSlides((prev) => prev.map((s) => (s.id === slide.id ? { ...s, isActive: updated.is_active } : s)));

      toast({ title: "Atualizado", description: "Status do slide alterado." });
    } catch (err) {
      console.error(err);
      toast({ title: "Erro", description: "Não foi possível alterar status.", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Hero Slides</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="rose" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Slide
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[85vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">
                  {editingSlide ? "Editar Slide" : "Novo Slide"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label className="text-sm">Imagem do Hero</Label>
                  <div className="mt-2">
                    <Label htmlFor="hero-image" className="cursor-pointer">
                      <div className="flex items-center gap-2 p-3 border-2 border-dashed border-border rounded-md hover:border-primary transition-colors bg-muted/30">
                        <Upload className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {formData.image ? "Imagem carregada" : "Escolher imagem do hero"}
                        </span>
                      </div>
                    </Label>
                    <input
                      id="hero-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                    {formData.image && (
                      <div className="relative w-full h-32 sm:h-40 rounded-md overflow-hidden border border-border mt-3">
                        <img src={String(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2">
                          <Button size="icon" variant="ghost" onClick={handleRemoveImage}>
                            <X className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">Upload via Cloudinary</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm">Título</Label>
                  <Input value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="text-sm" />
                </div>

                <div>
                  <Label className="text-sm">Subtítulo</Label>
                  <Input value={formData.subtitle || ""} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="text-sm" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Texto do Botão</Label>
                    <Input value={formData.buttonText || ""} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })} className="text-sm" />
                  </div>
                  <div>
                    <Label className="text-sm">Link do Botão</Label>
                    <Input value={formData.buttonLink || ""} onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })} className="text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Posição (order_position)</Label>
                    <Input
                      type="number"
                      value={formData.orderPosition ?? ""}
                      onChange={(e) => setFormData({ ...formData, orderPosition: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="is-active-checkbox"
                      type="checkbox"
                      checked={formData.isActive ?? true}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="is-active-checkbox" className="text-sm cursor-pointer">Ativo</Label>
                  </div>
                </div>

                <Button variant="rose" onClick={handleSave} className="w-full text-sm h-10 sm:h-11">
                  Salvar Slide
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {slides.map((slide) => (
            <div key={slide.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-4 bg-muted/50 rounded-md">
              <div className="w-full sm:w-72">
                <div className="relative w-full h-28 rounded-md overflow-hidden border border-border">
                  {slide.image ? (
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-xs text-muted-foreground">Sem imagem</div>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm sm:text-base truncate">{slide.title}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{slide.subtitle}</p>
                <p className="text-xs text-muted-foreground mt-1">Posição: {slide.orderPosition ?? "-"}</p>
                <p className="text-xs mt-1">{slide.isActive ? "Ativo" : "Inativo"}</p>
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Button size="sm" variant="ghost" onClick={() => handleEdit(slide)} className="h-8 sm:h-9">
                  <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>

                <Button size="sm" variant="ghost" onClick={() => toggleActive(slide)} className="h-8 sm:h-9">
                  {slide.isActive ? "Desativar" : "Ativar"}
                </Button>

                <Button size="sm" variant="ghost" onClick={() => handleDelete(slide.id)} className="h-8 sm:h-9">
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          {slides.length === 0 && <p className="text-xs text-muted-foreground">Nenhum slide cadastrado.</p>}
        </div>
      </CardContent>
    </Card>
  );
};
