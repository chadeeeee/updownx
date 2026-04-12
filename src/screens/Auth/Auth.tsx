import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiError, api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useTranslation } from "../../lib/i18n";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

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
  const [sendingCode, setSendingCode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const { t } = useTranslation();

  const normalizeAuthResponse = (
    response: Awaited<ReturnType<typeof api.login>>,
  ) => ("user" in response ? response : { user: response, token: null });

  const closeModal = () => {
    setIsClosingModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      setIsClosingModal(false);
    }, 300); // Wait for exit animation
  };

  const handleGetCode = async () => {
    if (!form.email) {
      setError("Please enter your email first to receive the code.");
      return;
    }
    setError("");
    setSendingCode(true);
    try {
      await api.sendCode({ email: form.email.toLowerCase() });
      setShowSuccessModal(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to send verification code. Try again.");
      }
    } finally {
      setSendingCode(false);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (isRegister && form.password !== form.confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    setLoading(true);

    try {
      const authResponse = isRegister
        ? await api.register({
            name: form.firstName,
            surname: form.lastName,
            email: form.email,
            password: form.password,
            verificationCode: form.verificationCode,
            invitationCode: form.invitationCode,
          })
        : await api.login({ email: form.email, password: form.password });
      const auth = normalizeAuthResponse(authResponse);
      setUser(auth.user, auth.token);
      navigate("/challenge", { replace: true });
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
      <main className="min-h-screen bg-[#05070A] font-['Inter',sans-serif] text-white">
        {/* Top Navigation Bar */}
        <nav className="sticky top-0 z-40 w-full border-b border-[#2cf6c3] bg-[#0b0f14]/95 backdrop-blur">
          <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-[30px]">
            <Link to="/" className="flex items-center">
              <img className="h-8 w-auto object-contain sm:h-[40.29px]" alt="Logo" src="/images/logo.png" />
            </Link>
            <LanguageSwitcher />
          </div>
        </nav>
        <div className="flex min-h-screen w-full" style={{ minHeight: "calc(100vh - 64px)" }}>
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
                {t("auth.reg_title")}
              </h1>
              <p className="mt-3 text-center text-[14px] leading-[22px] text-[#a6aabe]">
                {t("auth.reg_subtitle")}
              </p>

              <div className="mt-10 space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className={labelClassName}>
                      {t("auth.field_name")}
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
                      {t("auth.field_surname")}
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
                    {t("auth.field_email")}
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
                      onClick={(e) => {
                        e.preventDefault();
                        handleGetCode();
                      }}
                      disabled={sendingCode}
                      className="absolute z-10 right-2 top-1/2 h-9 -translate-y-1/2 rounded-[12px] bg-[#00ffa3] px-6 text-[10px] font-black uppercase tracking-[0.5px] text-[#0b0f14] disabled:opacity-50 transition-opacity"
                    >
                      {sendingCode ? t("auth.btn_sending") : t("auth.btn_get_code")}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="verificationCode" className={labelClassName}>
                    {t("auth.field_code")}
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
                      {t("auth.field_password")}
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
                      {t("auth.field_confirm")}
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
                      {t("auth.field_invitation")}
                    </label>
                    <span className="text-[10px] font-medium tracking-[1.1px] text-[#6b7280]">{t("auth.field_optional")}</span>
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
                  t("auth.btn_register")
                )}
              </button>

              <p className="mt-6 text-center text-[14px] leading-[20px] text-[#8b949e]">
                {t("auth.login_link").split("?")[0]}?{" "}
                <Link
                  className="font-semibold text-[#00ffa3] transition-colors hover:text-[#00ec98]"
                  to="/login"
                >
                  {t("auth.login_link").split("?")[1]?.trim() || "Return to login"}
                </Link>
              </p>
            </form>
          </section>
        </div>

        {/* Custom Success Modal */}
        {showSuccessModal && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm ${
            isClosingModal ? "animate-out fade-out duration-300" : "animate-in fade-in duration-300"
          }`}>
            <div className={`w-full max-w-sm rounded-[16px] border border-[#1e2733] bg-[#0b0f14] p-8 text-center shadow-[0_10px_30px_-10px_rgba(0,255,163,0.15)] flex flex-col items-center ${
              isClosingModal ? "animate-out fade-out zoom-out-95 duration-300" : "animate-in slide-in-from-bottom-4 fade-in zoom-in-95 duration-300"
            }`}>
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#00ffa3]/10">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00ffa3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2 className="mb-2 text-[22px] font-bold text-white tracking-[-0.2px]">{t("auth.success_title")}</h2>
              <p className="mb-8 text-[14px] leading-relaxed text-[#8b949e]">
                {t("auth.success_msg")} <br/> <strong className="text-white font-semibold">{form.email}</strong>
              </p>
              <button
                type="button"
                onClick={closeModal}
                className="h-12 w-full rounded-[12px] bg-[#00ffa3] text-[13px] font-black uppercase tracking-[1.5px] text-[#0b0f14] transition-all hover:bg-[#00ec98] shadow-[0_4px_14px_0_rgba(0,255,163,0.25)]"
              >
                {t("auth.success_btn")}
              </button>
            </div>
          </div>
        )}
      </main>
    );
  }

  /* ── Login layout (matches screenshot 1:1) ──────────────────────── */
  return (
    <main className="min-h-screen bg-[#05070A] font-['Inter',sans-serif] text-white">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 w-full border-b border-[#2cf6c3] bg-[#0b0f14]/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-[30px]">
          <Link to="/" className="flex items-center">
            <img className="h-8 w-auto object-contain sm:h-[40.29px]" alt="Logo" src="/images/logo.png" />
          </Link>
          <LanguageSwitcher />
        </div>
      </nav>
      <div className="flex min-h-screen w-full" style={{ minHeight: "calc(100vh - 64px)" }}>
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
            {/* Logo — centered */}
            <div className="mb-5 flex justify-center">
              <Link to="/">
                <img src="/images/logo.png" alt="UPDOWNX" className="h-14 w-auto" />
              </Link>
            </div>

            {/* Heading */}
            <h1 className="mb-10 text-center text-[26px] font-bold leading-[32px] tracking-[-0.3px] text-white">
              {t("auth.login_title")}
            </h1>

            {/* ── Account ID / Login field ──────────────────────── */}
            <div>
              <label htmlFor="email" className={labelClassName}>
                {t("auth.field_email")}
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
                  {t("auth.field_password")}
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
                t("auth.btn_login")
              )}
            </button>

            {/* Sign Up link */}
            <p className="mt-6 text-center text-[14px] leading-[20px] text-[#8b949e]">
              {t("auth.register_link").split("?")[0]}?{" "}
              <Link
                className="font-semibold text-[#00ffa3] transition-colors hover:text-[#00ec98]"
                to="/register"
              >
                {t("auth.register_link").split("?")[1]?.trim() || "Sign Up"}
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};
