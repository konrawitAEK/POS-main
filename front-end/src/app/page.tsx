'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

const ROLE_ROUTES: Record<string, string> = {
  admin: '/dashboard',
  cashier: '/pos',
}

export default function Home() {
  const router = useRouter()
  const { token, user } = useAuthStore()

  useEffect(() => {
    if (!token) {
      router.replace('/login')
    } else {
      const route = ROLE_ROUTES[user?.role ?? ''] ?? '/dashboard'
      router.replace(route)
    }
  }, [token, user, router])

  return null
}
