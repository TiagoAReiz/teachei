"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  getCurrentUser,
  login,
  register,
  loginWithGoogle,
  logout as logoutUser,
  updateProfile,
  getUserProfile,
  LoginResult,
} from "@/lib/auth";
import { getToken } from "@/lib/api";
import type { LoginRequest, RegisterRequest, AtualizarPerfilRequest } from "@/types";

/**
 * Main authentication hook
 * Handles login, register, logout, and profile management
 */
export function useAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  
  // Get redirect URL from query params (for post-login redirect)
  const redirectUrl = searchParams.get("redirect");

  // Query current user
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: getCurrentUser,
    enabled: !!getToken(),
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (result: LoginResult) => {
      queryClient.setQueryData(["auth", "user"], result.user);
      // Navigate based on role - if no role, show role selection
      if (!result.user.role) {
        router.push("/role-select");
      } else {
        // Use redirect URL if available, otherwise go to home
        router.push(redirectUrl || "/");
      }
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (result: LoginResult) => {
      queryClient.setQueryData(["auth", "user"], result.user);
      // New users always go to role selection
      router.push("/role-select");
    },
  });

  // Google login mutation
  const googleLoginMutation = useMutation({
    mutationFn: (credential: string) => loginWithGoogle(credential),
    onSuccess: (result: LoginResult) => {
      queryClient.setQueryData(["auth", "user"], result.user);
      // Navigate based on role - if no role, show role selection
      if (!result.user.role) {
        router.push("/role-select");
      } else {
        // Use redirect URL if available, otherwise go to home
        router.push(redirectUrl || "/");
      }
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: AtualizarPerfilRequest) => updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["auth", "user"], updatedUser);
    },
  });

  // Logout function
  const logout = useCallback(() => {
    queryClient.clear();
    logoutUser();
  }, [queryClient]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    refetch,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    googleLogin: googleLoginMutation.mutate,
    googleLoginAsync: googleLoginMutation.mutateAsync,
    isGoogleLoggingIn: googleLoginMutation.isPending,
    googleLoginError: googleLoginMutation.error,
    updateProfile: updateProfileMutation.mutate,
    updateProfileAsync: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    logout,
  };
}

/**
 * Hook to get user profile by ID
 */
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });
}
