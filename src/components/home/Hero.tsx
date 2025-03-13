"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.5,  // Increased from 0.3
        duration: 0.8         // Added overall duration
      } 
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,    // Slowed down from default
        ease: "easeOut"   // Smooth easing
      }
    }
  }

  return (
    <div className="relative isolate">
      <div 
        className="absolute inset-0 -z-10 opacity-15 transition-opacity"
        style={{
          backgroundImage: `url('/images/ailaaj-cover.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
        <motion.div 
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            variants={itemVariants}
          >
            Transform Your Pharmacy with
            <span className="text-blue-600"> AI-Powered </span>
            NextGen Retail
          </motion.h1>
          
          <motion.p 
            className="mt-4 text-lg text-gray-600"
            variants={itemVariants}
          >
            Revolutionize pharmacy management with intelligent automation, predictive analytics, and seamless operations
          </motion.p>

          <motion.div 
            className="mt-8"
            variants={itemVariants}
          >
            <div className="text-left max-w-2xl mx-auto space-y-4">
              {[
                "🤖 AI-driven inventory optimization & demand forecasting",
                "🔄 Real-time multi-location synchronization",
                "📊 Smart analytics & business intelligence",
                "💊 Intelligent prescription management & tracking",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.3,     // Increased from 0.2
                    duration: 0.8,          // Slowed down animation
                    ease: "easeOut"         // Smooth easing
                  }}
                >
                  <span className="text-blue-600 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="mt-10 flex items-center justify-center gap-x-6"
            variants={itemVariants}
          >
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="ghost" size="lg">
                Learn more
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}