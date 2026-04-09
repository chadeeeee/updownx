const mode = import.meta.env.VITE_MODE || "local";
const API_URL = mode === "host" ? "http://173.242.59.206:4000" : "http://localhost:4000";

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
  surname: string;
  account_id: string;
  email: string;
  created_at: string;
};

export type AuthResponse = {
  user: AppUser;
  token: string;
};

export type LegacyAuthResponse = AppUser;

export type LoginResponse = AuthResponse | LegacyAuthResponse;

export type CreateOrderPayload = {
  userId: number;
  challengeId: string;
  fullName: string;
  email: string;
  country: string;
  city: string;
  paymentMethod: string;
};

export type CreateOrderResponse = {
  id?: number;
  payment_url?: string | null;
  order: {
    id: number;
    user_id: number;
    challenge_id: string;
    challenge_name: string;
    amount: number | string;
    billing_full_name: string;
    billing_email: string;
    country: string;
    city: string;
    payment_method: string;
    status: string;
    created_at: string;
    provider: string | null;
    provider_invoice_id: string | null;
    provider_payment_id: string | null;
    merchant_order_id: string | null;
    payment_url: string | null;
    pay_address?: string | null;
    pay_amount?: string | null;
    pay_currency?: string | null;
  };
  payment?: PaymentRecord | null;
  paymentRecordId?: number | null;
  paymentUrl: string | null;
  payAddress?: string | null;
  payAmount?: string | null;
  payCurrency?: string | null;
  demoMode?: boolean;
  provider: string | null;
  providerInvoiceId: string | null;
  providerPaymentId: string | null;
};

export type PaymentRecord = {
  id: number;
  challenge_order_id: number | null;
  challenge_id: string;
  challenge_name: string;
  amount: number | string;
  billing_full_name: string;
  billing_email: string;
  country: string;
  city: string;
  payment_method: string;
  status: "COMPLETED" | "PENDING" | "CANCELLED";
  provider: string | null;
  provider_invoice_id: string | null;
  provider_payment_id: string | null;
  merchant_order_id: string | null;
  payment_url: string | null;
  pay_address: string | null;
  pay_amount: string | null;
  pay_currency: string | null;
  demo_mode: boolean;
  created_at: string;
  updated_at: string;
};

export type ActiveChallenge = {
  id: number;
  challenge_id: string;
  challenge_name: string;
  balance: number;
  status: string;
  created_at: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem("updownx-token");
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  register: (payload: { name: string; surname: string; email: string; password: string; verificationCode: string; invitationCode: string }) =>
    request<LoginResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  sendCode: (payload: { email: string }) =>
    request<{ success: boolean }>("/api/auth/send-code", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  challenges: () => request<Challenge[]>("/api/challenges"),
  createOrder: (payload: CreateOrderPayload) =>
    request<CreateOrderResponse>("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  accounts: (userId: number) =>
    request<{ user: AppUser | null; orders: Array<{ id: number; challenge_name: string; amount: number; status: string; created_at: string }>; challenges: ActiveChallenge[] }>(
      `/api/accounts/${userId}`,
    ),
  balance: (userId: number) =>
    request<{ balance: number }>(`/api/balance/${userId}`),
  payments: (userId: number) =>
    request<PaymentRecord[]>(`/api/payments/${userId}`),
  payment: (userId: number, paymentId: number) =>
    request<{ payment: PaymentRecord; providerStatus: string | null }>(`/api/payments/${userId}/${paymentId}`),
};
