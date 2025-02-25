const TOKEN_KEY = "auth_token";
const AUTH_STATE = "isAuthenticated";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(AUTH_STATE, "true");
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_STATE);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_STATE) === "true" && !!getToken();
}

export async function signIn(token: string): Promise<void> {
  setToken(token);
}

export async function signOut(): Promise<void> {
  clearToken();
}

// Helper function to get authorization headers
export function getAuthHeaders(): HeadersInit {
  const token = getToken();
  if (!token) return {};
  
  return {
    Authorization: `Bearer ${token}`,
  };
}