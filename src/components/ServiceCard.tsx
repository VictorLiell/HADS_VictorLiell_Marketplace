import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Phone, MessageCircle } from "lucide-react";

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
}

interface ServiceCardProps {
  provider: ServiceProvider;
}

export const ServiceCard = ({ provider }: ServiceCardProps) => {
  return (
    <Card className="group hover:shadow-card-hover transition-all duration-300 transform hover:scale-[1.02] bg-gradient-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
              {provider.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <CardTitle className="text-lg">{provider.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-sm">
                <MapPin className="h-3 w-3" />
                {provider.location}
              </CardDescription>
            </div>
          </div>
          <Badge variant={provider.available ? "default" : "secondary"} className="text-xs">
            {provider.available ? "Disponível" : "Ocupado"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-primary">{provider.service}</h3>
          <p className="text-sm text-muted-foreground mt-1">{provider.description}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{provider.rating}</span>
            <span className="text-xs text-muted-foreground">({provider.reviews} avaliações)</span>
          </div>
          <span className="font-semibold text-primary">{provider.price}</span>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" variant="default">
            <Phone className="h-4 w-4" />
            Ligar
          </Button>
          <Button size="sm" className="flex-1" variant="secondary">
            <MessageCircle className="h-4 w-4" />
            Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};