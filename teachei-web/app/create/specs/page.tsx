"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { ArrowRight, AlertCircle, Loader2, Camera, X } from "lucide-react";
import { Button, CurrencyInput, Select, MileageInput } from "@/components/ui";
import { useCreateIntentionStore } from "@/stores/create-intention-store";
import { useAvailableFilters } from "@/hooks/use-intentions";
import { vehicleColors, generateYearOptions } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function CreateSpecsPage() {
  const router = useRouter();
  const {
    tipoVeiculo,
    marcaCodigo,
    modeloCodigo,
    anoMinimo,
    anoMaximo,
    cores,
    precoMaximo,
    quilometragemMinima,
    quilometragemMaxima,
    opcionais,
    observacoes,
    fotoReferenciaBase64,
    setAnos,
    setCores,
    setPreco,
    setQuilometragem,
    setOpcionais,
    setObservacoes,
    setFotoReferencia,
  } = useCreateIntentionStore();

  // Reference photo upload
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Fetch available optionals using React Query (consistent with filter-panel)
  const { data: availableFilters, isLoading: loadingOpcionais, error: opcionaisError } = useAvailableFilters(
    tipoVeiculo || null,
    null // Don't filter by marca for optionals
  );
  
  // Debug logging
  console.log('[CreateSpecsPage] tipoVeiculo:', tipoVeiculo, 'loading:', loadingOpcionais, 'error:', opcionaisError, 'opcionais:', availableFilters?.opcionais?.length ?? 'null');
  
  // Get optionals from the API response
  const opcionaisDisponiveis = availableFilters?.opcionais || [];

  // Static year options (no API call needed)
  const allYearOptions = generateYearOptions(30);
  
  // Filter year options based on selection
  const yearOptionsMin = useMemo(() => {
    if (!anoMaximo) return allYearOptions;
    return allYearOptions.filter(opt => parseInt(opt.value) <= anoMaximo);
  }, [allYearOptions, anoMaximo]);
  
  const yearOptionsMax = useMemo(() => {
    if (!anoMinimo) return allYearOptions;
    return allYearOptions.filter(opt => parseInt(opt.value) >= anoMinimo);
  }, [allYearOptions, anoMinimo]);

  // Redirect if no vehicle selected
  useEffect(() => {
    if (!tipoVeiculo || !marcaCodigo || !modeloCodigo) {
      router.push("/create");
    }
  }, [tipoVeiculo, marcaCodigo, modeloCodigo, router]);


  // Validation errors
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      // Remove data URL prefix to get just the base64 content
      const base64Content = base64.split(",")[1];
      setFotoReferencia(base64Content);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setFotoReferencia(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  const handleContinue = () => {
    if (hasValidationErrors) return;
    router.push("/create/review");
  };

  if (!tipoVeiculo || !marcaCodigo || !modeloCodigo) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Especificações desejadas
        </h1>
        <p className="text-muted">
          Defina os detalhes do veículo que você procura
        </p>
      </div>

      {/* Year Range */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Ano do veículo <span className="text-error">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <Select
            options={[{ value: "", label: "A partir de" }, ...yearOptionsMin]}
            value={anoMinimo?.toString() || ""}
            onChange={(e) => setAnos(e.target.value ? parseInt(e.target.value) : null, anoMaximo)}
            placeholder="A partir de"
          />
          <Select
            options={[{ value: "", label: "Até" }, ...yearOptionsMax]}
            value={anoMaximo?.toString() || ""}
            onChange={(e) => setAnos(anoMinimo, e.target.value ? parseInt(e.target.value) : null)}
            placeholder="Até"
          />
        </div>
        <p className="text-xs text-muted">
          Selecione o ano mínimo, máximo ou ambos
        </p>
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Cores preferidas
        </label>
        <div className="flex flex-wrap gap-2">
          {/* "Any color" option */}
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
        {cores.length === 0 && (
          <p className="text-xs text-muted">
            Aceita qualquer cor de veículo
          </p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-1">
        <CurrencyInput
          label="Preço máximo *"
          value={precoMaximo}
          onChange={(value) => setPreco(null, value)}
        />
      </div>

      {/* Mileage Range */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Quilometragem (opcional)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <MileageInput
            placeholder="Mínima"
            value={quilometragemMinima}
            onChange={(value) => setQuilometragem(value, quilometragemMaxima)}
          />
          <MileageInput
            placeholder="Máxima"
            value={quilometragemMaxima}
            onChange={(value) => setQuilometragem(quilometragemMinima, value)}
          />
        </div>
        {mileageRangeError && (
          <div className="flex items-center gap-2 text-error text-sm">
            <AlertCircle size={16} />
            <span>{mileageRangeError}</span>
          </div>
        )}
        <p className="text-xs text-muted">
          Deixe em branco se não tiver preferência de quilometragem
        </p>
      </div>

      {/* Optional Features - only shown when vehicle type is selected */}
      {tipoVeiculo && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Opcionais desejados
          </label>
          {opcionaisError ? (
            <div className="flex items-center gap-2 py-4 text-error">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Erro ao carregar opcionais. Verifique sua conexão.</span>
            </div>
          ) : loadingOpcionais ? (
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
            <div className="py-2 space-y-1">
              <p className="text-sm text-muted">
                Nenhum opcional disponível para este tipo de veículo.
              </p>
              <p className="text-xs text-muted/50">
                Debug: tipo={tipoVeiculo}, filters={JSON.stringify(availableFilters?.opcionais?.length ?? 'null')}
              </p>
            </div>
          )}
          {opcionais.length > 0 && (
            <p className="text-xs text-success">
              {opcionais.length} opcional(is) selecionado(s)
            </p>
          )}
        </div>
      )}

      {!tipoVeiculo && (
        <div className="p-4 bg-surface rounded-xl border border-border">
          <p className="text-sm text-muted text-center">
            Selecione o tipo de veículo para ver os opcionais disponíveis
          </p>
        </div>
      )}

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
              alt="Foto de referência"
              className="w-full h-48 object-cover rounded-xl border border-border"
            />
            <button
              onClick={removePhoto}
              className="absolute top-2 right-2 p-1.5 bg-background/80 hover:bg-background rounded-full text-foreground transition-colors"
            >
              <X size={18} />
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
          Adicione uma foto do modelo que você procura para ajudar vendedores a entenderem sua busca. Máximo 2MB.
        </p>
      </div>

      {/* Notes */}
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

      <Button 
        onClick={handleContinue} 
        className="w-full" 
        size="lg"
        disabled={!!hasValidationErrors || !!hasMissingRequired}
      >
        <span>Continuar</span>
        <ArrowRight size={20} />
      </Button>
    </div>
  );
}
