"use client";

import { useRouter, useParams } from "next/navigation";
import { useMemo, useState, useRef } from "react";
import { ArrowLeft, AlertCircle, Save, Car, Bike, Truck, Camera, X, Loader2 } from "lucide-react";
import { Button, Card, CardContent, CurrencyInput, Select, LocationPicker, MileageInput } from "@/components/ui";
import { useIntention, useUpdateIntention, useAvailableFilters } from "@/hooks/use-intentions";
import { useToast } from "@/components/ui/toast";
import { vehicleColors, generateYearOptions, sanitizeUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { TipoVeiculo, VersaoRequest, Anuncio } from "@/types";

// Vehicle type icons
const vehicleTypeIcons: Record<TipoVeiculo, typeof Car> = {
  CARRO: Car,
  MOTO: Bike,
  CAMINHAO: Truck,
};

const vehicleTypeLabels: Record<TipoVeiculo, string> = {
  CARRO: "Carro",
  MOTO: "Moto",
  CAMINHAO: "Caminhão",
};

// Form component that receives pre-loaded intention data
function EditIntentionForm({ intention }: { intention: Anuncio }) {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const { mutate: updateIntention, isPending: isUpdating } = useUpdateIntention();

  // Compute initial values from intention
  const veiculo = intention.veiculo;
  const contato = intention.contato;

  // Form state - initialized with existing data
  const [anoMinimo, setAnoMinimo] = useState<number | null>(
    veiculo.anos?.length > 0 ? Math.min(...veiculo.anos) : null
  );
  const [anoMaximo, setAnoMaximo] = useState<number | null>(
    veiculo.anos?.length > 0 ? Math.max(...veiculo.anos) : null
  );
  const [cores, setCores] = useState<string[]>(veiculo.cores || []);
  const [precoMaximo, setPrecoMaximo] = useState<number | null>(veiculo.precoMaximo);
  const [quilometragemMinima, setQuilometragemMinima] = useState<number | null>(
    veiculo.quilometragemMinima || null
  );
  const [quilometragemMaxima, setQuilometragemMaxima] = useState<number | null>(
    veiculo.quilometragemMaxima || null
  );
  const [opcionais, setOpcionais] = useState<string[]>(veiculo.opcionais || []);
  const [observacoes, setObservacoes] = useState(intention.observacoes || "");
  const [cidade, setCidade] = useState(contato?.cidade || "");
  const [estado, setEstado] = useState(contato?.estado || "");
  const [todasVersoes] = useState(veiculo.todasVersoes || false);
  const [versoes] = useState<VersaoRequest[]>(
    veiculo.versoes?.map(v => ({ codigo: v.codigo, nome: v.nome })) || []
  );

  // Fetch optionals filtered by vehicle type
  const { data: filteredFilters, isLoading: loadingFiltered } = useAvailableFilters(
    intention.tipo,
    null
  );
  // Also fetch ALL optionals as fallback
  const { data: allFilters, isLoading: loadingAll } = useAvailableFilters(null, null);

  const isLoadingOpcionais = loadingFiltered && loadingAll;
  const opcionaisDisponiveis = useMemo(() => {
    if (filteredFilters?.opcionais && filteredFilters.opcionais.length > 0) {
      return filteredFilters.opcionais;
    }
    if (allFilters?.opcionais && allFilters.opcionais.length > 0) {
      return allFilters.opcionais;
    }
    return [];
  }, [filteredFilters, allFilters]);

  // Reference photo state
  const [fotoReferenciaBase64, setFotoReferenciaBase64] = useState<string | null>(null);
  const [currentPhotoUrl] = useState<string | null>(sanitizeUrl(veiculo.fotoReferenciaUrl) || null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showError("A imagem deve ter no máximo 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      showError("Selecione um arquivo de imagem");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const base64Content = base64.split(",")[1];
      setFotoReferenciaBase64(base64Content);
    };
    reader.readAsDataURL(file);
  };

  const removeNewPhoto = () => {
    setFotoReferenciaBase64(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  // Year options
  const allYearOptions = generateYearOptions(30);
  
  const yearOptionsMin = useMemo(() => {
    if (!anoMaximo) return allYearOptions;
    return allYearOptions.filter(opt => parseInt(opt.value) <= anoMaximo);
  }, [allYearOptions, anoMaximo]);
  
  const yearOptionsMax = useMemo(() => {
    if (!anoMinimo) return allYearOptions;
    return allYearOptions.filter(opt => parseInt(opt.value) >= anoMinimo);
  }, [allYearOptions, anoMinimo]);

  // Validation
  const yearRequiredError = useMemo(() => {
    if (!anoMinimo && !anoMaximo) {
      return "Selecione pelo menos um ano";
    }
    return null;
  }, [anoMinimo, anoMaximo]);

  const priceRequiredError = useMemo(() => {
    if (!precoMaximo) {
      return "Informe o preço máximo";
    }
    return null;
  }, [precoMaximo]);

  const mileageRangeError = useMemo(() => {
    if (quilometragemMinima && quilometragemMaxima && quilometragemMinima > quilometragemMaxima) {
      return "Quilometragem mínima não pode ser maior que máxima";
    }
    return null;
  }, [quilometragemMinima, quilometragemMaxima]);

  const hasValidationErrors = mileageRangeError;
  const hasMissingRequired = yearRequiredError || priceRequiredError;

  const toggleColor = (colorValue: string) => {
    if (cores.includes(colorValue)) {
      setCores(cores.filter((c) => c !== colorValue));
    } else {
      setCores([...cores, colorValue]);
    }
  };

  const toggleOpcional = (opcionalValue: string) => {
    if (opcionais.includes(opcionalValue)) {
      setOpcionais(opcionais.filter((o) => o !== opcionalValue));
    } else {
      setOpcionais([...opcionais, opcionalValue]);
    }
  };

  // Generate years array from range
  const generateYearsArray = (): number[] => {
    if (!anoMinimo && !anoMaximo) return [];
    const min = anoMinimo || anoMaximo!;
    const max = anoMaximo || anoMinimo!;
    const years: number[] = [];
    for (let year = min; year <= max; year++) {
      years.push(year);
    }
    return years;
  };

  const handleSave = () => {
    if (hasValidationErrors || hasMissingRequired) return;

    updateIntention(
      {
        id: intention.id,
        data: {
          versoes: todasVersoes ? [] : versoes,
          todasVersoes,
          anos: generateYearsArray(),
          cores,
          precoMaximo: precoMaximo!,
          quilometragemMinima: quilometragemMinima || undefined,
          quilometragemMaxima: quilometragemMaxima || undefined,
          opcionais,
          observacoes,
          cidade: cidade || undefined,
          estado: estado || undefined,
          fotoReferenciaBase64: fotoReferenciaBase64 || undefined,
        },
      },
      {
        onSuccess: () => {
          success("Intenção atualizada com sucesso!");
          router.push(`/intention/${intention.id}`);
        },
        onError: (err) => {
          showError(err.message || "Erro ao atualizar intenção");
        },
      }
    );
  };

  const VehicleIcon = vehicleTypeIcons[intention.tipo];

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-muted/10 transition-colors"
        >
          <ArrowLeft size={24} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Editar Intenção</h1>
          <p className="text-muted text-sm">Altere os detalhes da sua busca</p>
        </div>
      </div>

      {/* Vehicle Info (readonly) */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <VehicleIcon size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {intention.veiculo.marcaNome} {intention.veiculo.modeloBaseNome || intention.veiculo.modeloNome}
              </p>
              <p className="text-sm text-muted">
                {vehicleTypeLabels[intention.tipo]} - Marca e modelo não podem ser alterados
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable Fields */}
      <div className="space-y-6">
        {/* Year Range */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Ano do veículo <span className="text-error">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Select
              options={[{ value: "", label: "A partir de" }, ...yearOptionsMin]}
              value={anoMinimo?.toString() || ""}
              onChange={(e) => setAnoMinimo(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="A partir de"
            />
            <Select
              options={[{ value: "", label: "Até" }, ...yearOptionsMax]}
              value={anoMaximo?.toString() || ""}
              onChange={(e) => setAnoMaximo(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Até"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Cores preferidas
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCores([])}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-colors",
                cores.length === 0
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted"
              )}
            >
              <div className="w-4 h-4 rounded-full border border-border bg-gradient-to-br from-red-400 via-yellow-400 to-blue-400" />
              <span className={cn("text-sm font-medium", cores.length === 0 ? "text-primary" : "text-foreground")}>
                Qualquer cor
              </span>
            </button>
            {vehicleColors.map((color) => {
              const isSelected = cores.includes(color.value);
              return (
                <button
                  key={color.value}
                  onClick={() => toggleColor(color.value)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted"
                  )}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className={cn("text-sm font-medium", isSelected ? "text-primary" : "text-foreground")}>
                    {color.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price */}
        <CurrencyInput
          label="Preço máximo *"
          value={precoMaximo}
          onChange={(value) => setPrecoMaximo(value)}
        />

        {/* Mileage Range */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Quilometragem (opcional)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <MileageInput
              placeholder="Mínima"
              value={quilometragemMinima}
              onChange={(value) => setQuilometragemMinima(value)}
            />
            <MileageInput
              placeholder="Máxima"
              value={quilometragemMaxima}
              onChange={(value) => setQuilometragemMaxima(value)}
            />
          </div>
          {mileageRangeError && (
            <div className="flex items-center gap-2 text-error text-sm">
              <AlertCircle size={16} />
              <span>{mileageRangeError}</span>
            </div>
          )}
        </div>

        {/* Optionals */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Opcionais desejados
          </label>
          {isLoadingOpcionais ? (
            <div className="flex items-center gap-2 py-4">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted">Carregando opcionais...</span>
            </div>
          ) : opcionaisDisponiveis.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {opcionaisDisponiveis.map((option) => {
                const isSelected = opcionais.includes(option.codigo);
                return (
                  <button
                    key={option.codigo}
                    onClick={() => toggleOpcional(option.codigo)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-left",
                      isSelected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-muted text-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center",
                      isSelected ? "bg-primary border-primary" : "border-muted"
                    )}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted py-2">
              Nenhum opcional disponível para este tipo de veículo.
            </p>
          )}
          {opcionais.length > 0 && (
            <p className="text-xs text-success">
              {opcionais.length} opcional(is) selecionado(s)
            </p>
          )}
        </div>

        {/* Location */}
        <LocationPicker
          estado={estado}
          cidade={cidade}
          onEstadoChange={setEstado}
          onCidadeChange={setCidade}
        />

        {/* Reference Photo */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Foto de referência (opcional)
          </label>
          <input
            type="file"
            ref={photoInputRef}
            onChange={handlePhotoChange}
            accept="image/*"
            className="hidden"
          />
          {fotoReferenciaBase64 ? (
            <div className="relative w-full max-w-xs">
              <img
                src={`data:image/jpeg;base64,${fotoReferenciaBase64}`}
                alt="Nova foto de referência"
                className="w-full h-48 object-cover rounded-xl border border-border"
              />
              <button
                onClick={removeNewPhoto}
                className="absolute top-2 right-2 p-1.5 bg-background/80 hover:bg-background rounded-full text-foreground transition-colors"
              >
                <X size={18} />
              </button>
              <p className="text-xs text-success mt-2">Nova foto (será enviada ao salvar)</p>
            </div>
          ) : currentPhotoUrl ? (
            <div className="space-y-2">
              <img
                src={currentPhotoUrl}
                alt="Foto de referência atual"
                className="w-full max-w-xs h-48 object-cover rounded-xl border border-border"
              />
              <button
                onClick={() => photoInputRef.current?.click()}
                className="text-sm text-primary hover:underline"
              >
                Alterar foto
              </button>
            </div>
          ) : (
            <button
              onClick={() => photoInputRef.current?.click()}
              className="flex flex-col items-center justify-center w-full max-w-xs h-32 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Camera size={32} className="text-muted mb-2" />
              <span className="text-sm text-muted">Adicionar foto</span>
            </button>
          )}
          <p className="text-xs text-muted">
            Adicione uma foto do modelo que você procura. Máximo 2MB.
          </p>
        </div>

        {/* Observations */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Observações adicionais
          </label>
          <textarea
            placeholder="Ex: Procuro versão completa, com teto solar, baixa km..."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={4}
            className="w-full bg-surface border-0 ring-1 ring-border text-foreground placeholder:text-muted rounded-xl p-4 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-base resize-none"
          />
        </div>

        {/* Validation summary */}
        {hasMissingRequired && (
          <div className="p-3 bg-error/10 border border-error/30 rounded-lg">
            <div className="flex items-start gap-2 text-error text-sm">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                {yearRequiredError && <p>{yearRequiredError}</p>}
                {priceRequiredError && <p>{priceRequiredError}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full"
          size="lg"
          isLoading={isUpdating}
          disabled={!!hasValidationErrors || !!hasMissingRequired}
        >
          <Save size={20} />
          <span>Salvar alterações</span>
        </Button>
      </div>
    </div>
  );
}

export default function EditIntentionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { data: intention, isLoading, error } = useIntention(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !intention) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <AlertCircle className="text-error mb-4" size={48} />
        <h2 className="text-xl font-bold text-foreground mb-2">Erro ao carregar</h2>
        <p className="text-muted mb-4">Não foi possível carregar a intenção.</p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    );
  }

  // Render form only when intention is loaded
  return <EditIntentionForm intention={intention} />;
}
