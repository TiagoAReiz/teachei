"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, Instagram, Facebook, Camera, Lock, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button, Input, Card, CardContent, Avatar, LocationPicker } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/toast";
import { isValidUF } from "@/lib/ibge";
import { isValidBrazilianPhone, formatBrazilianPhoneInput, stripPhoneFormatting } from "@/lib/utils";

const profileSchema = z.object({
  nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  whatsapp: z.string()
    .refine((val) => !val || isValidBrazilianPhone(val), "Use formato brasileiro: +5511999998888")
    .optional()
    .or(z.literal("")),
  cidade: z.string().optional(),
  estado: z.string()
    .refine((val) => !val || isValidUF(val), "Estado inválido")
    .optional(),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>\[\]\-_+=~`]).{8,}$/;

const passwordSchema = z.object({
  senhaAtual: z.string().min(1, "Senha atual é obrigatória"),
  novaSenha: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(passwordRegex, "Senha deve conter maiúscula, minúscula, número e caractere especial"),
  confirmarNovaSenha: z.string(),
}).refine((data) => data.novaSenha === data.confirmarNovaSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarNovaSenha"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB - stored in Azure Blob Storage

export default function SettingsPage() {
  const { user, updateProfile, updateProfileAsync, isUpdatingProfile, changePassword, isChangingPassword } = useAuth();
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isPhotoRemoved, setIsPhotoRemoved] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Prevent hydration mismatch by waiting for client mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Reset isPhotoRemoved when user data confirms the photo is actually removed
  useEffect(() => {
    if (isPhotoRemoved && !user?.fotoUrl) {
      setIsPhotoRemoved(false);
    }
  }, [user?.fotoUrl, isPhotoRemoved]);

  // Check if user has a photo in Blob Storage - consider local removal state
  const hasPhoto = !isPhotoRemoved && !!user?.fotoUrl;

  const handleRemovePhoto = async () => {
    if (!hasPhoto) {
      error("Não há foto para remover");
      return;
    }
    
    // Set removal state immediately for instant UI feedback
    setIsPhotoRemoved(true);
    setIsUploadingPhoto(true);
    
    try {
      await updateProfileAsync({ removerFoto: true });
      success("Foto removida com sucesso!");
    } catch (err) {
      // Revert removal state on error
      setIsPhotoRemoved(false);
      error(err instanceof Error ? err.message : "Erro ao remover foto");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handlePhotoClick = () => {
    console.log("[DEBUG] handlePhotoClick called, fileInputRef:", fileInputRef.current);
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[DEBUG] handlePhotoChange called, files:", e.target.files);
    const file = e.target.files?.[0];
    if (!file) {
      console.log("[DEBUG] No file selected");
      return;
    }
    console.log("[DEBUG] File selected:", file.name, file.type, file.size);

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      error("Formato não suportado. Use JPEG, PNG ou WebP.");
      return;
    }

    // Validate file size
    if (file.size > MAX_PHOTO_SIZE) {
      error("Imagem deve ter no máximo 5MB");
      return;
    }

    // Convert to base64 and upload to Blob Storage
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      console.log("[DEBUG] Base64 ready, length:", base64?.length);
      
      // Reset removal state since we're uploading a new photo
      setIsPhotoRemoved(false);
      
      // Upload to Blob Storage
      setIsUploadingPhoto(true);
      console.log("[DEBUG] Starting upload...");
      try {
        await updateProfileAsync({ foto: base64 });
        console.log("[DEBUG] Upload success!");
        success("Foto atualizada com sucesso!");
      } catch (err) {
        console.error("[DEBUG] Upload error:", err);
        error(err instanceof Error ? err.message : "Erro ao atualizar foto");
      } finally {
        setIsUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome: "",
      whatsapp: "",
      cidade: "",
      estado: "",
      bio: "",
      instagram: "",
      facebook: "",
    },
  });

  // Re-initialize form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        nome: user.nome || "",
        whatsapp: user.whatsapp ? formatBrazilianPhoneInput(user.whatsapp) : "",
        cidade: user.cidade || "",
        estado: user.estado || "",
        bio: user.bio || "",
        instagram: user.instagram || "",
        facebook: user.facebook || "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    // Strip phone formatting before sending to backend
    const cleanData = {
      ...data,
      whatsapp: data.whatsapp ? stripPhoneFormatting(data.whatsapp) : undefined,
    };
    updateProfile(cleanData, {
      onSuccess: () => success("Perfil atualizado com sucesso!"),
      onError: (err: Error) => error(err.message || "Erro ao atualizar perfil"),
    });
  };

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      senhaAtual: "",
      novaSenha: "",
      confirmarNovaSenha: "",
    },
  });

  const onSubmitPassword = (data: PasswordFormData) => {
    changePassword(
      { senhaAtual: data.senhaAtual, novaSenha: data.novaSenha },
      {
        onSuccess: () => {
          success("Senha alterada com sucesso!");
          resetPassword();
          setShowCurrentPassword(false);
          setShowNewPassword(false);
          setShowConfirmPassword(false);
        },
        onError: (err: Error) => error(err.message || "Erro ao alterar senha"),
      }
    );
  };

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Configurações</h1>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Informações do Perfil</h2>
          
          {/* Photo Upload Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <button
                type="button"
                onClick={handlePhotoClick}
                disabled={isUploadingPhoto}
                className="relative group"
              >
                <Avatar
                  fotoUrl={hasMounted && !isPhotoRemoved ? user?.fotoUrl : undefined}
                  fallback={hasMounted ? user?.nome : undefined}
                  size="xl"
                  className="ring-2 ring-border group-hover:ring-primary transition-all"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <div>
              <p className="font-medium text-foreground">Foto do perfil</p>
              <p className="text-sm text-muted">
                Clique para alterar. Max 5MB.
              </p>
              {isUploadingPhoto && (
                <p className="text-sm text-primary">Enviando...</p>
              )}
              {hasPhoto && !isUploadingPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="flex items-center gap-1 text-sm text-error hover:underline mt-1"
                >
                  <Trash2 size={14} />
                  Remover foto
                </button>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register("nome")}
              label="Nome"
              placeholder="Seu nome completo"
              icon={<User size={20} />}
              error={errors.nome?.message}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                {...register("whatsapp", {
                  onChange: (e) => {
                    const formatted = formatBrazilianPhoneInput(e.target.value);
                    setValue("whatsapp", formatted, { shouldValidate: true });
                  }
                })}
                label="WhatsApp"
                placeholder="+5511999998888"
                icon={<Phone size={20} />}
                error={errors.whatsapp?.message}
              />

              <LocationPicker
                estado={watch("estado") || ""}
                cidade={watch("cidade") || ""}
                onEstadoChange={(val) => setValue("estado", val)}
                onCidadeChange={(val) => setValue("cidade", val)}
                estadoError={errors.estado?.message}
                cidadeError={errors.cidade?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
              <textarea
                {...register("bio")}
                placeholder="Conte um pouco sobre você..."
                rows={4}
                className="w-full bg-surface border-0 ring-1 ring-border text-foreground placeholder:text-muted rounded-xl p-4 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-base resize-none"
              />
              {errors.bio && (
                <p className="mt-2 text-sm text-error">{errors.bio.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                {...register("instagram")}
                label="Instagram"
                placeholder="@seuusuario"
                icon={<Instagram size={20} />}
                error={errors.instagram?.message}
              />

              <Input
                {...register("facebook")}
                label="Facebook"
                placeholder="URL do perfil"
                icon={<Facebook size={20} />}
                error={errors.facebook?.message}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={isUpdatingProfile}>
                Salvar alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Section - Change Password */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Segurança</h2>
          
          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Senha atual</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  {...registerPassword("senhaAtual")}
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Digite sua senha atual"
                  className="w-full bg-surface border-0 ring-1 ring-border text-foreground placeholder:text-muted rounded-xl h-12 pl-12 pr-12 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordErrors.senhaAtual && (
                <p className="mt-2 text-sm text-error">{passwordErrors.senhaAtual.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nova senha</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  {...registerPassword("novaSenha")}
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Digite sua nova senha"
                  className="w-full bg-surface border-0 ring-1 ring-border text-foreground placeholder:text-muted rounded-xl h-12 pl-12 pr-12 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordErrors.novaSenha && (
                <p className="mt-2 text-sm text-error">{passwordErrors.novaSenha.message}</p>
              )}
              <p className="mt-1 text-xs text-muted">
                Mínimo 8 caracteres, com maiúscula, minúscula, número e caractere especial.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirmar nova senha</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  {...registerPassword("confirmarNovaSenha")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua nova senha"
                  className="w-full bg-surface border-0 ring-1 ring-border text-foreground placeholder:text-muted rounded-xl h-12 pl-12 pr-12 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordErrors.confirmarNovaSenha && (
                <p className="mt-2 text-sm text-error">{passwordErrors.confirmarNovaSenha.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={isChangingPassword}>
                Alterar senha
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Section */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Conta</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-muted" />
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button variant="danger" className="w-full sm:w-auto">
                Excluir conta
              </Button>
              <p className="text-xs text-muted mt-2">
                Esta ação é irreversível e excluirá todos os seus dados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



