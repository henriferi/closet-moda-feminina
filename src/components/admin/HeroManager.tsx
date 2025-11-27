import { useState } from "react";
import { Edit2, Trash2, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { heroSlides } from "@/data/mockData";
import { HeroSlide } from "@/types/product";

export const HeroManager = () => {
  const [slides, setSlides] = useState(heroSlides);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<HeroSlide>>({
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    image: "",
  });

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData(slide);
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
    });
    setIsDialogOpen(true);
  };

  // TODO: Integrar com Cloudinary para upload de imagens
  // Quando integrado, fazer upload para Cloudinary e salvar a URL retornada
  const handleImageUpload = async (file: File) => {
    // Temporário: converter para base64 (substituir por upload para Cloudinary)
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, image: base64String });
      
      toast({
        title: "Imagem carregada!",
        description: "A imagem foi adicionada. (Temporário: base64 - implementar Cloudinary)",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (editingSlide) {
      setSlides(slides.map(s => s.id === editingSlide.id ? { ...s, ...formData } : s));
      toast({
        title: "Slide atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      const newSlide: HeroSlide = {
        id: String(Date.now()),
        image: formData.image || "/placeholder.svg",
        ...(formData as Omit<HeroSlide, "id" | "image">),
      };
      setSlides([...slides, newSlide]);
      toast({
        title: "Slide adicionado!",
        description: "O novo slide foi criado com sucesso.",
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setSlides(slides.filter(s => s.id !== id));
    toast({
      title: "Slide removido!",
      description: "O slide foi excluído com sucesso.",
    });
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
                  <Label
                    htmlFor="hero-image"
                    className="cursor-pointer block mt-2"
                  >
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
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload temporário (implementar Cloudinary)
                  </p>
                </div>
                <div>
                  <Label className="text-sm">Título</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm">Subtítulo</Label>
                  <Input
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm">Texto do Botão</Label>
                  <Input
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm">Link do Botão</Label>
                  <Input
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    className="text-sm"
                  />
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
            <div
              key={slide.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-4 bg-muted/50 rounded-md"
            >
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <h4 className="font-semibold text-sm sm:text-base truncate">{slide.title}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{slide.subtitle}</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Button size="sm" variant="ghost" onClick={() => handleEdit(slide)} className="h-8 sm:h-9">
                  <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(slide.id)}
                  className="h-8 sm:h-9"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
