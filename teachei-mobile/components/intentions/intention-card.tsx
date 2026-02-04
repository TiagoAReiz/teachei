import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { Anuncio } from "@/types";
import { formatPriceRange, formatYearRange, formatRelativeTime, formatMileageRange } from "@/utils/format";

interface IntentionCardProps {
  intention: Anuncio;
  showActions?: boolean;
}

export function IntentionCard({ intention, showActions = true }: IntentionCardProps) {
  const handlePress = () => {
    router.push(`/intention/${intention.id}`);
  };

  const handleRespond = () => {
    router.push(`/intention/${intention.id}`);
  };

  // Get years from veiculo.anos array
  const anos = intention.veiculo?.anos || [];
  const anoMinimo = anos.length > 0 ? Math.min(...anos) : undefined;
  const anoMaximo = anos.length > 0 ? Math.max(...anos) : undefined;
  const yearRange = formatYearRange(anoMinimo, anoMaximo);
  
  // Price - use precoMaximo from veiculo
  const priceRange = formatPriceRange(undefined, intention.veiculo?.precoMaximo);
  
  // Mileage range
  const mileageRange = formatMileageRange(
    intention.veiculo?.quilometragemMinima,
    intention.veiculo?.quilometragemMaxima
  );

  return (
    <Card variant="elevated" className="flex flex-col gap-4">
      {/* Header with time */}
      <View className="flex-row items-center justify-between">
        <Text className="text-xs text-slate-500 dark:text-slate-400">
          {formatRelativeTime(intention.criadoEm)}
        </Text>
        <TouchableOpacity className="p-2">
          <MaterialIcons name="more-horiz" size={24} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <Text className="text-xl font-display-bold text-slate-900 dark:text-white mb-1 leading-tight">
          <Text className="text-primary">Procuro: </Text>
          {intention.veiculo?.marcaNome} {intention.veiculo?.modeloBaseNome || intention.veiculo?.modeloNome}
        </Text>

        {/* Chips */}
        <View className="flex-row flex-wrap gap-2 mt-3 mb-4">
          {yearRange !== "Qualquer ano" && (
            <Chip label={yearRange} />
          )}
          {intention.veiculo?.cores && intention.veiculo.cores.length > 0 && (
            <Chip label={intention.veiculo.cores.slice(0, 2).join(", ")} />
          )}
          {mileageRange && (
            <Chip label={mileageRange} />
          )}
        </View>

        {/* Budget Highlight */}
        {intention.veiculo?.precoMaximo && (
          <View className="flex-row items-center gap-2 mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
            <View className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 items-center justify-center">
              <MaterialIcons name="attach-money" size={18} color="#16a34a" />
            </View>
            <View>
              <Text className="text-xs text-green-700 dark:text-green-400 font-display-medium uppercase tracking-wide">
                Budget Máximo
              </Text>
              <Text className="text-lg font-display-bold text-green-700 dark:text-green-300">
                {priceRange}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Action */}
      {showActions && (
        <Button onPress={handleRespond} fullWidth>
          Responder Oferta
        </Button>
      )}
    </Card>
  );
}



