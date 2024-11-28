import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "VerityHub",
  description: "Manage your Mentorship Program with ease using VerityHub.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="flex justify-between items-center p-4 bg-white shadow-md">
            <div className="flex items-center">
              <Image
                src="/logo.jpg"
                alt="VerityHub Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <h1 className="text-xl font-bold text-orange-600">VerityHub</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/" className="text-gray-700 hover:text-orange-600">
                Home
              </Link>
              <Link href="/features" className="text-gray-700 hover:text-orange-600">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-orange-600">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600">
                Contact
              </Link>
              <Link href="/dashboard" className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800">
                Dashboard
              </Link>
            </nav>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
