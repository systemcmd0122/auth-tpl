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
    default: "TechDash Pro - 次世代ダッシュボード",
    template: "%s | TechDash Pro"
  },
  description: "最先端技術を駆使した現代的なダッシュボード。シンプルで直感的なUI/UXと高度なセキュリティを実現。",
  keywords: ["ダッシュボード", "認証", "モダンUI", "技術的", "セキュア", "レスポンシブ"],
  authors: [{ name: "TechDash Pro Team" }],
  creator: "TechDash Pro",
  publisher: "TechDash Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://techdash.pro"),
  openGraph: {
    title: "TechDash Pro - 次世代ダッシュボード",
    description: "最先端技術を駆使した現代的なダッシュボード",
    url: "https://techdash.pro",
    siteName: "TechDash Pro",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechDash Pro - 次世代ダッシュボード",
    description: "最先端技術を駆使した現代的なダッシュボード",
    creator: "@techdashpro",
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
