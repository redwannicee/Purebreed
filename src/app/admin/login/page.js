"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/admin/dashboard");
  }, [loading, user, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/admin/dashboard");
    } catch (err) {
      setError("ভুল ইমেইল অথবা পাসওয়ার্ড।");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-px flex min-h-[70vh] items-center justify-center py-14">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-4 p-6">
        <div className="text-center">
          <span className="text-2xl">🌿</span>
          <h1 className="mt-2 text-xl font-semibold">Purebreed Admin</h1>
          <p className="text-xs text-ink/50">Sign in to manage products &amp; orders</p>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink/70">Email</label>
          <input
            type="email"
            required
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink/70">Password</label>
          <input
            type="password"
            required
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
