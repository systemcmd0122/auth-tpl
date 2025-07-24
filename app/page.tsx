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
import { 
  LogOut, Settings, User, Shield, Clock, MapPin, Globe, Phone, Menu,
  Sparkles, CheckCircle2, Star
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
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
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float animate-delay-200"></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float animate-delay-500"></div>
          </div>
        </div>

        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          <Card className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 border border-white/20 dark:border-slate-700/50 backdrop-blur-xl shadow-2xl animate-slide-up hover-lift">
            <CardHeader className="text-center">
              <div className="relative mx-auto w-16 h-16 mb-4 animate-pulse-glow">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl"></div>
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
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 group ripple">
                  <Shield className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  ログイン
                </Button>
              </Link>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-300 dark:border-slate-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">または</span>
                </div>
              </div>

              <Link href="/signup" className="w-full">
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 group ripple"
                >
                  <Sparkles className="w-4 h-4 mr-2 group-hover:animate-spin" />
                  アカウント作成
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center animate-pulse-glow">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Modern Auth
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Personal Dashboard</p>
              </div>
            </div>

            {/* デスクトップメニュー */}
            <div className="hidden md:flex items-center space-x-3">
              <ThemeToggle />
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-800 group">
                  <Settings className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  設定
                </Button>
              </Link>
              <Button onClick={signOut} variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 group">
                <LogOut className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                ログアウト
              </Button>
            </div>

            {/* モバイルメニュー */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-80 glass">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={userProfile?.photoURL || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {userProfile?.displayName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{userProfile?.displayName || "ユーザー"}</p>
                        <p className="text-xs text-slate-500">{userProfile?.email}</p>
                      </div>
                    </div>
                    <Separator />
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Settings className="w-4 h-4 mr-2" />
                        設定
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        signOut()
                        setMobileMenuOpen(false)
                      }}
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
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

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* ウェルカムセクション */}
        <section className="animate-slide-up">
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl hover-lift">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="text-center lg:text-left space-y-4">
                  <div className="flex items-center justify-center lg:justify-start space-x-3">
                    <Avatar className="w-16 h-16 ring-4 ring-white/50 dark:ring-slate-700/50 hover-scale">
                      <AvatarImage src={userProfile?.photoURL || ""} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl">
                        {userProfile?.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">
                        ようこそ, {userProfile?.displayName || "ユーザー"}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-300">
                        {userProfile?.bio || "プロフィールを設定してパーソナライズしましょう"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 animate-fade-in">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      認証済み
                    </Badge>
                    <Badge variant="outline" className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300 animate-fade-in animate-delay-100">
                      {userProfile?.provider === "google.com" ? "Google" : 
                       userProfile?.provider === "github.com" ? "GitHub" : "Email"}
                    </Badge>
                    <Badge variant="outline" className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300 animate-fade-in animate-delay-200">
                      <Star className="w-3 h-3 mr-1" />
                      アクティブ
                    </Badge>
                  </div>

                  {/* 追加情報 */}
                  {(userProfile?.location || userProfile?.website || userProfile?.phoneNumber) && (
                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      {userProfile?.location && (
                        <div className="flex items-center space-x-2 animate-fade-in animate-delay-300">
                          <MapPin className="w-4 h-4" />
                          <span>{userProfile.location}</span>
                        </div>
                      )}
                      {userProfile?.website && (
                        <div className="flex items-center space-x-2 animate-fade-in animate-delay-400">
                          <Globe className="w-4 h-4" />
                          <a href={userProfile.website} target="_blank" rel="noopener noreferrer" 
                             className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline">
                            ウェブサイト
                          </a>
                        </div>
                      )}
                      {userProfile?.phoneNumber && (
                        <div className="flex items-center space-x-2 animate-fade-in animate-delay-500">
                          <Phone className="w-4 h-4" />
                          <span>{userProfile.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* アカウント情報 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover-lift animate-slide-up animate-delay-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                アカウント情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">ユーザーID</p>
                <p className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg break-all">
                  {user.uid.substring(0, 16)}...
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">認証方法</p>
                <p className="text-sm font-medium">{userProfile?.provider || "email"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">作成日</p>
                <p className="text-sm">
                  {userProfile?.createdAt
                    ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString("ja-JP")
                    : "不明"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover-lift animate-slide-up animate-delay-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-500" />
                セッション情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">最終ログイン</p>
                <p className="text-sm font-medium">現在のセッション</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">セキュリティ</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-green-600 font-medium">安全</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">最終更新</p>
                <p className="text-sm">
                  {userProfile?.updatedAt
                    ? new Date(userProfile.updatedAt.seconds * 1000).toLocaleDateString("ja-JP")
                    : "未更新"}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* クイックアクション */}
        <section className="animate-slide-up animate-delay-300">
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                クイックアクション
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/profile">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 group ripple"
                  >
                    <User className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    プロフィール編集
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 group ripple"
                  >
                    <Settings className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    アカウント設定
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
