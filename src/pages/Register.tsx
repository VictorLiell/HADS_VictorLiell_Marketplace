import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Store, User } from "lucide-react";

const Register = () => {
  const [providerData, setProviderData] = useState({
    cpf: "",
    password: "",
    cnpj: "",
    services: [] as string[],
    location: "",
    name: "",
  });

  const [clientData, setClientData] = useState({
    name: "",
    cpf: "",
    password: "",
    email: "",
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

  const handleProviderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!providerData.cpf || !providerData.password) {
      toast.error("CPF e senha são obrigatórios");
      return;
    }

    if (providerData.services.length === 0) {
      toast.error("Selecione pelo menos um serviço");
      return;
    }

    toast.success("Cadastro de prestador realizado com sucesso!");
    console.log("Provider data:", providerData);
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientData.cpf || !clientData.password) {
      toast.error("CPF e senha são obrigatórios");
      return;
    }

    toast.success("Cadastro de cliente realizado com sucesso!");
    console.log("Client data:", clientData);
  };

  const toggleService = (service: string) => {
    setProviderData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Marketplace Local</CardTitle>
          <CardDescription className="text-lg">Conectando pessoas e serviços</CardDescription>
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

            <TabsContent value="provider">
              <form onSubmit={handleProviderSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider-name">Nome Completo</Label>
                  <Input
                    id="provider-name"
                    value={providerData.name}
                    onChange={(e) => setProviderData({ ...providerData, name: e.target.value })}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider-cpf">CPF *</Label>
                  <Input
                    id="provider-cpf"
                    value={providerData.cpf}
                    onChange={(e) => setProviderData({ ...providerData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider-password">Senha *</Label>
                  <Input
                    id="provider-password"
                    type="password"
                    value={providerData.password}
                    onChange={(e) => setProviderData({ ...providerData, password: e.target.value })}
                    placeholder="Senha segura"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider-cnpj">CNPJ (Opcional)</Label>
                  <Input
                    id="provider-cnpj"
                    value={providerData.cnpj}
                    onChange={(e) => setProviderData({ ...providerData, cnpj: e.target.value })}
                    placeholder="00.000.000/0000-00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider-location">Onde você atende? *</Label>
                  <Input
                    id="provider-location"
                    value={providerData.location}
                    onChange={(e) => setProviderData({ ...providerData, location: e.target.value })}
                    placeholder="Cidade, bairro ou região"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Serviços que você oferece *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {serviceOptions.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
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

                <Button type="submit" className="w-full" size="lg">
                  Cadastrar como Prestador
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="client">
              <form onSubmit={handleClientSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Nome Completo</Label>
                  <Input
                    id="client-name"
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-email">E-mail</Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-cpf">CPF *</Label>
                  <Input
                    id="client-cpf"
                    value={clientData.cpf}
                    onChange={(e) => setClientData({ ...clientData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-password">Senha *</Label>
                  <Input
                    id="client-password"
                    type="password"
                    value={clientData.password}
                    onChange={(e) => setClientData({ ...clientData, password: e.target.value })}
                    placeholder="Senha segura"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Cadastrar como Cliente
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <a href="/" className="text-primary font-medium hover:underline">
              Fazer login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
