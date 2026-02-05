import React from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/use-auth";
import { formatBrazilianPhoneInput, stripPhoneFormatting } from "@/utils/format";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>\[\]\-_+=~`]).{8,}$/;

const registerSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  senha: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(passwordRegex, "Senha deve conter maiúscula, minúscula, número e caractere especial"),
  confirmarSenha: z.string(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { mutate: register, isPending, error } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    register({
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      telefone: data.telefone ? stripPhoneFormatting(data.telefone) : undefined,
    });
  };

  return (
    <View
      className="flex-1 bg-background-light dark:bg-background-dark"
      style={{ paddingTop: insets.top }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-12 w-12 items-center justify-center rounded-full"
          >
            <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-display-bold text-slate-900 dark:text-white pr-12">
            Criar Conta
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Headlines */}
          <View className="items-center mb-8">
            <Text className="text-[28px] font-display-bold leading-tight text-slate-900 dark:text-white mb-2 text-center">
              Junte-se ao TeAchei
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-base font-display-medium leading-relaxed text-center">
              Crie sua conta para encontrar o veículo dos seus sonhos.
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  icon="person"
                  placeholder="Nome completo"
                  autoCapitalize="words"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.nome?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  icon="mail"
                  placeholder="Endereço de Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="telefone"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  icon="phone"
                  placeholder="+55 (11) 99999-8888"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={(text) => onChange(formatBrazilianPhoneInput(text))}
                  onBlur={onBlur}
                  error={errors.telefone?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="senha"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  icon="lock"
                  placeholder="Senha"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.senha?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmarSenha"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  icon="lock"
                  placeholder="Confirmar senha"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmarSenha?.message}
                />
              )}
            />

            {error && (
              <View className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                <Text className="text-red-600 dark:text-red-400 text-sm text-center">
                  Erro ao criar conta. Tente novamente.
                </Text>
              </View>
            )}

            <Button
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
              icon="arrow-forward"
              iconPosition="right"
              fullWidth
              size="lg"
              className="mt-4"
            >
              Criar Conta
            </Button>
          </View>

          {/* Footer Links */}
          <View className="mt-8 items-center">
            <Text className="text-slate-500 dark:text-slate-400 text-sm">
              Já tem uma conta?{" "}
              <Link href="/(auth)/login" asChild>
                <Text className="text-primary font-display-bold">Entrar</Text>
              </Link>
            </Text>
          </View>

          {/* Terms */}
          <View className="mt-6 items-center">
            <Text className="text-slate-400 dark:text-slate-500 text-xs text-center leading-relaxed">
              Ao criar uma conta, você concorda com nossos{" "}
              <Text className="text-primary">Termos de Serviço</Text> e{" "}
              <Text className="text-primary">Política de Privacidade</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}



