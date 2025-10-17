import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";

interface SearchSectionProps {
  onSearch: (query: string, category: string, location: string) => void;
}

export const SearchSection = ({ onSearch }: SearchSectionProps) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    onSearch(query, category, location);
  };

  const categories = [
    "Todos os serviços",
    "Construção e Reforma",
    "Elétrica e Encanamento",
    "Beleza e Estética",
    "Limpeza e Organização",
    "Jardinagem e Paisagismo",
    "Técnico e Manutenção",
    "Educação e Consultoria",
    "Alimentação e Gastronomia"
  ];

  return (
    <div className="bg-card rounded-lg p-6 shadow-card">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Encontre o serviço que você precisa
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="O que você está procurando?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat.toLowerCase()}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button onClick={handleSearch} className="h-12" variant="hero">
          <Search className="h-4 w-4" />
          Buscar
        </Button>
      </div>
      
      <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>Serviços disponíveis na sua região</span>
      </div>
    </div>
  );
};