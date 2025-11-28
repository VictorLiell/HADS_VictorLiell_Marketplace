import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Store,
  Users,
  MapPin,
  Shield,
  User,
  Search,
  Clock,
} from "lucide-react";

import { User as SupabaseUser, Session } from "@supabase/supabase-js";
// ❌ REMOVIDO: import { SearchSection } from "@/components/SearchSection";
import { ServiceCard } from "@/components/ServiceCard";

import heroImage from "@/assets/hero-marketplace.jpg";

// Tipo do prestador (deixa igual ao que o ServiceCard espera)
interface ServiceProvider {
  id: string;
  name: string;
  service: string;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  phone: string;
  image: string;
  description: string;
  price: string;
  available: boolean;
  is_featured?: boolean; // opcional
}

const Index = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [errorProviders, setErrorProviders] = useState<string | null>(null);

  // 👇👇 ADICIONADO: estado da cidade
  const [selectedCity, setSelectedCity] = useState("todas");

  useEffect(() => {
    // Listener de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    // Sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoadingProviders(true);
      setErrorProviders(null);

      // Busca na tabela service_providers
      const { data, error } = await supabase
        .from("service_providers")
        .select(
          `
          id,
          name,
          service,
          category,
          rating,
          reviews,
          location,
          phone,
          image,
          description,
          price,
          available,
          is_featured
        `
        )
        .eq("is_featured", true);

      if (error) {
        console.error("Erro ao buscar prestadores:", error);
        setErrorProviders("Não foi possível carregar os prestadores.");
        setLoadingProviders(false);
        return;
      }

      const typedData = (data || []) as ServiceProvider[];
      setProviders(typedData);
      setFilteredProviders(typedData);

      // 👇👇 ADICIONADO: aplica filtro inicial pela cidade
      if (selectedCity !== "todas") {
        setFilteredProviders(
          typedData.filter((p) =>
            p.location?.toLowerCase().includes("passo fundo")
          )
        );
      }

      setLoadingProviders(false);
    };

    fetchProviders();
  }, []);

  // 👇👇 ADICIONADO: filtra automaticamente ao trocar a cidade
  useEffect(() => {
    if (selectedCity === "todas") {
      setFilteredProviders(providers);
    } else {
      setFilteredProviders(
        providers.filter((p) =>
          p.location?.toLowerCase().includes("passo fundo")
        )
      );
    }
  }, [selectedCity, providers]);

  const handleSearch = (query: string, category: string, location: string) => {
    let filtered = [...providers];

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter((provider) => {
        const desc = provider.description
          ? provider.description.toLowerCase()
          : "";
        return (
          provider.name.toLowerCase().includes(q) ||
          provider.service.toLowerCase().includes(q) ||
          desc.includes(q)
        );
      });
    }

    if (category && category.toLowerCase() !== "todos os serviços") {
      const c = category.toLowerCase();
      filtered = filtered.filter(
        (provider) => provider.category.toLowerCase() === c
      );
    }

    if (location) {
      const l = location.toLowerCase();
      filtered = filtered.filter((provider) =>
        provider.location.toLowerCase().includes(l)
      );
    }

    setFilteredProviders(filtered);
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-background to-primary/10">
      <div className="min-h-screen bg-background flex flex-col">
        {/* Hero */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-90" />
          <img
            src={heroImage}
            alt="Marketplace Local Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Conecte-se com
              <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Prestadores Locais
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-4 text-white/90 max-w-2xl mx-auto">
              Encontre os melhores profissionais da sua cidade. Rápido,
              confiável e na sua vizinhança.
            </p>

            <p className="text-lg text-white max-w-2xl mx-auto mb-8">
              Conectando você aos melhores profissionais da sua região.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button
                size="lg"
                variant="hero"
                className="text-lg px-8 py-4"
                onClick={() => navigate("/services")}
              >
                <Search className="h-5 w-5 mr-2" />
                Encontrar Serviços
              </Button>
              <Button
                size="lg"
                variant="marketplace"
                className="text-lg px-8 py-4"
                onClick={() => navigate("/register")}
              >
                <Users className="h-5 w-5 mr-2" />
                Seja um Prestador
              </Button>
            </div>

            {user && (
              <Button
                variant="outline"
                className="gap-2 bg-white/10 hover:bg-white/20"
                onClick={() => navigate("/profile")}
              >
                <User className="h-4 w-4" />
                Meu Perfil
              </Button>
            )}
          </div>
        </section>

        {/* Conteúdo principal */}
        <main className="flex-1">
          {/* Auth + Cards principais */}
          <section className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Card de autenticação */}
              {!user ? (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Acesse a Plataforma
                    </CardTitle>
                    <CardDescription>
                      Entre ou crie uma conta para continuar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => navigate("/auth")}
                    >
                      Entrar
                    </Button>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-3">
                        Ainda não tem uma conta?
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate("/register")}
                      >
                        Criar Conta
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Bem-vindo!</CardTitle>
                    <CardDescription>
                      Você está logado como {user.email}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => navigate("/profile")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Ver Meu Perfil
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Cards de benefícios rápidos */}
              <div className="space-y-4">
                <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Store className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Para Prestadores
                      </CardTitle>
                      <CardDescription>
                        Ofereça seus serviços localmente
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-secondary/20 hover:border-secondary/40 transition-colors">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Users className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Para Clientes</CardTitle>
                      <CardDescription>
                        Encontre profissionais qualificados
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Atendimento Local
                      </CardTitle>
                      <CardDescription>
                        Profissionais da sua região
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-secondary/20 hover:border-secondary/40 transition-colors">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Shield className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Seguro e Confiável
                      </CardTitle>
                      <CardDescription>
                        Avaliações e verificações
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </section>

          {/* Por que escolher */}
          <section className="py-20 px-4 bg-muted/30">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Por que escolher nosso marketplace?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Uma plataforma pensada para conectar a comunidade local
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 rounded-lg bg-card shadow-card">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Busca Inteligente
                  </h3>
                  <p className="text-muted-foreground">
                    Encontre exatamente o que precisa com nossos filtros
                    avançados por categoria e localização.
                  </p>
                </div>

                <div className="text-center p-6 rounded-lg bg-card shadow-card">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Prestadores Verificados
                  </h3>
                  <p className="text-muted-foreground">
                    Todos os profissionais passam por verificação e são
                    avaliados pela comunidade.
                  </p>
                </div>

                <div className="text-center p-6 rounded-lg bg-card shadow-card">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Atendimento Rápido
                  </h3>
                  <p className="text-muted-foreground">
                    Conecte-se diretamente com prestadores locais e tenha
                    respostas em minutos.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ❌ Seção de busca removida (SearchSection) */}

          {/* Grid de serviços */}
          <section className="py-16 px-4 bg-muted/20">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {searchQuery
                      ? `Resultados para "${searchQuery}"`
                      : "Prestadores em Destaque"}
                  </h2>
                  <p className="text-muted-foreground">
                    {loadingProviders
                      ? "Carregando prestadores..."
                      : `${filteredProviders.length} ${
                          filteredProviders.length === 1
                            ? "prestador encontrado"
                            : "prestadores encontrados"
                        }`}
                  </p>

                  {/* 👇👇 ADICIONADO: SELECT DE CIDADE */}
                  <div className="mt-4">
                    <label className="text-sm text-muted-foreground mr-2">
                      Filtrar cidade:
                    </label>

                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="px-3 py-2 bg-card border rounded-md"
                    >
                      <option value="todas">Todas</option>
                      <option value="passo fundo">Passo Fundo</option>
                    </select>
                  </div>
                </div>
              </div>

              {errorProviders && (
                <div className="text-red-500 mb-6">{errorProviders}</div>
              )}

              {!loadingProviders && filteredProviders.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProviders.map((provider) => (
                    <ServiceCard key={provider.id} provider={provider} />
                  ))}
                </div>
              )}

              {!loadingProviders &&
                filteredProviders.length === 0 &&
                !errorProviders && (
                  <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground mb-4">
                      Nenhum prestador encontrado com os filtros selecionados.
                    </p>
                    <Button
                      onClick={() => handleSearch("", "", "")}
                      variant="outline"
                    >
                      Ver todos os prestadores
                    </Button>
                  </div>
                )}
            </div>
          </section>

          {/* CTA final */}
          <section className="py-20 px-4 bg-gradient-hero">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pronto para começar?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Junte-se à nossa comunidade e encontre ou ofereça serviços na
                sua região.
              </p>
              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg_WHITE/90 px-10 py-4 text-lg font-semibold rounded-xl"
                  onClick={() => navigate("/register")}
                >
                  Faça seu Cadastro
                </Button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-card py-12 px-4 border-t">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Marketplace Local
            </h3>
            <p className="text-muted-foreground mb-6">
              Conectando comunidades, fortalecendo negócios locais.
            </p>
            <p className="text-sm text-muted-foreground">
              © 2025 Marketplace Local. Desenvolvido para cidades pequenas com
              grandes oportunidades.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
