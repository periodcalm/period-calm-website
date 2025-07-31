import { create } from "zustand";
import { getSupabaseBrowserClient } from "@/supabase/client";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface ProfileStore {
  profiles: Profile[];
  loading: boolean;
  error: string | null;
  fetchProfiles: () => Promise<void>;
  addProfile: (profile: Omit<Profile, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateProfile: (id: string, updates: Partial<Profile>) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profiles: [],
  loading: false,
  error: null,

  fetchProfiles: async () => {
    set({ loading: true, error: null });
    const supabase = getSupabaseBrowserClient();
    // Only select the columns you need, no quotes
    const { data, error } = await supabase
      .from("profiles")
      .select("id,full_name,email,phone,address,status,notes,created_at,updated_at");
    if (error) set({ error: error.message });
    set({ profiles: (data as unknown as Profile[]) || [], loading: false });
  },

  addProfile: async (profile) => {
    set({ loading: true, error: null });
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("profiles").insert([profile]);
    if (error) set({ error: error.message });
    await get().fetchProfiles();
    set({ loading: false });
  },

  updateProfile: async (id, updates) => {
    set({ loading: true, error: null });
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("profiles").update(updates).eq("id", id);
    if (error) set({ error: error.message });
    await get().fetchProfiles();
    set({ loading: false });
  },

  deleteProfile: async (id) => {
    set({ loading: true, error: null });
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) set({ error: error.message });
    await get().fetchProfiles();
    set({ loading: false });
  },
})); 