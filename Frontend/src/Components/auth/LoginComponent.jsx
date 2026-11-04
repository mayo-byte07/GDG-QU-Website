import { useState } from "react";

const LoginComponent = ({ onSubmit, isLoading, authUnavailable, errorMessage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <main className="relative min-h-[70vh] w-full overflow-hidden bg-gray-50 px-4 py-24 flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(66,133,244,.18),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(52,168,83,.15),transparent_45%)]" />

      <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/70 bg-white/75 p-8 shadow-xl backdrop-blur-xl sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600">A</div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin access</h1>
          <p className="mt-2 text-sm font-medium tracking-wide text-slate-500">GDG QUANTUM UNIVERSITY</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter your password"
            />
          </div>

          {authUnavailable && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Set the Supabase URL and publishable key to enable admin sign-in.</p>}
          {errorMessage && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{errorMessage}</p>}

          <button
            type="submit"
            disabled={isLoading || authUnavailable}
            className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Checking access…" : "Sign in to admin"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">Admin accounts are created by an administrator.</p>
      </section>
    </main>
  );
};

export default LoginComponent;
