"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen font-sans bg-gray-50">
      {/* Hero Section with Navbar */}
      <div className="bg-gradient-to-b from-blue-500 to-blue-600 text-white">
        {/* Navbar */}
        <header className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="/next.svg" alt="Next.js logo" width={120} height={30} priority className="bg-white p-2 rounded" />
          </div>
          
          <nav className="relative">
            {status === "loading" ? (
              <div className="animate-pulse h-8 w-20 bg-white/20 rounded-lg"></div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition"
                >
                  <span>{session.user?.name || "User"}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg border overflow-hidden z-10">
                    <a href="/profile" className="block px-4 py-2 hover:bg-gray-100 transition">
                      Profile
                    </a>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        signOut();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition border-t"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-2">
                <Button onClick={() => signIn()} variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  Sign In
                </Button>
                <Button asChild className="bg-white text-blue-600 hover:bg-white/90">
                  <a href="/auth/signup">Sign Up</a>
                </Button>
              </div>
            )}
          </nav>
        </header>

        {/* Hero Content */}
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our Platform</h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">A modern application built with Next.js, Prisma, and ShadcnUI</p>
            {!session && (
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                  <a href="/auth/signup">Get Started</a>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                  <a href="/about">Learn More</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Features Card */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="text-blue-700">ShadCN UI Components</CardTitle>
              <CardDescription>Beautiful, accessible UI components</CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid gap-4">
              <div className="space-y-4">
                <Input placeholder="Enter your email..." className="border-blue-200 focus-visible:ring-blue-500/30" />
                <div className="flex gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Submit</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Card */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="text-blue-700">TanStack Query Example</CardTitle>
              <CardDescription>Fetching data made easy</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading && (
                <div className="flex flex-col gap-4 animate-pulse">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-20 bg-gray-100 rounded-lg"></div>
                  ))}
                </div>
              )}
              {error && <p className="text-red-500 p-4 bg-red-50 rounded-lg">Error: {error.message}</p>}
              {data && (
                <ul className="space-y-3">
                  {data.slice(0, 3).map((post: any) => (
                    <li key={post.id} className="border p-3 rounded-lg hover:shadow-md transition">
                      <h3 className="text-md font-medium text-gray-800 capitalize">{post.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{post.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Status Section */}
        <div className="mt-12 p-8 bg-white shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Your Account Status</h2>
          {status === "loading" ? (
            <p>Checking authentication status...</p>
          ) : session ? (
            <div>
              <p className="text-green-600 font-medium mb-3">You are signed in as {session.user?.name || session.user?.email}</p>
              <Button onClick={() => signOut()} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                Sign Out
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-3">You are not currently signed in</p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => signIn()} variant="outline">
                  Sign In
                </Button>
                <Button asChild>
                  <a href="/auth/signup">Create Account</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} My Next.js App</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition">Next.js</a>
              <a href="https://prisma.io" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition">Prisma</a>
              <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition">ShadCN UI</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}