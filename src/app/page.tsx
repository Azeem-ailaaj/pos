"use client";

import { Navbar } from "@/components/layout/Navbar"
import { Hero } from "@/components/home/Hero"
import { Features } from "@/components/home/Features"
import { Footer } from "@/components/layout/Footer"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Hero />
        <Features />
        
        <section className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                About Ailaaj POS
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Ailaaj aims to develop a robust B2B POS and ERP solution tailored specifically 
                for single-chain and multi-chain pharmacies operating in the retail and hospital 
                pharmacy sectors. This platform will empower pharmacies to manage their operations 
                seamlessly, including procurement, warehousing, inventory control, customer and 
                patient data management, billing, invoicing, and multi-location oversight.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                To achieve a unified operational ecosystem, the system features a universal product 
                catalog and a centralized customer information database, which can be localized for 
                each client, enabling consistent data management across the network.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}