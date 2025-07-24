import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ログイン",
  description: "TechDash Proにログインして、最先端のダッシュボード体験を始めましょう。",
  robots: {
    index: true,
    follow: true,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
