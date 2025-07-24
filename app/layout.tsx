import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { StartupProvider } from "@/contexts/startup-context"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "auth-tpl -- create_by_Next.js",
    template: "%s | auth-tpl"
  },
  description: "auth-tpl -- create_by_Next.js",
  keywords: ["auth-tpl", "Next.js", "auth-tpl -- create_by_Next.js", "next.js auth tpl"],
  authors: [{ name: "TechDash Pro Team" }],
  creator: "Tisk_01010100",
  publisher: "Tisk_01010100",
  formatDetection: {
    email: "Tisk.address@gmail.com",
    address: "Japan",
    telephone: false,
  },
  metadataBase: new URL("https://auth-tpl.vercel.app/"),
  openGraph: {
    title: "auth-tpl -- create_by_Next.js",
    description: "Next.jsとFirebaseを使用した認証テンプレートサイト",
    url: "https://auth-tpl.vercel.app/",
    siteName: "auth-tpl",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "auth-tpl -- create_by_Next.js",
    description: "Next.jsとFirebaseを使用した認証テンプレートサイト",
    creator: "@Tisk_01010100",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: 'TechDash Pro v2.0'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <StartupProvider>
            <AuthProvider>{children}</AuthProvider>
          </StartupProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
