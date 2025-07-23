"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("システムを初期化中...")
  const [dots, setDots] = useState("")

  useEffect(() => {
    const texts = [
      "システムを初期化中",
      "認証モジュールを読み込み中",
      "データベース接続を確立中",
      "セキュリティプロトコルを検証中",
      "ユーザーインターフェースを構築中",
      "最終チェックを実行中",
      "準備完了",
    ]

    let currentIndex = 0
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 14.3
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
    }, 400)

    // ドットアニメーション
    const dotInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    return () => {
      clearInterval(interval)
      clearInterval(dotInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      {/* 背景アニメーション */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <Card className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 border border-white/20 dark:border-slate-700/50 backdrop-blur-xl shadow-2xl relative z-10">
        <div className="p-8 space-y-8">
          {/* ロゴとタイトル */}
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl animate-spin-slow"></div>
              <div className="absolute inset-1 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Modern Auth
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">次世代認証システム</p>
            </div>
          </div>

          {/* プログレスバー */}
          <div className="space-y-4">
            <div className="relative w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                {loadingText}
                <span className="inline-block w-8 text-left">{dots}</span>
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-xs">{Math.round(progress)}% 完了</p>
            </div>
          </div>

          {/* アニメーション要素 */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </Card>

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
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  )
}
