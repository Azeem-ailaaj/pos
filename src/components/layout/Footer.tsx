"use client"

import Link from "next/link"
import { Facebook, Linkedin, Mail, Phone } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">About Ailaaj POS</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Next-generation pharmacy management solution empowering single and multi-chain pharmacies 
              with AI-driven operations, seamless inventory control, and intelligent analytics.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="space-y-3">
              <motion.a 
                href="mailto:info@ailaaj.com"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                whileHover={{ x: 5 }}
              >
                <Mail className="h-4 w-4" />
                info@ailaaj.com
              </motion.a>
              <motion.a 
                href="tel:03218360016"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                whileHover={{ x: 5 }}
              >
                <Phone className="h-4 w-4" />
                0321-8360016
              </motion.a>
              <div className="flex gap-4 pt-2">
                <motion.a 
                  href="https://www.facebook.com/Ailaaj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.2 }}
                >
                  <Facebook className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  href="https://pk.linkedin.com/company/ailaaj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.2 }}
                >
                  <Linkedin className="h-5 w-5" />
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Ailaaj. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}