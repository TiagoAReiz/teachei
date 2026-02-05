import React, { useState, useCallback } from "react";
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import { SearchBar } from "@/components/layout/search-bar";
import { FilterChips } from "@/components/layout/filter-chips";
import { FilterModal, FilterState } from "@/components/layout/filter-modal";
import { IntentionCard } from "@/components/intentions/intention-card";
import { useIntentions } from "@/hooks/use-intentions";
import { useAuthStore } from "@/stores/auth-store";
import { TipoVeiculo, Anuncio } from "@/types";

// Mock data for development
const MOCK_INTENTIONS: Anuncio[] = [
  {
    id: "1",
    usuarioId: "u1",
    usuario: {
      id: "u1",
      email: "joao@email.com",
      nome: "João Silva",
      role: "BUYER",
      verified: true,
      createdAt: "2023-01-01",
    },
    veiculoInfo: {
      tipoVeiculo: "CARRO",
      marca: "Honda",
      modelo: "Civic Touring",
    },
    anoMinimo: 2019,
    anoMaximo: 2021,
    cores: ["Preto", "Prata"],
    precoMinimo: 100000,
    precoMaximo: 110000,
    transmissao: "Automático",
    status: "ATIVO",
    visualizacoes: 15,
    propostas: 3,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    usuarioId: "u2",
    usuario: {
      id: "u2",
      email: "maria@email.com",
      nome: "Maria Oliveira",
      role: "BUYER",
      verified: false,
      createdAt: "2023-03-01",
    },
    veiculoInfo: {
      tipoVeiculo: "CARRO",
      marca: "Fiat",
      modelo: "Strada Freedom",
    },
    anoMinimo: 2022,
    cores: ["Branca"],
    precoMaximo: 95000,
    observacoes: "Cabine Dupla",
    status: "ATIVO",
    visualizacoes: 8,
    propostas: 1,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    usuarioId: "u3",
    usuario: {
      id: "u3",
      email: "carlos@email.com",
      nome: "Carlos Mendes",
      role: "BUYER",
      verified: true,
      createdAt: "2022-06-01",
    },
    veiculoInfo: {
      tipoVeiculo: "CAMINHAO",
      marca: "Toyota",
      modelo: "Hilux SRX",
    },
    anoMinimo: 2020,
    cores: [],
    precoMaximo: 260000,
    observacoes: "Diesel 4x4",
    status: "ATIVO",
    visualizacoes: 22,
    propostas: 5,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<TipoVeiculo | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    tipo: null,
    opcionais: [],
    precoMin: null,
    precoMax: null,
    anoMin: null,
    anoMax: null,
  });

  // Sync selectedType with filters.tipo
  const handleTypeChange = (type: TipoVeiculo | null) => {
    setSelectedType(type);
    setFilters((prev) => ({ ...prev, tipo: type, opcionais: [] }));
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    setSelectedType(newFilters.tipo);
  };

  // Count active filters (excluding tipo which is shown in chips)
  const activeFiltersCount = filters.opcionais.length +
    (filters.precoMin !== null ? 1 : 0) +
    (filters.precoMax !== null ? 1 : 0) +
    (filters.anoMin !== null ? 1 : 0) +
    (filters.anoMax !== null ? 1 : 0);

  // Use mock data for now - replace with actual API call when backend is ready
  // const { data, isLoading, refetch, fetchNextPage, hasNextPage } = useIntentions({
  //   tipoVeiculo: selectedType || undefined,
  //   search: search || undefined,
  // });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // refetch().finally(() => setRefreshing(false));
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Filter mock data based on search and type
  const filteredIntentions = MOCK_INTENTIONS.filter((item) => {
    if (selectedType && item.veiculoInfo.tipoVeiculo !== selectedType) {
      return false;
    }
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        item.veiculoInfo.marca.toLowerCase().includes(searchLower) ||
        item.veiculoInfo.modelo.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <View
        className="bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between px-6 py-4">
          <View>
            <Text className="text-slate-500 dark:text-slate-400 text-sm font-display-medium">
              Bem-vindo de volta,
            </Text>
            <Text className="text-xl font-display-bold text-slate-900 dark:text-white leading-tight">
              Olá, {user?.role === "SELLER" ? "Vendedor" : user?.nome?.split(" ")[0] || "Comprador"}!
            </Text>
          </View>
          <TouchableOpacity className="relative p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
            <MaterialIcons name="notifications" size={28} color="#1e293b" />
            <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="px-6 pb-2">
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Busque por modelos específicos..."
          />
        </View>

        {/* Filter Chips with Filter Button */}
        <View className="flex-row items-center">
          <View className="flex-1">
            <FilterChips
              selectedType={selectedType}
              onSelectType={handleTypeChange}
            />
          </View>
          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            className="mr-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 relative"
          >
            <MaterialIcons name="tune" size={22} color="#64748b" />
            {activeFiltersCount > 0 && (
              <View className="absolute -top-1 -right-1 w-5 h-5 bg-primary-light rounded-full items-center justify-center">
                <Text className="text-white text-xs font-display-bold">
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApply={handleApplyFilters}
      />

      {/* Feed */}
      <FlatList
        data={filteredIntentions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <IntentionCard intention={item} />}
        contentContainerStyle={{
          padding: 24,
          gap: 20,
          paddingBottom: 100,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center py-12">
            <MaterialIcons name="search-off" size={48} color="#94a3b8" />
            <Text className="text-slate-500 dark:text-slate-400 text-base font-display-medium mt-4">
              Nenhuma intenção encontrada
            </Text>
          </View>
        }
      />
    </View>
  );
}
