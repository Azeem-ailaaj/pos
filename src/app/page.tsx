"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch Data Using TanStack Query
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!response.ok) throw new Error("Failed to fetch data");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-sans bg-gray-50">
      {/* ✅ Navbar */}
      <header className="flex justify-between items-center py-4 border-b bg-white shadow-sm px-6 rounded-lg">
        <Image src="/next.svg" alt="Next.js logo" width={120} height={30} priority />
        
        <nav className="relative">
          {status === "loading" ? (
            <p className="text-gray-500">Loading...</p>
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
              >
                {session.user?.name || "User"}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border">
                  <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                  </a>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              <Button onClick={() => signIn()} variant="outline">Sign In</Button>
              <Button asChild>
                <a href="/auth/signup">Sign Up</a>
              </Button>
            </div>
          )}
        </nav>
      </header>

      {/* ✅ Main Content */}
      <main className="flex flex-col gap-8 mt-12 items-center sm:items-start">
        {/* ✅ ShadCN UI Components Test */}
        <Card className="w-full max-w-md bg-white shadow-md rounded-lg">
          <CardContent className="p-4">
            <h1 className="text-xl font-bold">ShadCN UI Test</h1>
            <Input placeholder="Enter something..." className="mt-4" />
            <Button className="mt-4">Click Me</Button>
          </CardContent>
        </Card>

        {/* ✅ TanStack Query Section */}
        <div className="p-6 mt-8 bg-white shadow-md rounded-lg w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">🚀 TanStack Query Example</h1>
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">Error: {error.message}</p>}
          {data && (
            <ul className="space-y-2">
              {data.slice(0, 5).map((post: any) => (
                <li key={post.id} className="border p-4 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold">{post.title}</h2>
                  <p>{post.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* ✅ Footer */}
      <footer className="mt-12 flex gap-6 flex-wrap items-center justify-center border-t pt-4 bg-white shadow-sm rounded-lg p-4">
        <p>&copy; {new Date().getFullYear()} My App</p>
        <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Go to Next.js →</a>
      </footer>
    </div>
  );
}
