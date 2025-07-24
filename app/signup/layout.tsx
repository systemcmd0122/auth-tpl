import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "アカウント作成",
  description: "TechDash Proのアカウントを作成して、最先端の技術的ダッシュボードを体験してください。",
  robots: {
    index: true,
    follow: true,
  },
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
