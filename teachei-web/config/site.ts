// Site metadata configuration
export const siteConfig = {
  name: "TeAchei",
  description: "A maneira mais fácil de encontrar seu próximo veículo. Conecte-se com vendedores e encontre o carro, moto ou caminhão dos seus sonhos.",
  url: "https://teachei.com.br",
  ogImage: "https://teachei.com.br/og-image.png",
  keywords: [
    "comprar carro",
    "vender carro",
    "carros usados",
    "motos",
    "caminhões",
    "veículos",
    "marketplace automotivo",
    "TeAchei",
    "intenção de compra",
  ],
  authors: [
    {
      name: "TeAchei",
      url: "https://teachei.com.br",
    },
  ],
  creator: "TeAchei",
  
  // Social links
  links: {
    instagram: "https://www.instagram.com/teacheiapp",
    whatsapp: "https://wa.me/5511999999999",
  },
  
  // Brand colors for meta tags
  themeColor: "#137fec",
  
  // Navigation links
  mainNav: [
    { title: "Início", href: "/" },
    { title: "Buscar", href: "/buscar" },
    { title: "Como Funciona", href: "/#como-funciona" },
  ],
  
  // Dashboard navigation
  dashboardNav: [
    { title: "Feed", href: "/", icon: "home" },
    { title: "Salvos", href: "/favorites", icon: "bookmark" },
    { title: "Mensagens", href: "/messages", icon: "chat" },
    { title: "Perfil", href: "/profile", icon: "person" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;



