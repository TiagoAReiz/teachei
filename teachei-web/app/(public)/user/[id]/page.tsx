import { Metadata } from "next";
import { notFound } from "next/navigation";
import { UserProfileClient } from "./client";
import { env, API_ENDPOINTS } from "@/config/env";
import { siteConfig } from "@/config/site";
import type { User } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

// Server-side data fetching for SEO
async function getUser(id: string): Promise<User | null> {
  try {
    const res = await fetch(`${env.API_URL}${API_ENDPOINTS.PROFILE_BY_ID(id)}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await getUser(id);
  
  if (!user) {
    return {
      title: "Usuário não encontrado",
    };
  }

  const title = `${user.nome} - ${siteConfig.name}`;
  const description = user.bio || `Veja o perfil de ${user.nome} no TeAchei`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `${siteConfig.url}/user/${id}`,
      images: user.avatarUrl ? [{ url: user.avatarUrl, width: 400, height: 400 }] : [],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  return <UserProfileClient user={user} />;
}



