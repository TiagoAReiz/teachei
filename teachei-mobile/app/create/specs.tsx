import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StepIndicator } from "@/components/create/step-indicator";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { useCreateIntentionStore } from "@/stores/create-intention-store";
import { vehiclesService } from "@/services/vehicles";
import { OpcionalOption } from "@/types";

const COLORS = [
  "Branco", "Preto", "Prata", "Cinza", "Vermelho",
  "Azul", "Marrom", "Bege", "Verde", "Amarelo"
];

// Dynamic year options: next year down to 10 years back
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 11 }, (_, i) => currentYear + 1 - i);

const TRANSMISSIONS = ["Automático", "Manual"];
const FUELS = ["Flex", "Gasolina", "Diesel", "Elétrico", "Híbrido"];

export default function SpecsScreen() {
  const insets = useSafeAreaInsets();
  const {
    tipoVeiculo, marca, modelo,
    anoMinimo, anoMaximo, cores, precoMinimo, precoMaximo,
    transmissao, combustivel, opcionais, observacoes,
    setAnoMinimo, setAnoMaximo, setCores, setPrecoMinimo, setPrecoMaximo,
    setTransmissao, setCombustivel, toggleOpcional, setObservacoes,
  } = useCreateIntentionStore();

  const [precoMinimoText, setPrecoMinimoText] = useState("");
  const [precoMaximoText, setPrecoMaximoText] = useState("");
  const [opcionaisDisponiveis, setOpcionaisDisponiveis] = useState<OpcionalOption[]>([]);
  const [loadingOpcionais, setLoadingOpcionais] = useState(false);

  // Load optionals when vehicle type is set
  useEffect(() => {
    if (tipoVeiculo) {
      setLoadingOpcionais(true);
      vehiclesService.getOpcionais(tipoVeiculo)
        .then(setOpcionaisDisponiveis)
        .catch(() => setOpcionaisDisponiveis([]))
        .finally(() => setLoadingOpcionais(false));
    } else {
      setOpcionaisDisponiveis([]);
    }
  }, [tipoVeiculo]);

  const toggleColor = (color: string) => {
    if (cores.includes(color)) {
      setCores(cores.filter((c) => c !== color));
    } else {
      setCores([...cores, color]);
    }
  };

  const handlePrecoMinimoChange = (text: string) => {
    const numericValue = text.replace(/\D/g, "");
    setPrecoMinimoText(numericValue);
    setPrecoMinimo(numericValue ? parseInt(numericValue) : null);
  };

  const handlePrecoMaximoChange = (text: string) => {
    const numericValue = text.replace(/\D/g, "");
    setPrecoMaximoText(numericValue);
    setPrecoMaximo(numericValue ? parseInt(numericValue) : null);
  };

  const handleContinue = () => {
    router.push("/create/review");
  };

  return (
    <View
      className="flex-1 bg-background-light dark:bg-background-dark"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-6 pb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-12 w-12 items-center justify-center rounded-full"
        >
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-display-bold text-slate-900 dark:text-white pr-12">
          Criar Anúncio
        </Text>
      </View>

      {/* Step Indicator */}
      <StepIndicator currentStep={2} totalSteps={4} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Headline */}
        <View className="items-center mb-6">
          <Text className="text-[24px] font-display-extrabold leading-tight text-slate-900 dark:text-white mb-2 text-center">
            Especificações
          </Text>
          <Text className="text-base text-slate-500 dark:text-slate-400 text-center">
            Defina os detalhes do {marca?.nome} {modelo?.nome}
          </Text>
        </View>

        {/* Year Range */}
        <View className="mb-6">
          <Text className="text-sm font-display-semibold text-slate-700 dark:text-slate-300 mb-3">
            Ano desejado
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-xs text-slate-500 mb-2">De</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {YEARS.map((year) => (
                    <Chip
                      key={`min-${year}`}
                      label={String(year)}
                      variant="filter"
                      size="sm"
                      selected={anoMinimo === year}
                      onPress={() => setAnoMinimo(year)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
          <View className="mt-3">
            <Text className="text-xs text-slate-500 mb-2">Até</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {YEARS.map((year) => (
                  <Chip
                    key={`max-${year}`}
                    label={String(year)}
                    variant="filter"
                    size="sm"
                    selected={anoMaximo === year}
                    onPress={() => setAnoMaximo(year)}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Colors */}
        <View className="mb-6">
          <Text className="text-sm font-display-semibold text-slate-700 dark:text-slate-300 mb-3">
            Cores preferidas
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {COLORS.map((color) => (
              <Chip
                key={color}
                label={color}
                variant="filter"
                size="sm"
                selected={cores.includes(color)}
                onPress={() => toggleColor(color)}
              />
            ))}
          </View>
        </View>

        {/* Price Range */}
        <View className="mb-6">
          <Text className="text-sm font-display-semibold text-slate-700 dark:text-slate-300 mb-3">
            Faixa de preço (R$)
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-xs text-slate-500 mb-2">Mínimo</Text>
              <View className="bg-white dark:bg-surface-dark rounded-full border border-slate-200 dark:border-slate-700 h-12 px-4 flex-row items-center">
                <Text className="text-slate-400 mr-2">R$</Text>
                <TextInput
                  value={precoMinimoText}
                  onChangeText={handlePrecoMinimoChange}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  className="flex-1 text-base text-slate-900 dark:text-white"
                />
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-500 mb-2">Máximo</Text>
              <View className="bg-white dark:bg-surface-dark rounded-full border border-slate-200 dark:border-slate-700 h-12 px-4 flex-row items-center">
                <Text className="text-slate-400 mr-2">R$</Text>
                <TextInput
                  value={precoMaximoText}
                  onChangeText={handlePrecoMaximoChange}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  className="flex-1 text-base text-slate-900 dark:text-white"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Transmission */}
        <View className="mb-6">
          <Text className="text-sm font-display-semibold text-slate-700 dark:text-slate-300 mb-3">
            Transmissão
          </Text>
          <View className="flex-row gap-2">
            {TRANSMISSIONS.map((t) => (
              <Chip
                key={t}
                label={t}
                variant="filter"
                selected={transmissao === t}
                onPress={() => setTransmissao(transmissao === t ? null : t)}
              />
            ))}
          </View>
        </View>

        {/* Fuel */}
        <View className="mb-6">
          <Text className="text-sm font-display-semibold text-slate-700 dark:text-slate-300 mb-3">
            Combustível
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {FUELS.map((f) => (
              <Chip
                key={f}
                label={f}
                variant="filter"
                size="sm"
                selected={combustivel === f}
                onPress={() => setCombustivel(combustivel === f ? null : f)}
              />
            ))}
          </View>
        </View>

        {/* Optionals - only shown when vehicle type is selected */}
        {tipoVeiculo && (
          <View className="mb-6">
            <Text className="text-sm font-display-semibold text-slate-700 dark:text-slate-300 mb-3">
              Opcionais desejados
            </Text>
            {loadingOpcionais ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#3b82f6" />
                <Text className="text-sm text-slate-500 mt-2">Carregando opcionais...</Text>
              </View>
            ) : opcionaisDisponiveis.length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {opcionaisDisponiveis.map((op) => (
                  <Chip
                    key={op.codigo}
                    label={op.label}
                    variant="filter"
                    size="sm"
                    selected={opcionais.includes(op.codigo)}
                    onPress={() => toggleOpcional(op.codigo)}
                  />
                ))}
              </View>
            ) : (
              <Text className="text-sm text-slate-500 dark:text-slate-400">
                Nenhum opcional disponível para este tipo de veículo.
              </Text>
            )}
          </View>
        )}

        {!tipoVeiculo && (
          <View className="mb-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <Text className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Selecione o tipo de veículo para ver os opcionais disponíveis
            </Text>
          </View>
        )}

        {/* Notes */}
        <View className="mb-6">
          <Text className="text-sm font-display-semibold text-slate-700 dark:text-slate-300 mb-3">
            Observações (opcional)
          </Text>
          <View className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <TextInput
              value={observacoes}
              onChangeText={setObservacoes}
              placeholder="Ex: Menos de 50.000km, bancos de couro..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="text-base text-slate-900 dark:text-white min-h-[100px]"
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View
        className="absolute bottom-0 left-0 right-0 p-4 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Button
          onPress={handleContinue}
          icon="arrow-forward"
          iconPosition="right"
          fullWidth
          size="lg"
        >
          Revisar
        </Button>
      </View>
    </View>
  );
}



