import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSection } from "@/components/SearchSection";
import { ServiceCard } from "@/components/ServiceCard";
import { Search, Users, Shield, Clock } from "lucide-react";
import heroImage from "@/assets/hero-marketplace.jpg";

// Provedores de serviço 
const mockProviders = [
  {
    id: "1",
    name: "João Silva",
    service: "Encanamento Residencial",
    category: "Elétrica e Encanamento",
    rating: 4.8,
    reviews: 24,
    location: "Centro, Passo Fundo",
    phone: "(54) 99999-1234",
    image: "",
    description: "Especialista em encanamentos. Atendimento 24h para emergências.",
    price: "A partir de R$ 85",
    available: true
  },
  {
    id: "2",
    name: "Maria Santos",
    service: "Cabeleireira e Manicure",
    category: "Beleza e Estética",
    rating: 4.9,
    reviews: 45,
    location: "Vila Nova, Passo Fundo",
    phone: "(54) 99999-5678",
    image: "",
    description: "Salão completo com cortes modernos, coloração e tratamentos. Atendimento personalizado.",
    price: "A partir de R$ 45",
    available: false
  },
  {
    id: "3",
    name: "Carlos Pereira",
    service: "Eletricista Profissional",
    category: "Elétrica e Encanamento",
    rating: 4.7,
    reviews: 32,
    location: "São José, Passo Fundo",
    phone: "(54) 99999-9012",
    image: "",
    description: "Instalações elétricas, manutenção e emergências. Licenciado e experiente.",
    price: "A partir de R$ 90",
    available: true
  },
  {
    id: "4",
    name: "Ana Costa",
    service: "Faxineira e Organização",
    category: "Limpeza e Organização",
    rating: 5.0,
    reviews: 18,
    location: "Boqueirão, Passo Fundo",
    phone: "(54) 99999-3456",
    image: "",
    description: "Limpeza residencial e comercial. Organização de ambientes e faxinas completas.",
    price: "A partir de R$ 120/dia",
    available: true
  },
  {
    id: "5",
    name: "Roberto Lima",
    service: "Jardinagem e Paisagismo",
    category: "Jardinagem e Paisagismo",
    rating: 4.6,
    reviews: 28,
    location: "Integração, Passo Fundo",
    phone: "(54) 99999-7890",
    image: "",
    description: "Criação e manutenção de jardins, poda de árvores e projetos paisagísticos.",
    price: "A partir de R$ 150",
    available: true
  },
  {
    id: "6",
    name: "Fernanda Oliveira",
    service: "Aulas Particulares de Matemática",
    category: "Educação e Consultoria",
    rating: 4.9,
    reviews: 15,
    location: "Universitário, Passo Fundo",
    phone: "(54) 99999-2468",
    image: "",
    description: "Professora formada em Matemática. Aulas para ensino fundamental e médio.",
    price: "R$ 50/hora",
    available: true
  }
];

const Index = () => {
  const [filteredProviders, setFilteredProviders] = useState(mockProviders);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string, category: string, location: string) => {
    let filtered = mockProviders;
    
    if (query) {
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(query.toLowerCase()) ||
        provider.service.toLowerCase().includes(query.toLowerCase()) ||
        provider.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (category && category !== "todos os serviços") {
      filtered = filtered.filter(provider => 
        provider.category.toLowerCase() === category
      );
    }
    
    setFilteredProviders(filtered);
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
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
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Encontre os melhores profissionais da sua cidade. Rápido, confiável e na sua vizinhança.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="hero" className="text-lg px-8 py-4">
              <Search className="h-5 w-5" />
              Encontrar Serviços
            </Button>
            <Button size="lg" variant="marketplace" className="text-lg px-8 py-4">
              <Users className="h-5 w-5" />
              Seja um Prestador
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              <h3 className="text-xl font-semibold mb-3">Busca Inteligente</h3>
              <p className="text-muted-foreground">
                Encontre exatamente o que precisa com nossos filtros avançados por categoria e localização.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-card shadow-card">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Prestadores Verificados</h3>
              <p className="text-muted-foreground">
                Todos os profissionais passam por verificação e são avaliados pela comunidade.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-card shadow-card">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Atendimento Rápido</h3>
              <p className="text-muted-foreground">
                Conecte-se diretamente com prestadores locais e tenha respostas em minutos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SearchSection onSearch={handleSearch} />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {searchQuery ? `Resultados para "${searchQuery}"` : "Prestadores em Destaque"}
              </h2>
              <p className="text-muted-foreground">
                {filteredProviders.length} {filteredProviders.length === 1 ? 'prestador encontrado' : 'prestadores encontrados'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <ServiceCard key={provider.id} provider={provider} />
            ))}
          </div>
          
          {filteredProviders.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                Nenhum prestador encontrado com os filtros selecionados.
              </p>
              <Button onClick={() => handleSearch("", "", "")} variant="outline">
                Ver todos os prestadores
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Vamos começar?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Junte-se a centenas de prestadores e clientes que já fazem parte da nossa comunidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="hero" className="bg-white text-primary hover:bg-white/90">
              Cadastrar-se como Cliente
            </Button>
            <Button size="lg" variant="marketplace" className="border-white text-white hover:bg-white/10">
              Cadastrar-se como Prestador
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12 px-4 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-primary mb-4">Marketplace Local</h3>
          <p className="text-muted-foreground mb-6">
            Conectando comunidades, fortalecendo negócios locais.
          </p>
          <p className="text-sm text-muted-foreground">
            © 2025 Marketplace Local. Desenvolvido para cidades pequenas com grandes oportunidades.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
