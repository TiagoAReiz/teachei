import { type ReactNode } from "react";
import { Logo } from "@/components/ui/logo";

interface AuthLayoutProps {
  children: ReactNode;
  backgroundImage?: string;
}

export function AuthLayout({ children, backgroundImage }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left Side - Image/Brand (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: backgroundImage 
              ? `url(${backgroundImage})` 
              : "url('https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200')" 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/40 to-background/10" />
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="mb-8">
            <Logo size="xl" href="/" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-4">
            Encontre o veículo dos seus sonhos
          </h1>
          <p className="text-white/80 text-center max-w-md text-lg">
            Conecte-se com milhares de vendedores e encontre as melhores ofertas para você.
          </p>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden relative h-48 bg-primary overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: backgroundImage 
              ? `url(${backgroundImage})` 
              : "url('https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800')" 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-transparent z-10" />
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
          <Logo size="md" href="/" />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}



