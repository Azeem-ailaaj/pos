'use client'

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'

export default function LogoutSync() {
  useEffect(() => {
    const syncLogout = (event: StorageEvent) => {
      if (event.key === 'logout') {
        signOut({ redirect: false })
      }
    }

    window.addEventListener('storage', syncLogout)
    return () => {
      window.removeEventListener('storage', syncLogout)
    }
  }, [])

  return null
}