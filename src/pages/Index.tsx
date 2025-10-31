import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Store, Users, MapPin, Shield, User } from "lucide-react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha email e senha",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta.",
      });
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-background to-primary/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        {user && (
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => navigate("/profile")}
              variant="outline"
              className="gap-2"
            >
              <User className="h-4 w-4" />
              Meu Perfil
            </Button>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">
            Marketplace Local
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Conectando você aos melhores profissionais da sua região
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/services")}
            className="gap-2"
          >
            <Store className="h-5 w-5" />
            Ver Serviços Disponíveis
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {/* Login Card */}
          {!user ? (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Entrar na Plataforma</CardTitle>
                <CardDescription>Acesse sua conta para continuar</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="Digite sua senha"
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
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
                <CardDescription>Você está logado como {user.email}</CardDescription>
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
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/chat")}
                >
                  Ir para Chat
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          <div className="space-y-4">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Para Prestadores</CardTitle>
                  <CardDescription>Ofereça seus serviços localmente</CardDescription>
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
                  <CardDescription>Encontre profissionais qualificados</CardDescription>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Atendimento Local</CardTitle>
                  <CardDescription>Profissionais da sua região</CardDescription>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-secondary/20 hover:border-secondary/40 transition-colors">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Seguro e Confiável</CardTitle>
                  <CardDescription>Avaliações e verificações</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
