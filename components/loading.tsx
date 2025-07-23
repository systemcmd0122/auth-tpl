"use client"

import { Loader2 } from "lucide-react"

interface LoadingProps {
  message?: string
  size?: "sm" | "md" | "lg"
  fullScreen?: boolean
}

export function Loading({ message = "読み込み中...", size = "md", fullScreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4 p-8 bg-background border rounded-lg shadow-lg">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
          <p className={`${textSizeClasses[size]} text-muted-foreground font-medium`}>{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        <p className={`${textSizeClasses[size]} text-muted-foreground font-medium`}>{message}</p>
      </div>
    </div>
  )
}

// ページ全体のローディング用コンポーネント
export function PageLoading({ message = "ページを読み込み中..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6 p-8">
        {/* ローディングアニメーション */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-muted rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* メッセージ */}
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">{message}</p>
          <p className="text-sm text-muted-foreground">しばらくお待ちください</p>
        </div>

        {/* ドットアニメーション */}
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// インライン用の小さなローディング
export function InlineLoading({ message }: { message?: string }) {
  return (
    <div className="flex items-center space-x-2 py-2">
      <Loader2 className="w-4 h-4 animate-spin text-primary" />
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
    </div>
  )
}

// ボタン内で使用するローディング
export function ButtonLoading() {
  return <Loader2 className="w-4 h-4 animate-spin" />
}
