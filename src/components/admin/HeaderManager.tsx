import { useState } from "react";
import { Edit2, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { loopingTexts } from "@/data/mockData";

export const HeaderManager = () => {
  const [texts, setTexts] = useState(loopingTexts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newText, setNewText] = useState("");
  const { toast } = useToast();

  const handleEdit = (id: string, currentText: string) => {
    setEditingId(id);
    setEditValue(currentText);
  };

  const handleSave = (id: string) => {
    setTexts(texts.map(t => t.id === id ? { ...t, text: editValue } : t));
    setEditingId(null);
    toast({
      title: "Texto atualizado!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleAdd = () => {
    if (!newText.trim()) return;
    
    const newItem = {
      id: String(Date.now()),
      text: newText,
    };
    
    setTexts([...texts, newItem]);
    setNewText("");
    toast({
      title: "Texto adicionado!",
      description: "O novo texto foi adicionado ao banner.",
    });
  };

  const handleDelete = (id: string) => {
    setTexts(texts.filter(t => t.id !== id));
    toast({
      title: "Texto removido!",
      description: "O texto foi removido do banner.",
    });
  };

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
                    onClick={() => handleEdit(item.id, item.text)}
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
