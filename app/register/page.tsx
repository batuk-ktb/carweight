'use client'
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" }
    });

    if (res.ok) alert("Амжилттай бүртгэгдлээ, одоо login хий");
    else alert("Бүртгэл амжилтгүй");
  };

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Register</h1>
      <input className="border w-full p-2" placeholder="email" onChange={e => setEmail(e.target.value)} />
      <input className="border w-full p-2" type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />
      <button className="bg-green-600 text-white px-4 py-2" onClick={register}>Register</button>
    </div>
  )
}
