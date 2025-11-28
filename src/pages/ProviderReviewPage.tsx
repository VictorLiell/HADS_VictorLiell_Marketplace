import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

interface ServiceProviderDetails {
  id: string;
  name: string;
  service: string;
  profile_id: string;
  rating: number;
  reviews: number;
}

interface Avaliacao {
  id: string;
  rating: number;
  comentario: string | null;
  created_at: string;
  cliente_nome: string | null;
}

export const ProviderReviewPage = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  const [provider, setProvider] = useState<ServiceProviderDetails | null>(null);
  const [prestadorProfileId, setPrestadorProfileId] = useState<string | null>(
    null
  );

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [ratingInput, setRatingInput] = useState<number>(5);
  const [comentarioInput, setComentarioInput] = useState("");

  // ---------------------------
  // Sessão do usuário
  // ---------------------------
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });
  }, []);

  // ---------------------------
  // Carrega dados do prestador + avaliações
  // ---------------------------
  useEffect(() => {
    const loadData = async () => {
      if (!providerId) return;
      setLoading(true);

      try {
        // 1) Buscar prestador na service_providers
        const { data: providerData, error: providerError } = await supabase
          .from("service_providers")
          .select("id, name, service, profile_id, rating, reviews")
          .eq("id", providerId)
          .single();

        if (providerError) throw providerError;
        if (!providerData) throw new Error("Prestador não encontrado.");

        setProvider(providerData as ServiceProviderDetails);
        setPrestadorProfileId(providerData.profile_id);

        // 2) Buscar avaliações desse prestador (pelo profile_id)
        await loadAvaliacoes(providerData.profile_id);
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Erro ao carregar dados",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId]);

  const loadAvaliacoes = async (prestadorProfileId: string) => {
    const { data, error } = await supabase
      .from("avaliacoes")
      .select(
        `
        id,
        rating,
        comentario,
        created_at,
        cliente:profiles!avaliacoes_cliente_profile_id_fkey (full_name)
      `
      )
      .eq("prestador_profile_id", prestadorProfileId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const mapped: Avaliacao[] =
      (data || []).map((row: any) => ({
        id: row.id,
        rating: row.rating,
        comentario: row.comentario,
        created_at: row.created_at,
        cliente_nome: row.cliente?.full_name ?? null,
      })) ?? [];

    setAvaliacoes(mapped);
  };

  // ---------------------------
  // Enviar avaliação
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !user) {
      toast({
        title: "Faça login para avaliar",
        description: "Você precisa estar logado como cliente.",
        variant: "destructive",
      });
      return;
    }
    if (!prestadorProfileId || !provider) return;

    if (ratingInput < 1 || ratingInput > 5) {
      toast({
        title: "Nota inválida",
        description: "A nota deve ser entre 1 e 5.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      // 1) Buscar profile do cliente logado
      const { data: clienteProfile, error: clienteError } = await supabase
        .from("profiles")
        .select("id, full_name, user_type")
        .eq("user_id", user.id)
        .single();

      if (clienteError) throw clienteError;
      if (!clienteProfile) throw new Error("Perfil do cliente não encontrado.");

      if (clienteProfile.user_type !== "client") {
        toast({
          title: "Apenas clientes podem avaliar",
          description:
            "Use uma conta de cliente para deixar avaliações em prestadores.",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      // 2) Inserir avaliação
      const { error: insertError } = await supabase.from("avaliacoes").insert({
        prestador_profile_id: prestadorProfileId,
        cliente_profile_id: clienteProfile.id,
        rating: ratingInput,
        comentario: comentarioInput || null,
      });

      if (insertError) throw insertError;

      // 3) Recarregar avaliações
      await loadAvaliacoes(prestadorProfileId);

      // 4) Atualizar média e contagem no service_providers
      const totalRatings =
        avaliacoes.reduce((sum, a) => sum + a.rating, 0) + ratingInput;
      const totalReviews = avaliacoes.length + 1;
      const newAverage = totalRatings / totalReviews;

      await supabase
        .from("service_providers")
        .update({
          rating: newAverage,
          reviews: totalReviews,
        })
        .eq("id", provider.id);

      // 5) Atualiza estado local do provider para já refletir no topo
      setProvider((prev) =>
        prev
          ? {
              ...prev,
              rating: newAverage,
              reviews: totalReviews,
            }
          : prev
      );

      setRatingInput(5);
      setComentarioInput("");

      toast({
        title: "Avaliação enviada!",
        description: "Obrigado por avaliar este prestador.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro ao enviar avaliação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-lg font-semibold">
            Avaliar {provider.name}
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Card com resumo do prestador */}
        <Card>
          <CardHeader>
            <CardTitle>{provider.name}</CardTitle>
            <CardDescription>{provider.service}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">
              {provider.reviews > 0
                ? `${provider.rating.toFixed(1)} / 5`
                : "Sem avaliações ainda"}
            </span>
            {provider.reviews > 0 && (
              <span>• {provider.reviews} avaliações</span>
            )}
          </CardContent>
        </Card>

        {/* Form de nova avaliação */}
        <Card>
          <CardHeader>
            <CardTitle>Deixar uma avaliação</CardTitle>
            <CardDescription>
              Sua opinião ajuda outros clientes e o prestador.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nota (1 a 5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={ratingInput}
                  onChange={(e) =>
                    setRatingInput(Number(e.target.value) || 0)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Comentário (opcional)</Label>
                <Textarea
                  rows={4}
                  value={comentarioInput}
                  onChange={(e) => setComentarioInput(e.target.value)}
                  placeholder="Conte como foi a experiência com este prestador..."
                />
              </div>

              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "Enviando..." : "Enviar avaliação"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de avaliações existentes */}
        <Card>
          <CardHeader>
            <CardTitle>Avaliações de clientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {avaliacoes.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Este prestador ainda não recebeu avaliações.
              </p>
            )}

            {avaliacoes.map((av) => (
              <div
                key={av.id}
                className="border border-border rounded-lg p-3 space-y-1"
              >
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">
                    {av.rating.toFixed(1)} / 5
                  </span>
                </div>
                {av.cliente_nome && (
                  <p className="text-sm">
                    <span className="font-medium">Cliente:</span>{" "}
                    {av.cliente_nome}
                  </p>
                )}
                {av.comentario && (
                  <p className="text-sm text-foreground">
                    {av.comentario}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(av.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
