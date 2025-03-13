"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function Hero() {
  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document.querySelector('#features')?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  return (
    <div 
      className="relative isolate bg-cover bg-center bg-no-repeat py-16"
      style={{
        backgroundImage: "url('/images/ailaaj-cover.png')",
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backgroundBlendMode: 'overlay'
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-4xl px-6 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
          Transform Your Pharmacy with
          <span className="text-blue-600"> AI-Powered </span>
          NextGen Retail
        </h1>
        <div className="mt-8">
          <div className="text-left max-w-2xl mx-auto space-y-4">
            {[
              "🤖 AI-driven inventory optimization & demand forecasting",
              "🔄 Real-time multi-location synchronization",
              "📊 Smart analytics & business intelligence",
              "💊 Intelligent prescription management & tracking",
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.3, duration: 0.8 }}
                className="flex items-center gap-2 text-lg"
              >
                <span className="text-gray-700 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-10 flex items-center justify-center gap-x-6"
        >
          <Link href="/auth/signup">
            <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features" onClick={scrollToFeatures}>
            <Button 
              variant="outline" 
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Learn more
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}