import Link from "next/link"
import { Facebook, Linkedin, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link 
            href="https://www.facebook.com/Ailaaj/"
            target="_blank"
            className="text-gray-400 hover:text-gray-500"
          >
            <Facebook className="h-6 w-6" />
          </Link>
          <Link 
            href="https://pk.linkedin.com/company/ailaaj"
            target="_blank"
            className="text-gray-400 hover:text-gray-500"
          >
            <Linkedin className="h-6 w-6" />
          </Link>
          <a 
            href="mailto:info@ailaaj.com"
            className="text-gray-400 hover:text-gray-500 flex items-center gap-2"
          >
            <Mail className="h-6 w-6" />
            info@ailaaj.com
          </a>
          <a 
            href="tel:03218360016"
            className="text-gray-400 hover:text-gray-500 flex items-center gap-2"
          >
            <Phone className="h-6 w-6" />
            0321-8360016
          </a>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-sm leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} Ailaaj. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}