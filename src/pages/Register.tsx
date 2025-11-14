import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Store, User } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verifica se já está logado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/profile");
      }
    });
  }, [navigate]);

  const [providerData, setProviderData] = useState({
    email: "",
    password: "",
    fullName: "",
    cpf: "",
    cnpj: "",
    phone: "",
    services: [] as string[],
    location: "",
  });

  const [clientData, setClientData] = useState({
    email: "",
    password: "",
    fullName: "",
    cpf: "",
    phone: "",
  });

  const serviceOptions = [
    "Encanador",
    "Eletricista",
    "Pintor",
    "Pedreiro",
    "Jardineiro",
    "Limpeza",
    "Carpinteiro",
    "Outros",
  ];

  const handleProviderSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !providerData.email ||
      !providerData.password ||
      !providerData.fullName ||
      !providerData.cpf ||
      !providerData.phone
    ) {
      toast({
        title: "Campos obrigatórios",
        description:
          "Email, nome completo, CPF, telefone e senha são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (providerData.services.length === 0) {
      toast({
        title: "Serviços necessários",
        description: "Selecione pelo menos um serviço",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Sign up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: providerData.email,
        password: providerData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro ao criar usuário");

      // Perfil
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: authData.user.id,
        user_type: "provider",
        full_name: providerData.fullName,
        cpf: providerData.cpf,
        cnpj: providerData.cnpj || null,
        phone: providerData.phone,
        services: providerData.services,
        location: providerData.location || null,
      });

      if (profileError) throw profileError;

      toast({
        title: "Cadastro realizado!",
        description: "Bem-vindo ao Marketplace Local.",
      });

      navigate("/profile");
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClientSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !clientData.email ||
      !clientData.password ||
      !clientData.fullName ||
      !clientData.cpf ||
      !clientData.phone
    ) {
      toast({
        title: "Campos obrigatórios",
        description:
          "Email, nome completo, CPF, telefone e senha são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Sign up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: clientData.email,
        password: clientData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro ao criar usuário");

      // Perfil
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: authData.user.id,
        user_type: "client",
        full_name: clientData.fullName,
        cpf: clientData.cpf,
        phone: clientData.phone,
      });

      if (profileError) throw profileError;

      toast({
        title: "Cadastro realizado!",
        description: "Bem-vindo ao Marketplace Local.",
      });

      navigate("/profile");
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (service: string) => {
    setProviderData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            Marketplace Local
          </CardTitle>
          <CardDescription className="text-lg">
            Conectando pessoas e serviços
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="provider" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="provider" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                Seja um Prestador
              </TabsTrigger>
              <TabsTrigger value="client" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Ser Cliente
              </TabsTrigger>
            </TabsList>

            {/* TAB PRESTADOR */}
            <TabsContent value="provider">
              <form onSubmit={handleProviderSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider-email">Email *</Label>
                  <Input
                    id="provider-email"
                    type="email"
                    value={providerData.email}
                    onChange={(e) =>
                      setProviderData({
                        ...providerData,
                        email: e.target.value,
                      })
                    }
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider-password">Senha *</Label>
                  <Input
                    id="provider-password"
                    type="password"
                    value={providerData.password}
                    onChange={(e) =>
                      setProviderData({
                        ...providerData,
                        password: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider-name">Nome Completo *</Label>
                  <Input
                    id="provider-name"
                    value={providerData.fullName}
                    onChange={(e) =>
                      setProviderData({
                        ...providerData,
                        fullName: e.target.value,
                      })
                    }
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider-cpf">CPF *</Label>
                  <Input
                    id="provider-cpf"
                    value={providerData.cpf}
                    onChange={(e) =>
                      setProviderData({
                        ...providerData,
                        cpf: e.target.value,
                      })
                    }
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider-cnpj">CNPJ (Opcional)</Label>
                  <Input
                    id="provider-cnpj"
                    value={providerData.cnpj}
                    onChange={(e) =>
                      setProviderData({
                        ...providerData,
                        cnpj: e.target.value,
                      })
                    }
                    placeholder="00.000.000/0000-00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider-phone">Número de Telefone *</Label>
                  <Input
                    id="provider-phone"
                    type="tel"
                    value={providerData.phone}
                    onChange={(e) =>
                      setProviderData({
                        ...providerData,
                        phone: e.target.value,
                      })
                    }
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider-location">
                    Onde você atende?
                  </Label>
                  <Input
                    id="provider-location"
                    value={providerData.location}
                    onChange={(e) =>
                      setProviderData({
                        ...providerData,
                        location: e.target.value,
                      })
                    }
                    placeholder="Cidade, bairro ou região"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Serviços que você oferece *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {serviceOptions.map((service) => (
                      <div
                        key={service}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={service}
                          checked={providerData.services.includes(service)}
                          onCheckedChange={() => toggleService(service)}
                        />
                        <label
                          htmlFor={service}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {service}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Cadastrando..." : "Cadastrar como Prestador"}
                </Button>

                {/* BLOCO INTEGRADO: ENTRAR + VOLTAR */}
                <div className="pt-4 space-y-3 text-center border-t mt-4">
                  <p className="text-sm text-muted-foreground">
                    Já possui uma conta?
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/auth")}
                  >
                    Entrar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/")}
                  >
                    Voltar para a página inicial
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* TAB CLIENTE */}
            <TabsContent value="client">
              <form onSubmit={handleClientSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email *</Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={clientData.email}
                    onChange={(e) =>
                      setClientData({
                        ...clientData,
                        email: e.target.value,
                      })
                    }
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-password">Senha *</Label>
                  <Input
                    id="client-password"
                    type="password"
                    value={clientData.password}
                    onChange={(e) =>
                      setClientData({
                        ...clientData,
                        password: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-name">Nome Completo *</Label>
                  <Input
                    id="client-name"
                    value={clientData.fullName}
                    onChange={(e) =>
                      setClientData({
                        ...clientData,
                        fullName: e.target.value,
                      })
                    }
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-cpf">CPF *</Label>
                  <Input
                    id="client-cpf"
                    value={clientData.cpf}
                    onChange={(e) =>
                      setClientData({
                        ...clientData,
                        cpf: e.target.value,
                      })
                    }
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-phone">Número de Telefone *</Label>
                  <Input
                    id="client-phone"
                    type="tel"
                    value={clientData.phone}
                    onChange={(e) =>
                      setClientData({
                        ...clientData,
                        phone: e.target.value,
                      })
                    }
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Cadastrando..." : "Cadastrar como Cliente"}
                </Button>

                {/* BLOCO INTEGRADO: ENTRAR + VOLTAR */}
                <div className="pt-4 space-y-3 text-center border-t mt-4">
                  <p className="text-sm text-muted-foreground">
                    Já possui uma conta?
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/auth")}
                  >
                    Entrar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/")}
                  >
                    Voltar para a página inicial
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
