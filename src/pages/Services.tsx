import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Briefcase } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Provider {
  id: string;
  full_name: string | null;
  services: string[] | null;
  location: string | null;
}

const Services = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, services, location")
        .eq("user_type", "provider");

      if (error) throw error;
      setProviders(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar prestadores",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-background to-primary/10 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Prestadores de Serviços
          </h1>
          <p className="text-lg text-muted-foreground">
            Encontre profissionais qualificados na sua região
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando prestadores...</p>
          </div>
        ) : providers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Nenhum prestador cadastrado ainda.
              </p>
              <Button onClick={() => navigate("/register")}>
                Seja o primeiro a se cadastrar
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    {provider.full_name || "Prestador"}
                  </CardTitle>
                  {provider.location && (
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {provider.location}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Serviços oferecidos:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {provider.services && provider.services.length > 0 ? (
                        provider.services.map((service, index) => (
                          <Badge key={index} variant="secondary">
                            {service}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Nenhum serviço especificado
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">
                Quer aparecer aqui?
              </h2>
              <p className="text-muted-foreground mb-6">
                Cadastre-se gratuitamente e conecte-se com clientes na sua região
              </p>
              <Button size="lg" onClick={() => navigate("/register")}>
                Cadastrar-se agora
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Services;
