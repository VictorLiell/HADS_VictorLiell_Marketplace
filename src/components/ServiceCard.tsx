import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  DialogFooter,
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
  is_featured?: boolean;
}

interface ServiceCardProps {
  provider: ServiceProvider;
}

export const ServiceCard = ({ provider }: ServiceCardProps) => {
  const { toast } = useToast();
  const [openContact, setOpenContact] = useState(false);

  // ✅ Função COMPLETA – copiar telefone com fallback
  const handleCopyPhone = async () => {
    const phone = provider.phone;

    try {
      // Navegadores modernos
      await navigator.clipboard.writeText(phone);

      toast({
        title: "Telefone copiado!",
        description: `${phone} foi copiado para a área de transferência.`,
      });
    } catch (err) {
      // Fallback para navegadores antigos ou bloqueados
      const textArea = document.createElement("textarea");
      textArea.value = phone;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");

        toast({
          title: "Telefone copiado!",
          description: `${phone} foi copiado para a área de transferência.`,
        });
      } catch {
        toast({
          title: "Erro ao copiar telefone",
          description: "Seu navegador não permitiu copiar automaticamente.",
          variant: "destructive",
        });
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  // Abrir WhatsApp
  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Olá ${provider.name}, encontrei seu serviço no Marketplace Local e gostaria de mais informações.`
    );
    const phone = provider.phone.replace(/\D/g, ""); // remove tudo que não é número
    window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
  };

  return (
    <>
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
        {/* Cabeçalho */}
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              {provider.name}
              {provider.is_featured && (
                <Badge variant="default" className="text-xs">
                  Destaque
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{provider.service}</CardDescription>

            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>
                {provider.rating.toFixed(1)} • {provider.reviews}{" "}
                {provider.reviews === 1 ? "avaliação" : "avaliações"}
              </span>
            </div>
          </div>

          {/* Preço */}
          {provider.price && (
            <div className="text-right">
              <span className="block text-xs text-muted-foreground">
                Valor médio
              </span>
              <span className="text-lg font-semibold text-primary">
                {provider.price}
              </span>
            </div>
          )}
        </CardHeader>

        {/* Conteúdo */}
        <CardContent className="flex-1 flex flex-col gap-4">
          {provider.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {provider.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{provider.location}</span>
          </div>

          {/* Ações */}
          <div className="mt-auto flex flex-col gap-2">
            <Button className="w-full" onClick={() => setOpenContact(true)}>
              <Phone className="w-4 h-4 mr-2" />
              Ver dados de contato
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={handleCopyPhone}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar telefone
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={openContact} onOpenChange={setOpenContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contato do prestador</DialogTitle>
            <DialogDescription>
              Combine diretamente com o profissional.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div>
              <span className="font-semibold">Nome: </span>
              {provider.name}
            </div>
            <div>
              <span className="font-semibold">Serviço: </span>
              {provider.service}
            </div>
            {provider.price && (
              <div>
                <span className="font-semibold">Valor médio: </span>
                {provider.price}
              </div>
            )}
            <div>
              <span className="font-semibold">Telefone: </span>
              {provider.phone}
            </div>
            <div>
              <span className="font-semibold">Localização: </span>
              {provider.location}
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={handleCopyPhone}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar telefone
            </Button>
            <Button onClick={handleWhatsApp}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Conversar no WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
