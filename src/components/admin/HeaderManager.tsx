import { useEffect, useState } from "react";
import { Edit2, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getApiKey, getAuthHeaders } from "@/helpers/getAuthHeaders";

export const HeaderManager = () => {
  const [texts, setTexts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newText, setNewText] = useState("");
  const { toast } = useToast();

  const BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/header_promos`;

  // ============================
  // 1. LOAD DATA (SELECT *)
  // ============================
  const loadData = async () => {
    try {
      const headers = await getApiKey();

      const res = await fetch(`${BASE_URL}?select=*`, {
        headers,
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setTexts(data);
    } catch {
      toast({
        title: "Erro ao carregar textos",
        description: "Não foi possível carregar os textos do header.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ============================
  // 2. ADD NEW TEXT (POST)
  // ============================
  const handleAdd = async () => {
    if (!newText.trim()) return;

    try {
      const headers = await getAuthHeaders();

      const payload = {
        text: newText,
        is_active: true,
      };

      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          ...headers,
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      const created = data[0];

      setTexts([...texts, created]);
      setNewText("");

      toast({
        title: "Texto adicionado!",
        description: "O novo texto foi salvo.",
      });
    } catch {
      toast({
        title: "Erro ao adicionar",
        variant: "destructive",
      });
    }
  };

  // ============================
  // 3. EDIT TEXT (PATCH)
  // ============================
  const handleSave = async (id: string) => {
    try {
      const headers = await getAuthHeaders();

      const res = await fetch(`${BASE_URL}?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          ...headers,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ text: editValue }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      const updated = data[0];

      setTexts(texts.map((item) => (item.id === id ? updated : item)));

      toast({
        title: "Texto atualizado!",
        description: "As alterações foram salvas.",
      });
    } catch {
      toast({
        title: "Erro ao atualizar",
        variant: "destructive",
      });
    }

    setEditingId(null);
  };

  // ============================
  // 4. DELETE (DELETE)
  // ============================
  const handleDelete = async (id: string) => {
    try {
      const headers = await getAuthHeaders();

      const res = await fetch(`${BASE_URL}?id=eq.${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error();

      setTexts(texts.filter((t) => t.id !== id));

      toast({
        title: "Texto removido!",
        description: "O item foi excluído.",
      });
    } catch {
      toast({
        title: "Erro ao excluir",
        variant: "destructive",
      });
    }
  };

  // ============================
  // UI (sem mudanças)
  // ============================
  return (
    <Card>
      <CardHeader>
        <CardTitle>Header Promocional</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Add New Text */}
        <div className="flex gap-2">
          <Input
            placeholder="Adicionar novo texto promocional..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <Button onClick={handleAdd} variant="rose">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Text List */}
        <div className="space-y-2">
          {texts.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-3 bg-muted/50 rounded-md"
            >
              {editingId === item.id ? (
                <>
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="rose"
                    onClick={() => handleSave(item.id)}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm">{item.text}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingId(item.id);
                      setEditValue(item.text);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
