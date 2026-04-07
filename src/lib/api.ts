const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

export class ApiError extends Error {
  status?: number;
  raw?: string;
}

export type Challenge = {
  id: string;
  name: string;
  balance: number;
  fee: number;
};

export type AppUser = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });
  } catch (error) {
    const networkError = new ApiError("Network error. API is unreachable.");
    networkError.raw = String(error);
    throw networkError;
  }

  if (!response.ok) {
    const bodyText = await response.text();
    let message = bodyText || "Request failed";
    try {
      const parsed = JSON.parse(bodyText) as { message?: string };
      if (parsed.message) {
        message = parsed.message;
      }
    } catch {
      // Keep plain text fallback if response is not JSON.
    }
    const apiError = new ApiError(message);
    apiError.status = response.status;
    apiError.raw = bodyText;
    throw apiError;
  }
  return response.json() as Promise<T>;
}

export const api = {
  register: (payload: { name: string; email: string; password: string }) =>
    request<AppUser>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    request<AppUser>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  sendCode: (payload: { email: string }) =>
    request<{ success: boolean; code: string }>("/api/auth/send-code", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  challenges: () => request<Challenge[]>("/api/challenges"),
  createOrder: (payload: {
    userId: number;
    challengeId: string;
    country: string;
    city: string;
    paymentMethod: string;
  }) =>
    request("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  accounts: (userId: number) =>
    request<{ user: AppUser | null; orders: Array<{ id: number; challenge_name: string; amount: number; status: string; created_at: string }> }>(
      `/api/accounts/${userId}`,
    ),
  payments: (userId: number) =>
    request<Array<{ id: number; challenge_name: string; amount: number; payment_method: string; status: string; created_at: string }>>(
      `/api/payments/${userId}`,
    ),
};
