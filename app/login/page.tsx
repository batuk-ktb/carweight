"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) router.push("/dashboard");
    else alert("Invalid credentials");
  };

  return (
    <form onSubmit={handleLogin} className="p-6">
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block mb-2 border px-2 py-1"
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block mb-2 border px-2 py-1"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Login
      </button>
    </form>
  );
}
