"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("システムを初期化中...")

  useEffect(() => {
    const texts = [
      "システムを初期化中...",
      "認証モジュールを読み込み中...",
      "データベース接続を確立中...",
      "セキュリティプロトコルを検証中...",
      "ユーザーインターフェースを構築中...",
      "準備完了",
    ]

    let currentIndex = 0
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 16.67
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })

      if (currentIndex < texts.length - 1) {
        setLoadingText(texts[currentIndex])
        currentIndex++
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <Card className="w-full max-w-md bg-black/50 border-purple-500/20 backdrop-blur-xl">
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">TechAuth</h1>
            <p className="text-purple-300 text-sm">次世代認証システム</p>
          </div>

          <div className="space-y-4">
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="text-center">
              <p className="text-purple-300 text-sm font-mono">{loadingText}</p>
              <p className="text-slate-400 text-xs mt-1">{Math.round(progress)}%</p>
            </div>
          </div>

          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
