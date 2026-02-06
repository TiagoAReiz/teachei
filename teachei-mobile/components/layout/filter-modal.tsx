import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { TipoVeiculo, OpcionalOption } from "@/types";
import { vehiclesService } from "@/services/vehicles";

interface FilterState {
  tipo: TipoVeiculo | null;
  opcionais: string[];
  precoMin: number | null;
  precoMax: number | null;
  anoMin: number | null;
  anoMax: number | null;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
}

const VEHICLE_TYPES: { type: TipoVeiculo; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { type: "CARRO", label: "Carros", icon: "directions-car" },
  { type: "MOTO", label: "Motos", icon: "two-wheeler" },
  { type: "CAMINHAO", label: "Caminhões", icon: "local-shipping" },
];

export function FilterModal({ visible, onClose, filters, onApply }: FilterModalProps) {
  const insets = useSafeAreaInsets();
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [opcionais, setOpcionais] = useState<OpcionalOption[]>([]);
  const [loadingOpcionais, setLoadingOpcionais] = useState(false);

  // Sync local filters with props when modal opens
  useEffect(() => {
    if (visible) {
      setLocalFilters(filters);
    }
  }, [visible, filters]);

  // Load optionals when vehicle type changes (or all when no type selected)
  useEffect(() => {
    setLoadingOpcionais(true);
    vehiclesService
      .getOpcionais(localFilters.tipo)
      .then(setOpcionais)
      .catch(() => setOpcionais([]))
      .finally(() => setLoadingOpcionais(false));
  }, [localFilters.tipo]);

  const handleTipoChange = (tipo: TipoVeiculo | null) => {
    // Clear optionals when changing vehicle type
    setLocalFilters((prev) => ({
      ...prev,
      tipo,
      opcionais: [],
    }));
  };

  const toggleOpcional = (codigo: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      opcionais: prev.opcionais.includes(codigo)
        ? prev.opcionais.filter((o) => o !== codigo)
        : [...prev.opcionais, codigo],
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleClear = () => {
    const cleared: FilterState = {
      tipo: null,
      opcionais: [],
      precoMin: null,
      precoMax: null,
      anoMin: null,
      anoMax: null,
    };
    setLocalFilters(cleared);
  };

  const activeFiltersCount =
    (localFilters.tipo ? 1 : 0) +
    localFilters.opcionais.length +
    (localFilters.precoMin !== null ? 1 : 0) +
    (localFilters.precoMax !== null ? 1 : 0) +
    (localFilters.anoMin !== null ? 1 : 0) +
    (localFilters.anoMax !== null ? 1 : 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 bg-background-light dark:bg-background-dark"
        style={{ paddingTop: insets.top }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <TouchableOpacity onPress={onClose} className="p-2 -ml-2">
            <MaterialIcons name="close" size={24} color="#64748b" />
          </TouchableOpacity>
          <Text className="text-lg font-display-bold text-slate-900 dark:text-white">
            Filtros
          </Text>
          <TouchableOpacity onPress={handleClear} className="p-2 -mr-2">
            <Text className="text-primary-light font-display-medium">Limpar</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
          {/* Vehicle Type */}
          <View className="mb-6">
            <Text className="text-sm font-display-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
              Tipo de Veículo
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <TouchableOpacity
                onPress={() => handleTipoChange(null)}
                className={`flex-row items-center px-4 py-2.5 rounded-full ${
                  localFilters.tipo === null
                    ? "bg-primary-light"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                <Text
                  className={`font-display-medium ${
                    localFilters.tipo === null
                      ? "text-white"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  Todos
                </Text>
              </TouchableOpacity>
              {VEHICLE_TYPES.map((item) => (
                <TouchableOpacity
                  key={item.type}
                  onPress={() => handleTipoChange(item.type)}
                  className={`flex-row items-center gap-2 px-4 py-2.5 rounded-full ${
                    localFilters.tipo === item.type
                      ? "bg-primary-light"
                      : "bg-slate-100 dark:bg-slate-800"
                  }`}
                >
                  <MaterialIcons
                    name={item.icon}
                    size={18}
                    color={localFilters.tipo === item.type ? "#fff" : "#64748b"}
                  />
                  <Text
                    className={`font-display-medium ${
                      localFilters.tipo === item.type
                        ? "text-white"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Optionals */}
          <View className="mb-6">
            <Text className="text-sm font-display-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
              Opcionais
            </Text>
            {!localFilters.tipo ? (
              <Text className="text-slate-500 dark:text-slate-400 text-sm">
                Selecione um tipo de veículo para ver os opcionais
              </Text>
            ) : loadingOpcionais ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator size="small" color="#6366f1" />
                <Text className="text-slate-500 dark:text-slate-400 text-sm">
                  Carregando opcionais...
                </Text>
              </View>
            ) : opcionais.length > 0 ? (
              <View className="gap-2">
                {opcionais.map((opcional) => {
                  const isSelected = localFilters.opcionais.includes(opcional.codigo);
                  return (
                    <TouchableOpacity
                      key={opcional.codigo}
                      onPress={() => toggleOpcional(opcional.codigo)}
                      className={`flex-row items-center gap-3 px-4 py-3 rounded-xl border ${
                        isSelected
                          ? "border-primary-light bg-primary-light/5"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <View
                        className={`w-5 h-5 rounded items-center justify-center ${
                          isSelected
                            ? "bg-primary-light"
                            : "border-2 border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {isSelected && (
                          <MaterialIcons name="check" size={14} color="#fff" />
                        )}
                      </View>
                      <Text
                        className={`flex-1 font-display-medium ${
                          isSelected
                            ? "text-primary-light"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {opcional.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <Text className="text-slate-500 dark:text-slate-400 text-sm">
                Nenhum opcional disponível para este tipo de veículo.
              </Text>
            )}
          </View>

          {/* Selected filters count */}
          {localFilters.opcionais.length > 0 && (
            <View className="mb-6 p-3 bg-primary-light/10 rounded-xl">
              <Text className="text-primary-light font-display-medium text-sm">
                {localFilters.opcionais.length} opcional(is) selecionado(s)
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View
          className="px-6 py-4 border-t border-slate-200 dark:border-slate-700"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <Button onPress={handleApply} variant="primary" size="lg" className="w-full">
            {activeFiltersCount > 0
              ? `Aplicar ${activeFiltersCount} filtro(s)`
              : "Aplicar filtros"}
          </Button>
        </View>
      </View>
    </Modal>
  );
}

export type { FilterState };
