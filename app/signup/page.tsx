"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { updateUserProfile as updateFirestoreProfile } from "@/lib/profile-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { Github, Mail, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ButtonLoading } from "@/components/loading"
import { PrivacyConsentDialog } from "@/components/privacy-consent-dialog"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false)
  const [pendingSignupData, setPendingSignupData] = useState<{
    type: 'email' | 'google' | 'github'
    email?: string
    password?: string
  } | null>(null)
  const { signUp, signInWithGoogle, signInWithGithub } = useAuth()
  const router = useRouter()

  // プライバシーポリシー同意後の実際のサインアップ処理
  const performSignup = async () => {
    if (!pendingSignupData) return

    setLoading(true)
    setError("")

    try {
      if (pendingSignupData.type === 'email' && pendingSignupData.email && pendingSignupData.password) {
        await signUp(pendingSignupData.email, pendingSignupData.password)
      } else if (pendingSignupData.type === 'google') {
        await signInWithGoogle()
      } else if (pendingSignupData.type === 'github') {
        await signInWithGithub()
      }

      router.push("/")
    } catch (error: any) {
      if (pendingSignupData.type === 'email') {
        setError("アカウント作成に失敗しました。メールアドレスを確認してください。")
      } else if (pendingSignupData.type === 'google') {
        setError("Googleアカウントでの登録に失敗しました。")
      } else if (pendingSignupData.type === 'github') {
        setError("GitHubアカウントでの登録に失敗しました。")
      }
    } finally {
      setLoading(false)
      setShowPrivacyDialog(false)
      setPendingSignupData(null)
    }
  }

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

    // プライバシーポリシー同意ダイアログを表示
    setPendingSignupData({ type: 'email', email, password })
    setShowPrivacyDialog(true)
  }

  const handleGoogleSignup = async () => {
    setError("")

    // プライバシーポリシー同意ダイアログを表示
    setPendingSignupData({ type: 'google' })
    setShowPrivacyDialog(true)
  }

  const handleGithubSignup = async () => {
    setError("")

    // プライバシーポリシー同意ダイアログを表示
    setPendingSignupData({ type: 'github' })
    setShowPrivacyDialog(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* 背景アニメーション */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <Card className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 border border-white/20 dark:border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="relative mx-auto w-16 h-16 mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl animate-pulse"></div>
              <div className="absolute inset-1 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              アカウント作成
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              新しいアカウントを作成してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  メールアドレス
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">
                  パスワード
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6文字以上のパスワード"
                  className="text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm">
                  パスワード確認
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="パスワードを再入力"
                  className="text-sm"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ButtonLoading />
                    <span className="ml-2">アカウント作成中...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    アカウントを作成
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-300 dark:border-slate-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">または</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleGoogleSignup}
                variant="outline"
                className="w-full bg-transparent border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <ButtonLoading />
                ) : (
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
                )}
                <span className="text-sm">Googleでアカウント作成</span>
              </Button>
              <Button
                onClick={handleGithubSignup}
                variant="outline"
                className="w-full bg-transparent border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
                disabled={loading}
              >
                {loading ? <ButtonLoading /> : <Github className="w-4 h-4 mr-2" />}
                <span className="text-sm">GitHubでアカウント作成</span>
              </Button>
            </div>

            <div className="text-center text-xs sm:text-sm">
              <span className="text-slate-600 dark:text-slate-400">すでにアカウントをお持ちの方は </span>
              <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                こちらからログイン
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* プライバシーポリシー同意ダイアログ */}
        <PrivacyConsentDialog
          open={showPrivacyDialog}
          onOpenChange={(open) => {
            setShowPrivacyDialog(open)
            if (!open) {
              setPendingSignupData(null)
            }
          }}
          onAccept={performSignup}
          loading={loading}
        />
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
