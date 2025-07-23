"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Github, Mail, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signUp, signInWithGoogle, signInWithGithub } = useAuth()
  const router = useRouter()

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("パスワードが一致しません。")
      return
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください。")
      return
    }

    setLoading(true)

    try {
      await signUp(email, password)
      router.push("/")
    } catch (error: any) {
      setError("アカウント作成に失敗しました。メールアドレスを確認してください。")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setError("")
    setLoading(true)

    try {
      await signInWithGoogle()
      router.push("/")
    } catch (error: any) {
      setError("Googleアカウントでの登録に失敗しました。")
    } finally {
      setLoading(false)
    }
  }

  const handleGithubSignup = async () => {
    setError("")
    setLoading(true)

    try {
      await signInWithGithub()
      router.push("/")
    } catch (error: any) {
      setError("GitHubアカウントでの登録に失敗しました。")
    } finally {
      setLoading(false)
    }
  }

  // 全体のデザインを技術的なテーマに変更し、ログインページと同様のスタイルを適用
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md bg-black/50 border-purple-500/20 backdrop-blur-xl">
          <CardHeader>
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-center text-white">新規アカウント作成</CardTitle>
            <CardDescription className="text-center text-purple-300">システムへの新規登録</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-purple-300">
                  メールアドレス
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-slate-800/50 border-purple-500/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-purple-300">
                  パスワード
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6文字以上のパスワード"
                  className="bg-slate-800/50 border-purple-500/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-purple-300">
                  パスワード確認
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="パスワードを再入力"
                  className="bg-slate-800/50 border-purple-500/20 text-white"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                disabled={loading}
              >
                <Mail className="w-4 h-4 mr-2" />
                {loading ? "アカウント作成中..." : "アカウントを作成"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-purple-500/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/50 px-2 text-purple-300">または</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleGoogleSignup}
                variant="outline"
                className="w-full border-purple-500/20 text-purple-300 hover:bg-purple-500/10 bg-transparent"
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Googleでアカウント作成
              </Button>
              <Button
                onClick={handleGithubSignup}
                variant="outline"
                className="w-full border-purple-500/20 text-purple-300 hover:bg-purple-500/10 bg-transparent"
                disabled={loading}
              >
                <Github className="w-4 h-4 mr-2" />
                GitHubでアカウント作成
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-purple-300">すでにアカウントをお持ちの方は </span>
              <Link href="/login" className="text-cyan-400 hover:underline">
                こちらからログイン
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
