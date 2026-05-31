"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthRedirectPage() {
  const { isLoaded, userId, sessionClaims } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return

    if (!userId) {
      router.replace('/sign-in')
      return
    }

    const roles = (sessionClaims?.roles as string[] | undefined) ?? []

    if (roles.includes('super_admin')) router.replace('/admin')
    else if (roles.includes('logistics')) router.replace('/dashboard')
    else router.replace('/')
  }, [isLoaded, userId, sessionClaims, router])

  return null
}
