"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoadingScreen } from "@/components/loading-screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, Settings, Shield, Zap, Code, Database } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Home() {
  const { user, loading, signOut } = useAuth()
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowLoading(false)
      }, 3000) // 3秒間ローディング画面を表示
      return () => clearTimeout(timer)
    }
  }, [loading])

  if (loading || showLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

        <div className="relative min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md bg-black/50 border-purple-500/20 backdrop-blur-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">TechAuth</CardTitle>
              <CardDescription className="text-purple-300">次世代認証システムへようこそ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/login" className="w-full">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                  システムにアクセス
                </Button>
              </Link>
              <Link href="/signup" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-purple-500/20 text-purple-300 hover:bg-purple-500/10 bg-transparent"
                >
                  新規アカウント作成
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card className="mb-8 bg-black/50 border-purple-500/20 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">TechAuth Dashboard</CardTitle>
                    <CardDescription className="text-purple-300">システム管理コンソール</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href="/profile">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-500/20 text-purple-300 hover:bg-purple-500/10 bg-transparent"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      設定
                    </Button>
                  </Link>
                  <Button
                    onClick={signOut}
                    variant="outline"
                    size="sm"
                    className="border-red-500/20 text-red-300 hover:bg-red-500/10 bg-transparent"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    ログアウト
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* User Info */}
          <Card className="mb-8 bg-black/50 border-purple-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Code className="w-5 h-5 mr-2" />
                ユーザープロファイル
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20 border-2 border-purple-500/20">
                  <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xl">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">{user.displayName || "ユーザー"}</h3>
                  <p className="text-purple-300">{user.email}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-green-500/20 text-green-300">
                      <Zap className="w-3 h-3 mr-1" />
                      アクティブ
                    </Badge>
                    <Badge variant="outline" className="border-purple-500/20 text-purple-300">
                      {user.providerData[0]?.providerId || "email"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-black/50 border-purple-500/20 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-300">セキュリティレベル</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">高</div>
                <p className="text-xs text-slate-400">多要素認証有効</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/20 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-300">アクセス権限</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">管理者</div>
                <p className="text-xs text-slate-400">フルアクセス許可</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/20 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-300">最終ログイン</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">今</div>
                <p className="text-xs text-slate-400">アクティブセッション</p>
              </CardContent>
            </Card>
          </div>

          {/* System Information */}
          <Card className="bg-black/50 border-purple-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="w-5 h-5 mr-2" />
                システム情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-purple-300">ユーザーID</p>
                  <p className="text-xs text-slate-400 font-mono break-all bg-slate-800/50 p-2 rounded">{user.uid}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-purple-300">認証プロバイダー</p>
                  <p className="text-xs text-slate-400 font-mono bg-slate-800/50 p-2 rounded">
                    {user.providerData[0]?.providerId || "email"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
