const STORAGE_KEY = "smartfinance.onboarding-seen";

/** Vale por aparelho. Se o navegador bloquear o armazenamento, a introdução apenas reaparece. */
export function hasSeenOnboarding() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function markOnboardingSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Sem armazenamento disponível não há o que guardar.
  }
}
