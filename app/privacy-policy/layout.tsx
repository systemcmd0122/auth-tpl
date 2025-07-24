import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "TechDash Proのプライバシーポリシー。個人情報の取り扱いについて詳しく説明しています。",
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
