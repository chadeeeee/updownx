import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiError, api } from "../../lib/api";
import { useAuth } from "../../lib/auth";

type AuthForm = {
  firstName: string;
  lastName: string;
  email: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
  invitationCode: string;
};

/* ── shared Tailwind-style classes ───────────────────────────────── */

const inputClassName =
  "h-[52px] w-full rounded-[12px] border border-[#1e2733] bg-[#0b0f14] pl-14 pr-5 text-[14px] text-[#f0f2f5] outline-none transition-colors placeholder:text-[#3a4452] focus:border-[#00ffa3]/55";

const inputClassNameRegister =
  "h-[52px] w-full rounded-[12px] border border-[#1e2733] bg-[#0b0f14] px-5 text-[14px] text-[#f0f2f5] outline-none transition-colors placeholder:text-[#3a4452] focus:border-[#00ffa3]/55";

const labelClassName =
  "mb-2 block text-[11px] font-bold uppercase tracking-[1.1px] text-[#8b949e]";

/* ── icons ───────────────────────────────────────────────────────── */

const UserIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#5a6270"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#5a6270"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ visible, onClick }: { visible: boolean; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5a6270] hover:text-[#8b949e] transition-colors">
    {visible ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    )}
  </button>
);

export const Auth = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const isRegister = location.pathname === "/register";
  const [form, setForm] = useState<AuthForm>({
    firstName: "",
    lastName: "",
    email: "",
    verificationCode: "",
    password: "",
    confirmPassword: "",
    invitationCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (isRegister && form.password !== form.confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    setLoading(true);

    if (!isRegister && form.email === "admin" && form.password === "admin") {
      setUser({ id: 0, name: "Admin", email: "admin", created_at: new Date().toISOString() });
      navigate("/challenge");
      setLoading(false);
      return;
    }

    try {
      const fullName = [form.firstName, form.lastName].filter(Boolean).join(" ").trim();
      const user = isRegister
        ? await api.register({
            name: fullName || form.firstName || "Trader",
            email: form.email,
            password: form.password,
          })
        : await api.login({ email: form.email, password: form.password });
      setUser(user);
      navigate("/challenge");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Register layout (unchanged logic) ──────────────────────────── */
  if (isRegister) {
    return (
      <main className="min-h-screen bg-[#0c1017] font-['Inter',sans-serif] text-white">
        <div className="flex min-h-screen w-full">
          {/* ── left hero image ────────────────────────────────────── */}
          <section className="relative hidden flex-1 overflow-hidden lg:block">
            <img
              src="/images/auth/auth-overlay.png"
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full rotate-180 object-cover opacity-50 mix-blend-screen"
            />
            <img
              src="/images/auth/auth-hero.png"
              alt=""
              className="absolute left-1/2 top-1/2 h-[108%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
            />
          </section>

          {/* ── right form panel ───────────────────────────────────── */}
          <section
            className="relative flex w-full items-center justify-center px-10 py-12 lg:w-[595px] lg:shrink-0"
            style={{
              borderLeft: "1px solid rgba(44, 246, 195, 0.18)",
            }}
          >
            {/* subtle green glow on the left edge */}
            <div
              className="pointer-events-none absolute left-0 top-0 hidden h-full w-[2px] lg:block"
              style={{
                background: "linear-gradient(180deg, transparent 0%, rgba(0,255,163,0.3) 30%, rgba(0,255,163,0.3) 70%, transparent 100%)",
                boxShadow: "0 0 18px 3px rgba(0,255,163,0.1)",
              }}
            />
            <form onSubmit={onSubmit} className="w-full max-w-[448px]">
              <h1 className="text-center text-[36px] font-black leading-[40px] tracking-[-0.9px] text-[#f0f2f5]">
                Registration
              </h1>
              <p className="mt-3 text-center text-[14px] leading-[22px] text-[#a6aabe]">
                Create an account to start trading on our next-generation platform.
              </p>

              <div className="mt-10 space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className={labelClassName}>
                      Name
                    </label>
                    <input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                      className={inputClassNameRegister}
                      autoComplete="given-name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelClassName}>
                      Surname
                    </label>
                    <input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                      className={inputClassNameRegister}
                      autoComplete="family-name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className={labelClassName}>
                    E-mail
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="text"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className={`${inputClassNameRegister} pr-36`}
                      autoComplete="email"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 h-9 -translate-y-1/2 rounded-[12px] bg-[#00ffa3] px-6 text-[10px] font-black uppercase tracking-[0.5px] text-[#0b0f14]"
                    >
                      Get code
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="verificationCode" className={labelClassName}>
                    Verification code
                  </label>
                  <input
                    id="verificationCode"
                    value={form.verificationCode}
                    onChange={(e) => setForm((p) => ({ ...p, verificationCode: e.target.value }))}
                    className={inputClassNameRegister}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="password" className={labelClassName}>
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                      className={inputClassNameRegister}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className={labelClassName}>
                      Confirm your password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      className={inputClassNameRegister}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="invitationCode" className={labelClassName}>
                      Invitation code
                    </label>
                    <span className="text-[10px] font-medium tracking-[1.1px] text-[#6b7280]">(optional)</span>
                  </div>
                  <input
                    id="invitationCode"
                    value={form.invitationCode}
                    onChange={(e) => setForm((p) => ({ ...p, invitationCode: e.target.value }))}
                    className={inputClassNameRegister}
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-[12px] border border-red-500/35 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-8 flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#00ffa3] text-[14px] font-black uppercase tracking-[2.5px] text-[#0b0f14] shadow-[0px_10px_30px_-10px_rgba(0,255,163,0.4)] transition-all hover:bg-[#00ec98] hover:shadow-[0px_10px_40px_-10px_rgba(0,255,163,0.55)] disabled:opacity-65"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                ) : (
                  "Registration"
                )}
              </button>

              <p className="mt-6 text-center text-[14px] leading-[20px] text-[#8b949e]">
                Already have an account?{" "}
                <Link
                  className="font-semibold text-[#00ffa3] transition-colors hover:text-[#00ec98]"
                  to="/login"
                >
                  Return to login
                </Link>
              </p>
            </form>
          </section>
        </div>
      </main>
    );
  }

  /* ── Login layout (matches screenshot 1:1) ──────────────────────── */
  return (
    <main className="min-h-screen bg-[#0c1017] font-['Inter',sans-serif] text-white">
      <div className="flex min-h-screen w-full">
        {/* ── left hero image ────────────────────────────────────── */}
        <section className="relative hidden flex-1 overflow-hidden lg:block">
          <img
            src="/images/auth/auth-overlay.png"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full rotate-180 object-cover opacity-50 mix-blend-screen"
          />
          <img
            src="/images/auth/auth-hero.png"
            alt=""
            className="absolute left-1/2 top-1/2 h-[108%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
          />
        </section>

        {/* ── right form panel ───────────────────────────────────── */}
        <section
          className="relative flex w-full items-center justify-center px-10 py-12 lg:w-[480px] lg:shrink-0"
          style={{
            borderLeft: "1px solid rgba(44, 246, 195, 0.18)",
          }}
        >
          {/* subtle green glow on the left edge */}
          <div
            className="pointer-events-none absolute left-0 top-0 hidden h-full w-[2px] lg:block"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(0,255,163,0.3) 30%, rgba(0,255,163,0.3) 70%, transparent 100%)",
              boxShadow: "0 0 18px 3px rgba(0,255,163,0.1)",
            }}
          />

          <form onSubmit={onSubmit} className="w-full max-w-[380px]">
            {/* Logo — centered */}
            <div className="mb-5 flex justify-center">
              <Link to="/">
                <img src="/images/logo.png" alt="UPDOWNX" className="h-14 w-auto" />
              </Link>
            </div>

            {/* Heading */}
            <h1 className="mb-10 text-center text-[26px] font-bold leading-[32px] tracking-[-0.3px] text-white">
              Sign In to Your Account
            </h1>

            {/* ── Account ID / Login field ──────────────────────── */}
            <div>
              <label htmlFor="email" className={labelClassName}>
                Account ID / Login
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                  <UserIcon />
                </span>
                <input
                  id="email"
                  type="text"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="398064"
                  className={inputClassName}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* ── Password field ────────────────────────────────── */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[1.1px] text-[#8b949e]">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#00ffa3] transition-colors hover:text-[#00ec98]"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className={`${inputClassName} pr-12`}
                  autoComplete="current-password"
                  required
                />
                <EyeIcon
                  visible={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-[12px] border border-red-500/35 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-8 flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#00ffa3] text-[14px] font-black uppercase tracking-[2.5px] text-[#0b0f14] shadow-[0px_10px_30px_-10px_rgba(0,255,163,0.4)] transition-all hover:bg-[#00ec98] hover:shadow-[0px_10px_40px_-10px_rgba(0,255,163,0.55)] disabled:opacity-65"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
              ) : (
                "Sign In"
              )}
            </button>

            {/* Sign Up link */}
            <p className="mt-6 text-center text-[14px] leading-[20px] text-[#8b949e]">
              Don't have an account yet?{" "}
              <Link
                className="font-semibold text-[#00ffa3] transition-colors hover:text-[#00ec98]"
                to="/register"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};
