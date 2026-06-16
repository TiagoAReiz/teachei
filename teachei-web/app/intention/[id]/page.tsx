import { Metadata } from "next";
import { notFound } from "next/navigation";
import { IntentionDetailsClient } from "./client";
import { siteConfig } from "@/config/site";
import { BuscarAnuncioUseCaseImpl } from "@/ap/anuncio/application/usecase/BuscarAnuncioUseCaseImpl";
import { AnuncioSupabaseAdapter } from "@/ap/anuncio/infrastructure/persistence/AnuncioSupabaseAdapter";
import type { Anuncio } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

async function getIntention(id: string): Promise<Anuncio | null> {
  try {
    const result = await new BuscarAnuncioUseCaseImpl(new AnuncioSupabaseAdapter()).execute(id);
    return result as unknown as Anuncio;
  } catch {
    return null;
  }
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const intention = await getIntention(id);
  
  if (!intention) {
    return {
      title: "Intenção não encontrada",
    };
  }

  const title = `Procuro ${intention.veiculo.marcaNome} ${intention.veiculo.modeloNome} - ${siteConfig.name}`;
  const anos = intention.veiculo.anos;
  const anosText = anos.length > 0 
    ? (anos.length === 1 ? anos[0].toString() : `${Math.min(...anos)}-${Math.max(...anos)}`) 
    : "";
  const description = intention.observacoes 
    || `Comprador procura ${intention.veiculo.marcaNome} ${intention.veiculo.modeloNome} ${anosText} ${intention.veiculo.precoMaximo ? `por até R$ ${intention.veiculo.precoMaximo.toLocaleString("pt-BR")}` : ""}`.trim();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${siteConfig.url}/intention/${id}`,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/intention/${id}`,
    },
  };
}

export default async function IntentionPage({ params }: Props) {
  const { id } = await params;
  const intention = await getIntention(id);

  if (!intention) {
    notFound();
  }

  return <IntentionDetailsClient initialData={intention} />;
}



