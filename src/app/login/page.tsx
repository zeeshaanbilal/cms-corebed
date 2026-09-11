"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to login. Check your credentials.");
        setIsLoading(false);
        return;
      }

      // Success, token is stored in httpOnly cookie
      router.push("/account"); // or wherever the dashboard is
      router.refresh();
      
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-core-bg pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl text-core-ink mb-2">Welcome Back</h1>
          <p className="text-core-muted-foreground">Sign in to your CoreBed account.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-core-ink mb-2">Email</label>
            <input 
              type="email" 
              name="email"
              autoComplete="username"
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-core-line p-3 rounded-sm focus:outline-none focus:border-core-gold" 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-core-ink">Password</label>
              <Link href="/forgot-password" className="text-xs text-core-muted-foreground underline">Forgot Password?</Link>
            </div>
            <input 
              type="password" 
              name="password"
              autoComplete="current-password"
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-core-line p-3 rounded-sm focus:outline-none focus:border-core-gold" 
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-core-ink text-white hover:bg-core-ink/90 h-12 rounded-sm text-xs font-semibold tracking-widest uppercase mt-4"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-core-muted-foreground">
          Don't have an account? <Link href="/signup" className="text-core-ink underline underline-offset-4">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
