import { FormEvent, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ProviderReviewPage = () => {
  const navigate = useNavigate();
  const { providerId } = useParams<{ providerId: string }>();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const clientId = searchParams.get("clientId"); // cliente logado
  const serviceId = searchParams.get("serviceId"); // opcional
  
  const [rating, setRating] = useState<number | "">("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!providerId) {
    return <div>Prestador não encontrado.</div>;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!rating) {
      toast({
        title: "Erro",
        description: "Selecione uma nota.",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Erro",
        description: "Escreva um comentário.",
        variant: "destructive",
      });
      return;
    }

    if (!clientId) {
      toast({
        title: "Erro",
        description: "Não foi possível identificar o cliente.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const payload = {
      prestador_profile_id: providerId,
      cliente_profile_id: clientId,
      rating: Number(rating),
      comment: comment.trim(),
      service_id: serviceId ?? null,
    };

    console.log("Enviando payload:", payload);

    const { error } = await supabase.from("avaliacoes").insert(payload);

    if (error) {
      console.error("Erro ao inserir avaliação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua avaliação.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Obrigado!",
      description: "Sua avaliação foi registrada com sucesso.",
    });

    setLoading(false);
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg p-6 space-y-4">
        <h1 className="text-xl font-bold">Avaliar Prestador</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nota (1 a 5)</Label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border rounded-md px-2 py-2"
            >
              <option value="">Selecione...</option>
              <option value={1}>1 - Muito Ruim</option>
              <option value={2}>2 - Ruim</option>
              <option value={3}>3 - Regular</option>
              <option value={4}>4 - Bom</option>
              <option value={5}>5 - Excelente</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Comentário</Label>
            <Textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Como foi o serviço?"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProviderReviewPage;
