import { api } from "@/services/api-client";
import type { UserPreferences } from "@/types";

type PreferencesResponse = { preferences: UserPreferences };

export const getPreferences = () => api<PreferencesResponse>("/preferences").then(({ preferences }) => preferences);

export const savePreferences = (body: UserPreferences) =>
  api<PreferencesResponse>("/preferences", { method: "PUT", body }).then(({ preferences }) => preferences);
