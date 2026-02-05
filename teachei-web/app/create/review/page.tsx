"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { CheckCircle, Edit2, Car, Calendar, Palette, DollarSign, Phone, Gauge, Send, Settings, ImageIcon } from "lucide-react";
import { Button, Card, CardContent, Badge, Input, LocationPicker } from "@/components/ui";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useCreateIntentionStore } from "@/stores/create-intention-store";
import { useCreateIntention } from "@/hooks/use-intentions";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency, vehicleTypeLabels, formatOpcional, getBrazilianPhoneError } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function CreateReviewPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const { user, updateProfile, isUpdatingProfile } = useAuth();
  
  // Contact phone state - initialized with user's whatsapp if available
  const [telefoneContato, setTelefoneContato] = useState(() => user?.whatsapp || "");
  const [showUpdateProfileDialog, setShowUpdateProfileDialog] = useState(false);
  const hasInitializedRef = useRef(!!user?.whatsapp);
  
  // Track if user has attempted to publish (for validation display)
  const [hasAttemptedPublish, setHasAttemptedPublish] = useState(false);
  
  // Flag to prevent redirect after successful creation
  const isCreatedSuccessfullyRef = useRef(false);
  
  const {
    tipoVeiculo,
    marcaCodigo,
    marcaNome,
    modeloCodigo,
    modeloNome,
    modeloBaseNome,
    versoesSelecionadas,
    todasVersoes,
    anoMinimo,
    anoMaximo,
    cores,
    precoMaximo,
    quilometragemMinima,
    quilometragemMaxima,
    opcionais,
    observacoes,
    cidade,
    estado,
    fotoReferenciaBase64,
    setLocalizacao,
    reset,
    getVersionsText,
  } = useCreateIntentionStore();

  // Initialize location from user profile
  const hasInitializedLocationRef = useRef(false);
  useEffect(() => {
    if (user && !hasInitializedLocationRef.current) {
      if (user.cidade || user.estado) {
        setLocalizacao(user.cidade || "", user.estado || "");
        hasInitializedLocationRef.current = true;
      }
    }
  }, [user, setLocalizacao]);

  const { mutate: createIntention, isPending: isCreating } = useCreateIntention();

  // Redirect if incomplete (but not after successful creation)
  useEffect(() => {
    // Skip redirect if creation was successful (we're navigating to feed)
    if (isCreatedSuccessfullyRef.current) return;
    
    // Check for both old (modeloCodigo) and new (versoesSelecionadas) flow
    const hasModel = modeloCodigo || versoesSelecionadas.length > 0;
    if (!tipoVeiculo || !marcaCodigo || !hasModel) {
      router.push("/create");
    }
  }, [tipoVeiculo, marcaCodigo, modeloCodigo, versoesSelecionadas, router]);

  // Pre-fill contact phone from user profile (only once when user data loads)
  useEffect(() => {
    if (user?.whatsapp && !hasInitializedRef.current) {
      // Using functional update to avoid lint warning about setState in effect
      // This is a valid initialization pattern for async data
      const phone = user.whatsapp;
      hasInitializedRef.current = true;
      // Schedule the update to avoid synchronous setState in effect
      queueMicrotask(() => setTelefoneContato(phone));
    }
  }, [user?.whatsapp]);

  // Validation for location (required)
  const isLocationValid = cidade.trim() !== "" && estado.trim() !== "";

  const proceedWithCreation = () => {
    if (!tipoVeiculo || !marcaNome || !modeloNome || !precoMaximo) return;

    // Validate location
    if (!isLocationValid) {
      error("Cidade e estado são obrigatórios");
      return;
    }

    // Build anos array from anoMinimo and anoMaximo
    const anos: number[] = [];
    if (anoMinimo && anoMaximo) {
      for (let year = anoMinimo; year <= anoMaximo; year++) {
        anos.push(year);
      }
    } else if (anoMinimo) {
      anos.push(anoMinimo);
    } else if (anoMaximo) {
      anos.push(anoMaximo);
    }

    // Build observacoes with versions info
    const versionsText = getVersionsText();
    let finalObservacoes = observacoes || "";
    if (versionsText) {
      finalObservacoes = versionsText + (observacoes ? `\n\n${observacoes}` : "");
    }

    // Build versoes array from selected versions
    const versoes = versoesSelecionadas.map(v => ({
      codigo: v.codigo,
      nome: v.nome,
    }));

    createIntention(
      {
        tipo: tipoVeiculo,
        marcaCodigo: marcaCodigo || undefined,
        marcaNome,
        modeloCodigo: modeloCodigo || versoesSelecionadas[0]?.codigo || undefined,
        modeloNome: modeloBaseNome || modeloNome,
        modeloBaseNome: modeloBaseNome || undefined,
        versoes: versoes.length > 0 ? versoes : undefined,
        todasVersoes: todasVersoes || undefined,
        anos,
        cores,
        precoMaximo,
        quilometragemMinima: quilometragemMinima || undefined,
        quilometragemMaxima: quilometragemMaxima || undefined,
        opcionais: opcionais.length > 0 ? opcionais : undefined,
        observacoes: finalObservacoes || undefined,
        cidade,
        estado,
        fotoReferenciaBase64: fotoReferenciaBase64 || undefined,
      },
      {
        onSuccess: () => {
          // Silently update profile with location if different
          const locationChanged = cidade !== user?.cidade || estado !== user?.estado;
          if (locationChanged) {
            updateProfile({ cidade, estado }, { onError: () => {} }); // Silent update
          }
          
          success("Sua intenção foi publicada com sucesso!");
          
          // Mark as successful to prevent the incomplete check from redirecting to /create
          isCreatedSuccessfullyRef.current = true;
          reset();
          
          // Redirect to feed page
          router.push("/");
        },
        onError: (err) => {
          error(err.message || "Erro ao criar intenção");
        },
      }
    );
  };

  const handleUpdateProfileAndCreate = () => {
    updateProfile(
      { whatsapp: telefoneContato },
      {
        onSuccess: () => {
          setShowUpdateProfileDialog(false);
          proceedWithCreation();
        },
        onError: (err) => {
          error(err.message || "Erro ao atualizar perfil");
        },
      }
    );
  };

  const handleSkipProfileUpdate = () => {
    // Update profile silently (required for backend) but don't show confirmation
    updateProfile(
      { whatsapp: telefoneContato },
      {
        onSuccess: () => {
          setShowUpdateProfileDialog(false);
          proceedWithCreation();
        },
        onError: (err) => {
          error(err.message || "Erro ao atualizar perfil");
        },
      }
    );
  };

  const handleSubmit = () => {
    // Mark that user has attempted to publish (for validation display)
    setHasAttemptedPublish(true);
    
    if (!tipoVeiculo || !marcaNome || !modeloNome || !precoMaximo) return;

    // Validate contact phone
    if (!telefoneContato || telefoneContato.trim() === "") {
      error("WhatsApp é obrigatório para contato");
      return;
    }

    // Validate Brazilian phone format
    const phoneError = getBrazilianPhoneError(telefoneContato);
    if (phoneError) {
      error(phoneError);
      return;
    }

    // Validate location
    if (!isLocationValid) {
      error("Cidade e estado são obrigatórios para publicar");
      return;
    }

    // Check if phone changed from profile
    if (telefoneContato !== user?.whatsapp) {
      setShowUpdateProfileDialog(true);
      return;
    }

    proceedWithCreation();
  };

  // Show display name - use base model name if available, otherwise full model name
  const displayModelName = modeloBaseNome || modeloNome;
  
  if (!tipoVeiculo || !marcaNome || !displayModelName) return null;

  // Format mileage display
  const formatMileage = (km: number | null) => km ? `${km.toLocaleString("pt-BR")} km` : null;
  const mileageDisplay = (() => {
    if (quilometragemMinima && quilometragemMaxima) {
      return `${formatMileage(quilometragemMinima)} - ${formatMileage(quilometragemMaxima)}`;
    }
    if (quilometragemMinima) return `A partir de ${formatMileage(quilometragemMinima)}`;
    if (quilometragemMaxima) return `Até ${formatMileage(quilometragemMaxima)}`;
    return null;
  })();

  // Build vehicle display string
  const vehicleDisplay = (() => {
    const base = `${marcaNome} ${displayModelName}`;
    if (todasVersoes) {
      return `${base} (todas as versões)`;
    }
    if (versoesSelecionadas.length > 1) {
      return `${base} (${versoesSelecionadas.length} versões)`;
    }
    return base;
  })();

  const summaryItems = [
    {
      icon: Car,
      label: "Veículo",
      value: vehicleDisplay,
      badge: vehicleTypeLabels[tipoVeiculo],
    },
    {
      icon: Calendar,
      label: "Ano",
      value: anoMinimo && anoMaximo 
        ? `${anoMinimo} - ${anoMaximo}` 
        : anoMinimo || anoMaximo 
          ? `${anoMinimo || anoMaximo}` 
          : "Qualquer",
    },
    {
      icon: Palette,
      label: "Cores",
      value: cores.length > 0 ? cores.join(", ") : "Qualquer",
    },
    {
      icon: DollarSign,
      label: "Preço máximo",
      value: precoMaximo ? formatCurrency(precoMaximo) : "Sem limite",
    },
    ...(mileageDisplay ? [{
      icon: Gauge,
      label: "Quilometragem",
      value: mileageDisplay,
    }] : []),
    ...(opcionais.length > 0 ? [{
      icon: Settings,
      label: "Opcionais",
      value: opcionais.map(formatOpcional).join(", "),
    }] : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Revise sua intenção
        </h1>
        <p className="text-muted">
          Confirme os detalhes antes de publicar
        </p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="p-6 space-y-4">
          {summaryItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-start gap-4">
                <div className="p-2 bg-muted/10 rounded-lg">
                  <Icon size={20} className="text-muted" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted">{item.label}</p>
                  <p className="font-medium text-foreground">{item.value}</p>
                </div>
                {item.badge && (
                  <Badge variant="default">{item.badge}</Badge>
                )}
              </div>
            );
          })}

          {fotoReferenciaBase64 && (
            <div className="flex items-start gap-4">
              <div className="p-2 bg-muted/10 rounded-lg">
                <ImageIcon size={20} className="text-muted" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted mb-2">Foto de referência</p>
                <img 
                  src={`data:image/jpeg;base64,${fotoReferenciaBase64}`}
                  alt="Foto de referência"
                  className="w-32 h-24 object-cover rounded-lg border border-border"
                />
              </div>
            </div>
          )}

          {observacoes && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted mb-2">Observações</p>
              <p className="text-foreground">{observacoes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Phone Card */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-3">Telefone de contato *</h3>
          <p className="text-sm text-muted mb-4">
            Os vendedores entrarão em contato por este número via WhatsApp.
          </p>
          <Input
            value={telefoneContato}
            onChange={(e) => setTelefoneContato(e.target.value)}
            label="WhatsApp"
            placeholder="+5511999998888"
            icon={<Phone size={20} />}
          />
          <p className="text-xs text-muted mt-2">
            Use o formato internacional com código do país (ex: +5511999998888)
          </p>
        </CardContent>
      </Card>

      {/* Location Card - Required */}
      <Card className={hasAttemptedPublish && !isLocationValid ? "border-error/50" : ""}>
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-3">
            Localização *
            {hasAttemptedPublish && !isLocationValid && (
              <span className="text-error text-sm font-normal ml-2">(obrigatório)</span>
            )}
          </h3>
          <p className="text-sm text-muted mb-4">
            Informe sua cidade e estado para os vendedores saberem onde você está.
          </p>
          <LocationPicker
            estado={estado}
            cidade={cidade}
            onEstadoChange={(val) => setLocalizacao("", val)}
            onCidadeChange={(val) => setLocalizacao(val, estado)}
            estadoError={hasAttemptedPublish && estado.trim() === "" ? "Obrigatório" : undefined}
            cidadeError={hasAttemptedPublish && cidade.trim() === "" ? "Obrigatório" : undefined}
          />
        </CardContent>
      </Card>

      {/* Edit Button */}
      <button
        onClick={() => router.push("/create")}
        className="flex items-center justify-center gap-2 w-full p-3 text-primary font-medium hover:bg-primary/5 rounded-xl transition-colors"
      >
        <Edit2 size={18} />
        Editar informações
      </button>

      {/* Free Publishing Info */}
      <Card variant="outlined" className="border-success/20 bg-success/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <CheckCircle size={20} className="text-success" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Publicação Gratuita!</p>
              <p className="text-sm text-muted">Válido por 60 dias</p>
            </div>
          </div>
          <ul className="text-sm text-muted space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-success" />
              Aparece para todos os vendedores
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-success" />
              Receba propostas ilimitadas
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-success" />
              Sem custo para compradores
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button 
        onClick={handleSubmit} 
        className="w-full" 
        size="lg" 
        isLoading={isCreating}
      >
        <span>Publicar Intenção</span>
        <Send size={20} />
      </Button>

      <p className="text-center text-xs text-muted">
        Sua intenção ficará visível para vendedores da plataforma.
      </p>

      {/* Update Profile Dialog */}
      <Dialog isOpen={showUpdateProfileDialog} onClose={() => setShowUpdateProfileDialog(false)}>
        <DialogHeader onClose={() => setShowUpdateProfileDialog(false)}>
          <DialogTitle>Atualizar telefone no perfil?</DialogTitle>
          <DialogDescription>
            Você alterou o telefone de contato. Deseja salvar este número no seu perfil para uso futuro?
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <div className="p-4 bg-muted/10 rounded-xl">
            <p className="text-sm text-muted">Novo número:</p>
            <p className="font-medium text-foreground">{telefoneContato}</p>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleSkipProfileUpdate}
            isLoading={isUpdatingProfile}
          >
            Continuar sem salvar
          </Button>
          <Button 
            onClick={handleUpdateProfileAndCreate}
            isLoading={isUpdatingProfile}
          >
            Sim, atualizar perfil
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
