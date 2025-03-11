"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Signup failed");
      setLoading(false);
      return;
    }

    router.push("/auth/signin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Sign Up</h2>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
