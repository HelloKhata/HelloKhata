/**
 * Integration points with the HelloKhata backend.
 *
 * The marketing site never fakes success: if NEXT_PUBLIC_HELLOKHATA_API_URL is not
 * configured, every call resolves to { status: "not-connected" } and the UI says so.
 * Endpoint paths below are placeholders — confirm them against the real API contract.
 */

export type ApiResult = { status: "ok" } | { status: "not-connected" } | { status: "error"; message?: string };

const API_URL = process.env.NEXT_PUBLIC_HELLOKHATA_API_URL?.replace(/\/$/, "") || "";

async function post(path: string, body: unknown): Promise<ApiResult> {
  if (!API_URL) return { status: "not-connected" };
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
    return res.ok ? { status: "ok" } : { status: "error", message: `HTTP ${res.status}` };
  } catch {
    return { status: "error" };
  }
}

export type ContactPayload = { name: string; phone: string; email?: string; business?: string; topic: string; message: string; locale: string };
export type SignInPayload = { identifier: string; password: string };
export type SignUpPayload = {
  businessType: string;
  businessName: string;
  ownerName: string;
  district?: string;
  phone: string;
  email?: string;
  password: string;
  locale: string;
};

export const submitContact = (p: ContactPayload) => post("/v1/public/contact", p);
export const signIn = (p: SignInPayload) => post("/v1/auth/sign-in", p);
export const signUp = (p: SignUpPayload) => post("/v1/auth/sign-up", p);
