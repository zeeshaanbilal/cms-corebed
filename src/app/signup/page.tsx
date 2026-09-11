"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account. Email might already be in use.");
        setIsLoading(false);
        return;
      }

      // Success! Redirect to login page
      router.push("/login?registered=true");
      
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-core-bg pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl text-core-ink mb-2">Create Account</h1>
          <p className="text-core-muted-foreground">Join CoreBed for exclusive offers and faster checkout.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-core-ink mb-2">First Name</label>
              <input 
                type="text" 
                name="firstName"
                autoComplete="given-name"
                required 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-transparent border border-core-line p-3 rounded-sm focus:outline-none focus:border-core-gold" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-core-ink mb-2">Last Name</label>
              <input 
                type="text" 
                name="lastName"
                autoComplete="family-name"
                required 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-transparent border border-core-line p-3 rounded-sm focus:outline-none focus:border-core-gold" 
              />
            </div>
          </div>
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
            <label className="block text-sm font-medium text-core-ink mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              autoComplete="new-password"
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
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-core-muted-foreground">
          Already have an account? <Link href="/login" className="text-core-ink underline underline-offset-4">Sign in</Link>
        </p>
      </div>
    </div>
  );
}