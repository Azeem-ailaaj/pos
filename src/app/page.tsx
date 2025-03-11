"use client"; // ✅ This must be the first line

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  // ✅ Fetch Data Using TanStack Query
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!response.ok) throw new Error("Failed to fetch data");
      return response.json();
    },
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {/* ✅ ShadCN UI Components Test */}
        <Card className="w-full max-w-md">
          <CardContent className="p-4">
            <h1 className="text-xl font-bold">ShadCN UI Test</h1>
            <Input placeholder="Enter something..." className="mt-4" />
            <Button className="mt-4">Click Me</Button>
          </CardContent>
        </Card>

        {/* ✅ TanStack Query Section- */}
        <div className="p-6 mt-8">
          <h1 className="text-2xl font-bold mb-4">🚀 TanStack Query Example - azeem testing new update</h1>

          {/* ✅ Handle Loading State */}
          {isLoading && <p>Loading...</p>}

          {/* ✅ Handle Error State */}
          {error && <p className="text-red-500">Error: {error.message}</p>}

          {/* ✅ Render Data */}
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

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
