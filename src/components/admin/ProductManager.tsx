import { useState } from "react";
import { Edit2, Trash2, Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { products } from "@/data/mockData";
import { Product } from "@/types/product";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getAuthHeaders } from "@/helpers/getAuthHeaders";


const AVAILABLE_SIZES = ["P", "M", "G", "GG"];

export const ProductManager = () => {
  const [productList, setProductList] = useState(products);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    isFeatured: false,
    isBestSeller: false,
    discount: 0,
    images: [""],
    stock: 0,
    sizes: [],
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product, discount: 0 });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      isFeatured: false,
      isBestSeller: false,
      discount: 0,
      images: [""],
      stock: 0,
      sizes: [],
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const images = (formData.images || []).filter(Boolean);

    if (images.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma imagem.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      is_featured: formData.isFeatured,
      is_best_seller: formData.isBestSeller,
      stock: formData.stock,
      sizes: formData.sizes,
      discount: formData.discount,
      images: images,
    };

    try {
      const method = editingProduct ? "PATCH" : "POST";
      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/products${editingProduct ? `?id=eq.${editingProduct.id}` : ""}`;

      const headers = await getAuthHeaders();

      const res = await fetch(url, {
        method,
        headers: {
          ...headers,
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Erro ao salvar no Supabase");
      }

      toast({
        title: editingProduct ? "Produto atualizado!" : "Produto criado!",
        description: "Tudo certo!",
      });

      setIsDialogOpen(false);

    } catch (err) {
      toast({
        title: "Erro ao salvar",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  };


  const handleDelete = (id: string) => {
    setProductList(productList.filter(p => p.id !== id));
    toast({
      title: "Produto removido!",
      description: "O produto foi excluído com sucesso.",
    });
  };

  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price - (price * discount / 100);
  };

  // TODO: Integrar com Cloudinary para upload de imagens
  // Quando integrado, fazer upload para Cloudinary e salvar a URL retornada
  const handleImageUpload = async (index: number, file: File) => {
    try {
      toast({
        title: "Enviando imagem...",
        description: "Aguarde enquanto a imagem é enviada.",
      });

      const imageUrl = await uploadToCloudinary(file);

      const newImages = [...(formData.images || [""])];
      newImages[index] = imageUrl;


      setFormData({ ...formData, images: newImages });

      toast({
        title: "Imagem enviada!",
        description: "A imagem foi salva no Cloudinary.",
      });

    } catch (err) {
      toast({
        title: "Erro ao enviar imagem",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const addImageField = () => {
    if ((formData.images?.length || 0) < 4) {
      setFormData({ ...formData, images: [...(formData.images || []), ""] });
    }
  };

  const removeImageField = (index: number) => {
    const newImages = (formData.images || []).filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [""] });
  };

  const handleSizeToggle = (size: string) => {
    const currentSizes = formData.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    setFormData({ ...formData, sizes: newSizes });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Produtos</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="rose" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Editar Produto" : "Novo Produto"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label className="text-sm">Nome</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm">Descrição</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="text-sm min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-sm">Preço (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Desconto (%)</Label>
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      value={formData.discount || 0}
                      onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                      className="text-sm"
                    />
                  </div>
                </div>
                {formData.discount && formData.discount > 0 && (
                  <div className="p-3 bg-muted/50 rounded-md">
                    <p className="text-sm">
                      Preço original: <span className="line-through">R$ {formData.price?.toFixed(2)}</span>
                    </p>
                    <p className="text-sm font-semibold text-primary-rose">
                      Preço com desconto: R$ {calculateDiscountedPrice(formData.price || 0, formData.discount).toFixed(2)}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-sm">Categoria</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm">Quantidade em Estoque</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.stock || 0}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Se 0, o produto aparecerá como "Esgotado"
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm">Imagens do Produto (1-4)</Label>
                    {(formData.images?.length || 0) < 4 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={addImageField}
                        className="text-xs h-8"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden sm:inline">Adicionar</span>
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {(formData.images || [""]).map((img, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={`image-${index}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-2 p-3 border-2 border-dashed border-border rounded-md hover:border-primary transition-colors bg-muted/30">
                              <Upload className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs sm:text-sm text-muted-foreground">
                                {img ? `Imagem ${index + 1} carregada` : `Escolher imagem ${index + 1}`}
                              </span>
                            </div>
                          </Label>
                          <input
                            id={`image-${index}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(index, file);
                            }}
                          />
                          {(formData.images?.length || 0) > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeImageField(index)}
                              className="flex-shrink-0"
                            >
                              <X className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        {img && (
                          <div className="relative w-full h-24 sm:h-32 rounded-md overflow-hidden border border-border">
                            <img
                              src={img}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    * Mínimo 1 imagem, máximo 4 imagens. Upload temporário (implementar Cloudinary)
                  </p>
                </div>
                <div>
                  <Label className="text-sm mb-3 block">Tamanhos Disponíveis</Label>
                  <div className="flex flex-wrap gap-3">
                    {AVAILABLE_SIZES.map((size) => (
                      <div key={size} className="flex items-center gap-2">
                        <Checkbox
                          id={`size-${size}`}
                          checked={(formData.sizes || []).includes(size)}
                          onCheckedChange={() => handleSizeToggle(size)}
                        />
                        <Label htmlFor={`size-${size}`} className="text-sm cursor-pointer">
                          {size}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    * Selecione os tamanhos que estarão disponíveis para este produto
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isFeatured: checked as boolean })
                      }
                    />
                    <Label className="text-sm">Destaque</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.isBestSeller}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isBestSeller: checked as boolean })
                      }
                    />
                    <Label className="text-sm">Mais Vendido</Label>
                  </div>
                </div>
                <Button variant="rose" onClick={handleSave} className="w-full text-sm h-10 sm:h-11">
                  Salvar Produto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-3">
          {productList.map((product) => (
            <div key={product.id} className="p-3 bg-muted/50 rounded-md space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(product)} className="h-8 w-8 p-0">
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(product.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-primary-rose">R$ {product.price.toFixed(2)}</span>
                <div className="flex gap-2">
                  {product.isFeatured && <span className="px-2 py-0.5 bg-primary/10 rounded">Destaque</span>}
                  {product.isBestSeller && <span className="px-2 py-0.5 bg-primary/10 rounded">Popular</span>}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Estoque:</span>
                <span className={`font-semibold ${(product.stock || 0) === 0 ? 'text-destructive' : 'text-foreground'}`}>
                  {product.stock || 0} unidades
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Destaque</TableHead>
                <TableHead>Popular</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productList.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${(product.stock || 0) === 0 ? 'text-destructive' : ''}`}>
                      {product.stock || 0}
                    </span>
                  </TableCell>
                  <TableCell>{product.isFeatured ? "Sim" : "Não"}</TableCell>
                  <TableCell>{product.isBestSeller ? "Sim" : "Não"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(product)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
