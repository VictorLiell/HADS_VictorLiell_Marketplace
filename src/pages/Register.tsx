import { useState, FormEvent } from "react";
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
import { Store, User, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Controle de senha visível
  const [showProviderPassword, setShowProviderPassword] = useState(false);
  const [showClientPassword, setShowClientPassword] = useState(false);

  // Prestador
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

  // Cliente
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

  // ------------------------
  // CADASTRO DO PRESTADOR
  // ------------------------
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
          "Email, nome, CPF, telefone e senha são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (providerData.services.length === 0) {
      toast({
        title: "Serviços necessários",
        description: "Selecione pelo menos um serviço.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Criar usuário de autenticação (sem confirmação)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: providerData.email,
        password: providerData.password,
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          toast({
            title: "Email já cadastrado",
            description:
              "Este email já está sendo usado. Faça login ou use outro.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        throw authError;
      }

      if (!authData.user) throw new Error("Erro ao criar usuário");

      // Criar perfil
      const { data: profileInsertData, error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: authData.user.id,
          user_type: "provider",
          full_name: providerData.fullName,
          cpf: providerData.cpf,
          cnpj: providerData.cnpj || null,
          phone: providerData.phone,
          services: providerData.services,
          location: providerData.location || null,
        })
        .select("*")
        .single();

      if (profileError) throw profileError;

      // Serviço principal (primeiro da lista)
      const mainService = providerData.services[0] || "Serviços gerais";

      // service_providers
      const { error: providerError } = await supabase
        .from("service_providers")
        .insert({
          profile_id: profileInsertData.id,
          name: providerData.fullName,
          service: mainService,
          category: mainService,
          rating: 0,
          reviews: 0,
          location: providerData.location || "Passo Fundo",
          phone: providerData.phone,
          image: "",
          description: "",
          price: "A combinar",
          available: true,
          is_featured: true,
        });

      if (providerError) throw providerError;

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

  // ------------------------
  // CADASTRO DO CLIENTE
  // ------------------------
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
          "Email, nome completo, CPF, telefone e senha são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: clientData.email,
        password: clientData.password,
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          toast({
            title: "Email já cadastrado",
            description:
              "Este email já está sendo usado. Faça login ou use outro email.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        throw authError;
      }

      if (!authData.user) throw new Error("Erro ao criar usuário");

      // Criar perfil
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

  // ------------------------
  // UI
  // ------------------------
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

            {/* Prestador */}
            <TabsContent value="provider">
              <form onSubmit={handleProviderSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={providerData.email}
                    onChange={(e) =>
                      setProviderData({
                        ...providerData,
                        email: e.target.value,
                      })
                    }
                    placeholder="email@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Senha *</Label>
                  <div className="relative">
                    <Input
                      type={showProviderPassword ? "text" : "password"}
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
                    <button
                      type="button"
                      onClick={() =>
                        setShowProviderPassword((prev) => !prev)
                      }
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      {showProviderPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nome Completo *</Label>
                  <Input
                    value={providerData.fullName}
                    onChange={(e) =>
                      setProviderData({
                        ...providerData,
                        fullName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>CPF *</Label>
                  <Input
                    value={providerData.cpf}
                    onChange={(e) =>
                      setProviderData({
                        ...providerData,
                        cpf: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>CNPJ (opcional)</Label>
                  <Input
                    value={providerData.cnpj}
                    onChange={(e) =>
                      setProviderData({
                        ...providerData,
                        cnpj: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Telefone *</Label>
                  <Input
                    value={providerData.phone}
                    onChange={(e) =>
                      setProviderData({
                        ...providerData,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Localização</Label>
                  <Input
                    value={providerData.location}
                    onChange={(e) =>
                      setProviderData({
                        ...providerData,
                        location: e.target.value,
                      })
                    }
                    placeholder="Cidade ou bairro"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Serviços *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {serviceOptions.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          checked={providerData.services.includes(service)}
                          onCheckedChange={() => toggleService(service)}
                        />
                        <label className="text-sm cursor-pointer">{service}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Cadastrando..." : "Cadastrar como Prestador"}
                </Button>

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

            {/* Cliente */}
            <TabsContent value="client">
              <form onSubmit={handleClientSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={clientData.email}
                    onChange={(e) =>
                      setClientData({ ...clientData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Senha *</Label>
                  <div className="relative">
                    <Input
                      type={showClientPassword ? "text" : "password"}
                      value={clientData.password}
                      onChange={(e) =>
                        setClientData({ ...clientData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowClientPassword((prev) => !prev)
                      }
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      {showClientPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nome Completo *</Label>
                  <Input
                    value={clientData.fullName}
                    onChange={(e) =>
                      setClientData({ ...clientData, fullName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>CPF *</Label>
                  <Input
                    value={clientData.cpf}
                    onChange={(e) =>
                      setClientData({ ...clientData, cpf: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Telefone *</Label>
                  <Input
                    value={clientData.phone}
                    onChange={(e) =>
                      setClientData({ ...clientData, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Cadastrando..." : "Cadastrar como Cliente"}
                </Button>

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
