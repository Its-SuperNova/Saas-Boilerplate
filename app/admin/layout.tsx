"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LayoutDashboard, Package, FolderOpen, Loader2 } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/categories",
      label: "Categories",
      icon: FolderOpen,
    },
    {
      href: "/admin/products",
      label: "Products",
      icon: Package,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your store content and settings</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
              const Icon = item.icon

              return (
                <Link key={item.href} href={item.href}>
                  <Button variant={isActive ? "default" : "outline"} size="sm" className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>
        </CardContent>
      </Card>

      <Separator />

      {children}
    </div>
  )
}
