import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Briefcase,
  FileText,
  LogOut,
  Star,
} from "lucide-react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; // 👈 para editar o preço

interface Profile {
  id: string;
  user_id: string;
  user_type: string; // "provider" | "client"
  full_name: string | null;
  cpf: string;
  cnpj: string | null;
  services: string[] | null;
  location: string | null;
  bio: string | null;
}

interface Avaliacao {
  id: string;
  rating: number;
  comentario: string | null;
  created_at: string;
  cliente_nome: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [bio, setBio] = useState("");
  const [price, setPrice] = useState(""); // 👈 novo estado para o valor
  const [savingBio, setSavingBio] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

  // id do registro em service_providers
  const [providerId, setProviderId] = useState<string | null>(null);

  useEffect(() => {
    // Listener de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

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

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;

      setProfile(data);

      // bio padrão vem de profiles.bio
      let bioToUse = data.bio || "";
      let priceToUse = "";

      if (data.user_type === "provider") {
        // busca o registro do prestador em service_providers
        const { data: providerData, error: providerError } = await supabase
          .from("service_providers")
          .select("id, description, price")
          .eq("profile_id", data.id)
          .single();

        if (!providerError && providerData) {
          setProviderId(providerData.id);

          if (providerData.description) {
            bioToUse = providerData.description;
          }
          if (providerData.price) {
            priceToUse = providerData.price;
          }
        }

        await loadAvaliacoes(data.id);
      }

      setBio(bioToUse);
      setPrice(priceToUse);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar perfil",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBio = async () => {
    if (!profile) return;

    try {
      setSavingBio(true);

      // 1) Atualiza profiles.bio
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ bio })
        .eq("id", profile.id);

      if (profileError) throw profileError;

      // 2) Se for prestador, também atualiza service_providers.description e price
      if (profile.user_type === "provider" && providerId) {
        const { error: providerError } = await supabase
          .from("service_providers")
          .update({
            description: bio,
            price: price || "A combinar",
          })
          .eq("id", providerId);

        if (providerError) throw providerError;
      }

      toast({
        title: "Informações salvas",
        description: "Seu texto e valor foram atualizados com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSavingBio(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum perfil encontrado.</p>
      </div>
    );
  }

  const isProvider = profile.user_type === "provider";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Meu Perfil</h1>

        <Card className="p-6 space-y-6">
          {/* Cabeçalho */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {profile.full_name || "Sem nome"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isProvider ? "Prestador de Serviços" : "Cliente"}
              </p>
            </div>
          </div>

          {/* Dados básicos */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-foreground">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">CPF</p>
                <p>{profile.cpf}</p>
              </div>
            </div>

            {isProvider && (
              <>
                {profile.cnpj && (
                  <div className="flex items-center gap-3 text-foreground">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">CNPJ</p>
                      <p>{profile.cnpj}</p>
                    </div>
                  </div>
                )}

                {profile.location && (
                  <div className="flex items-center gap-3 text-foreground">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Localização
                      </p>
                      <p>{profile.location}</p>
                    </div>
                  </div>
                )}

                {profile.services && profile.services.length > 0 && (
                  <div className="flex items-start gap-3 text-foreground">
                    <Briefcase className="h-5 w-5 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">
                        Serviços
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {profile.services.map((service, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Área específica do prestador */}
          {isProvider && (
            <div className="space-y-6 mt-6">
              {/* Sobre meu serviço + preço */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Sobre meu serviço
                </p>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Descreva aqui seu trabalho, experiência, formas de atendimento..."
                  rows={4}
                />

                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Valor médio do serviço
                  </p>
                  <Input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ex: R$ 150,00"
                  />
                  <p className="text-xs text-muted-foreground">
                    Esse valor aparecerá nos cards do seu serviço.
                  </p>
                </div>

                <Button onClick={handleSaveBio} disabled={savingBio}>
                  {savingBio ? "Salvando..." : "Salvar informações"}
                </Button>
              </div>

              {/* Avaliações recebidas */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Avaliações recebidas
                </p>

                {avaliacoes.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Você ainda não recebeu nenhuma avaliação.
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
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;
