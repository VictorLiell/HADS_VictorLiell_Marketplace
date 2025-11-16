 import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Phone, Copy, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const phoneDigits = provider.phone.replace(/[^0-9]/g, "");
  const telLink = `tel:${phoneDigits}`;
  const whatsappLink = `https://wa.me/55${phoneDigits}`;

  const copyPhone = () => {
    navigator.clipboard.writeText(provider.phone);
    toast({
      title: "Número copiado!",
      description: `${provider.phone} foi copiado para sua área de transferência.`
    });
  };

  return (
    <>
      <Card className="group hover:shadow-card-hover transition-all duration-300 transform hover:scale-[1.02] bg-gradient-card">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                {provider.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <CardTitle className="text-lg">{provider.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-sm">
                  <MapPin className="h-3 w-3" />
                  {provider.location}
                </CardDescription>
              </div>
            </div>

            <Badge
              variant={provider.available ? "default" : "secondary"}
              className="text-xs"
            >
              {provider.available ? "Disponível" : "Ocupado"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-primary">{provider.service}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {provider.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{provider.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({provider.reviews} avaliações)
              </span>
            </div>
            <span className="font-semibold text-primary">
              {provider.price}
            </span>
          </div>

          {/* Botões lado a lado: Ver Contato + Avaliar serviço */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setOpen(true)}
            >
              <Phone className="h-4 w-4" />
              Ver Contato
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
              asChild
            >
              <Link to={`/prestadores/${provider.id}/avaliar`}>
                Avaliar serviço
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* MODAL DE CONTATO */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Contato do Prestador</DialogTitle>
            <DialogDescription>
              Informações de contato de <strong>{provider.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Telefone:</p>
              <p className="text-lg font-semibold">{provider.phone}</p>
            </div>

            <div className="flex flex-col gap-2">
              {/* Botão Ligar */}
              <Button asChild variant="default">
                <a href={telLink} className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Ligar Agora
                </a>
              </Button>

              {/* Botão WhatsApp */}
              <Button asChild variant="secondary">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>

              {/* Botão Copiar */}
              <Button
                variant="outline"
                onClick={copyPhone}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copiar Número
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
