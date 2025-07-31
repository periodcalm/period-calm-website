"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { getSupabaseBrowserClient } from "@/supabase/client"

export interface User {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
  avatar?: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.user) throw error || new Error("No user returned");
        set({
          user: {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || "",
            email: data.user.email || email,
            role: data.user.user_metadata?.role === "ADMIN" ? "ADMIN" : "USER"
          },
          isAuthenticated: true
        });
        return true;
      },

      register: async (name, email, password) => {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error || !data.user) throw error || new Error("No user returned");

        // Insert into profiles table for admin trigger
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id, // Use the same id as auth.users
            full_name: name,
            email: email,
            // You can add more fields if needed
          }
        ]);
        if (profileError) throw profileError;

        set({ user: { id: data.user.id, name, email, role: "USER" }, isAuthenticated: true });
        return true;
      },

      logout: async () => {
        const supabase = getSupabaseBrowserClient();
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } })
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
