'use client'

import Link from "next/link"
import { useState } from "react"
import { BookOpen, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Features", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "About", href: "#" },
  { name: "Contact", href: "#" },
]

export function Topbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky mt-4 top-4 z-50 px-2 md:px-4 md:flex justify-center">
        <div className="rounded-lg  shadow-lg border bg-background/80 backdrop-blur-sm ">
          <div className="flex gap-4 h-16 items-center px-4">
            <Link className="flex items-center justify-center" href="#">
              <BookOpen className="h-6 w-6 mr-2 text-brand" />
              <span className="md:hidden">MMS</span>
            </Link>
            <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  className="text-sm font-medium hover:text-brand dark:hover:text-brand transition-colors"
                  href={item.href}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Button
              asChild
              className="hidden md:inline-flex ml-4 bg-brand hover:bg-brand/90 text-white"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
          {isOpen && (
            <nav className="flex flex-col gap-2 px-4 pb-4 md:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium  hover:text-brand  transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button
                asChild
                className="mt-2 bg-brand hover:bg-brand/90 text-white"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </nav>
          )}
        </div>
    </header>
  )
}