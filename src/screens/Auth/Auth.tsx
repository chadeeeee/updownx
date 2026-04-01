import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiError, api } from "../../lib/api";
import { useAuth } from "../../lib/auth";

export const Auth = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const isRegister = location.pathname === "/register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = isRegister
        ? await api.register(form)
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

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#02060c] px-4 font-['Inter',sans-serif] text-white">
      {/* BG */}
      <img
        src="/images/bg-lines.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <img
        src="/images/bg-lines1.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-11 mix-blend-screen"
      />

      <div className="pointer-events-none absolute -top-32 left-1/3 h-[600px] w-[600px] rounded-full bg-[#00ffa3]/6 blur-[140px]" />

      <form
        onSubmit={onSubmit}
        className="relative z-10 w-full max-w-[440px] rounded-3xl border border-[#1e3a42]/60 bg-[#08141c]/90 p-8 shadow-2xl backdrop-blur-sm"
      >
        {/* Back link */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-[#6e8a94] transition-colors hover:text-white"
        >
          ← Back to Home
        </Link>

        {/* Logo */}
        {/* Logo */}
        <div className="mb-4">
          <img src="/images/logo.png" alt="UPDOWNX" className="h-10 w-auto object-contain" />
        </div>

        <h1 className="mb-6 text-3xl font-bold tracking-tight">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h1>

        <div className="space-y-4">
          {isRegister && (
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#6e8a94]">
                Full Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="h-12 w-full rounded-xl border border-[#1e3a42] bg-[#050f15] px-4 text-sm text-white outline-none transition-colors placeholder:text-[#3a5560] focus:border-[#00FFA3]/50"
                placeholder="Alex Trader"
                required
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#6e8a94]">
              E-mail Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="h-12 w-full rounded-xl border border-[#1e3a42] bg-[#050f15] px-4 text-sm text-white outline-none transition-colors placeholder:text-[#3a5560] focus:border-[#00FFA3]/50"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#6e8a94]">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className="h-12 w-full rounded-xl border border-[#1e3a42] bg-[#050f15] px-4 text-sm text-white outline-none transition-colors placeholder:text-[#3a5560] focus:border-[#00FFA3]/50"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#00FFA3] text-base font-bold text-black transition-all hover:bg-[#00e895] hover:shadow-[0_0_20px_rgba(0,255,163,0.25)] disabled:opacity-60"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
          ) : isRegister ? (
            "Create Account"
          ) : (
            "Sign In"
          )}
        </button>

        <p className="mt-5 text-center text-sm text-[#6e8a94]">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            className="font-medium text-[#00FFA3] transition-colors hover:text-[#00e895]"
            to={isRegister ? "/login" : "/register"}
          >
            {isRegister ? "Sign In" : "Create Account"}
          </Link>
        </p>
      </form>
    </main>
  );
};
