import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui";
import { Phone, Mail, Instagram } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Fale Conosco - TeAchei",
  description: "Entre em contato com a equipe do TeAchei",
};

const contactChannels = [
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    value: "(11) 94443-4123",
    description: "Fale conosco pelo WhatsApp",
    href: siteConfig.links.whatsapp,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    hoverColor: "hover:bg-green-100 dark:hover:bg-green-950/50",
  },
  {
    icon: Mail,
    label: "E-mail",
    value: siteConfig.contact.email,
    description: "Envie um e-mail para nós",
    href: `mailto:${siteConfig.contact.email}`,
    color: "text-primary",
    bgColor: "bg-primary/5",
    borderColor: "border-primary/20",
    hoverColor: "hover:bg-primary/10",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@teacheiapp",
    description: "Siga-nos no Instagram",
    href: siteConfig.links.instagram,
    color: "text-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
    borderColor: "border-pink-200 dark:border-pink-800",
    hoverColor: "hover:bg-pink-100 dark:hover:bg-pink-950/50",
  },
];

export default function ContatoPage() {
  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-3">Fale Conosco</h1>
        <p className="text-muted text-lg max-w-xl mx-auto">
          Tem alguma dúvida, sugestão ou precisa de ajuda? Entre em contato
          conosco por um dos canais abaixo.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {contactChannels.map((channel) => {
          const Icon = channel.icon;
          return (
            <a
              key={channel.label}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`block rounded-2xl border p-6 transition-colors ${channel.bgColor} ${channel.borderColor} ${channel.hoverColor}`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${channel.color} bg-white dark:bg-background shadow-sm`}>
                  <Icon size={28} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">
                    {channel.label}
                  </h2>
                  <p className={`font-medium ${channel.color} mb-1`}>
                    {channel.value}
                  </p>
                  <p className="text-muted text-sm">
                    {channel.description}
                  </p>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <Card className="mt-8">
        <CardContent className="p-6 text-center">
          <Phone className="mx-auto text-primary mb-3" size={32} />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Horário de Atendimento
          </h2>
          <p className="text-muted leading-relaxed">
            Segunda a sexta-feira, das 9h às 18h.
            <br />
            Respondemos todas as mensagens o mais rápido possível.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
