"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home } from "lucide-react"
import Link from "next/link"

export function AccountDeletedScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">アカウントが削除されました</CardTitle>
          <CardDescription>アカウントとすべてのデータが正常に削除されました。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            ご利用いただき、ありがとうございました。 またのご利用をお待ちしております。
          </p>
          <Link href="/" className="w-full">
            <Button className="w-full">
              <Home className="w-4 h-4 mr-2" />
              ホームに戻る
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
