"use client"

import { useAuth } from "@/contexts/auth-context"
import { useStartup } from "@/contexts/startup-context"
import { LoadingScreen } from "@/components/loading-screen"
import { PageLoading } from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogOut, Settings, User, Shield, Clock, MapPin, Globe, Phone, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Home() {
  const { user, userProfile, loading, initialLoading, signOut } = useAuth()
  const { shouldShowStartup, setHasShownStartup } = useStartup()
  const [showStartLoading, setShowStartLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // 初回ロード時のみスタートローディングを表示
    if (shouldShowStartup && !initialLoading) {
      setShowStartLoading(true)
      const timer = setTimeout(() => {
        setShowStartLoading(false)
        setHasShownStartup(true)
      }, 2800)
      return () => clearTimeout(timer)
    }
  }, [shouldShowStartup, initialLoading, setHasShownStartup])

  // 初期認証チェック中
  if (initialLoading) {
    return <PageLoading message="認証状態を確認中..." />
  }

  // スタートローディング（初回のみ）
  if (showStartLoading) {
    return <LoadingScreen />
  }

  // 通常のローディング（データ読み込み中）
  if (loading) {
    return <PageLoading message="データを読み込み中..." />
  }

  if (!user) {
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
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Modern Auth
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                シンプルで安全な認証システム
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Link href="/login" className="w-full">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                  ログイン
                </Button>
              </Link>

              <div className="py-2"></div>

              <Link href="/signup" className="w-full">
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  アカウント作成
                </Button>
              </Link>
            </CardContent>
          </Card>
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

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold hidden sm:block">Modern Auth</h1>
            </div>

            {/* デスクトップメニュー */}
            <div className="hidden md:flex items-center space-x-2">
              <ThemeToggle />
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  設定
                </Button>
              </Link>
              <Button onClick={signOut} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                ログアウト
              </Button>
            </div>

            {/* モバイルメニュー */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4 mt-8">
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Settings className="w-4 h-4 mr-2" />
                        設定
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        signOut()
                        setMobileMenuOpen(false)
                      }}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      ログアウト
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* ウェルカムカード */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-1">
              <div className="bg-background rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <User className="w-5 h-5 mr-2" />
                    ようこそ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 mx-auto sm:mx-0">
                      <AvatarImage src={userProfile?.photoURL || ""} alt={userProfile?.displayName || "User"} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg sm:text-xl">
                        {userProfile?.displayName?.charAt(0) || userProfile?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <h2 className="text-xl sm:text-2xl font-semibold">{userProfile?.displayName || "ユーザー"}</h2>
                      <p className="text-muted-foreground text-sm sm:text-base">{userProfile?.email}</p>

                      {userProfile?.bio && (
                        <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">{userProfile.bio}</p>
                      )}

                      <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {userProfile?.provider === "google.com"
                            ? "Google"
                            : userProfile?.provider === "github.com"
                              ? "GitHub"
                              : "Email"}
                        </Badge>
                        <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                          アクティブ
                        </Badge>
                      </div>

                      {/* 追加情報 */}
                      <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        {userProfile?.location && (
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="truncate max-w-24 sm:max-w-none">{userProfile.location}</span>
                          </div>
                        )}
                        {userProfile?.website && (
                          <div className="flex items-center">
                            <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <a
                              href={userProfile.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline truncate max-w-24 sm:max-w-none"
                            >
                              ウェブサイト
                            </a>
                          </div>
                        )}
                        {userProfile?.phoneNumber && (
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="truncate max-w-24 sm:max-w-none">{userProfile.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          {/* アカウント情報 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">アカウント情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">ユーザーID</p>
                  <p className="text-xs sm:text-sm font-mono bg-muted px-2 py-1 rounded break-all">
                    {user.uid.substring(0, 12)}...
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">認証方法</p>
                  <p className="text-xs sm:text-sm">{userProfile?.provider || "email"}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">作成日</p>
                  <p className="text-xs sm:text-sm">
                    {userProfile?.createdAt
                      ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString("ja-JP")
                      : "不明"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  セッション情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">最終ログイン</p>
                  <p className="text-xs sm:text-sm">現在のセッション</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">セキュリティ</p>
                  <p className="text-xs sm:text-sm text-green-600">安全</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">最終更新</p>
                  <p className="text-xs sm:text-sm">
                    {userProfile?.updatedAt
                      ? new Date(userProfile.updatedAt.seconds * 1000).toLocaleDateString("ja-JP")
                      : "未更新"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* クイックアクション */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">クイックアクション</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/profile">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent hover:bg-muted/50 transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    プロフィール編集
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent hover:bg-muted/50 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    アカウント設定
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
