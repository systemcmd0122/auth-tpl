# 🔐 Modern Auth - Firebase Authentication Template

シンプルで現代的なFirebase認証システムのNext.jsテンプレートです。

![Modern Auth](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-v10-orange?style=for-the-badge&logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ 機能

### 🔑 認証機能
- **メール/パスワード認証**
- **Google OAuth**
- **GitHub OAuth**
- **パスワードリセット**

### 👤 プロフィール管理
- **プロフィール編集**
- **アバター画像設定**
- **個人情報管理**
- **アカウント削除**

### 🎨 UI/UX
- **レスポンシブデザイン**
- **ダークモード対応**
- **アニメーション付きローディング**
- **モダンなデザイン**

### 🛡️ セキュリティ
- **再認証システム**
- **データ完全削除**
- **セッション管理**
- **GDPR準拠**

## 🚀 クイックスタート

### 1. リポジトリのクローン

\`\`\`bash
git clone https://github.com/yourusername/modern-auth-template.git
cd modern-auth-template
\`\`\`

### 2. 依存関係のインストール

\`\`\`bash
npm install
# または
yarn install
# または
pnpm install
\`\`\`

### 3. Firebase プロジェクトの設定

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. Authentication を有効化し、以下のプロバイダーを設定：
   - Email/Password
   - Google
   - GitHub
3. Firestore Database を作成
4. プロジェクト設定から設定値を取得

### 4. 環境変数の設定

`.env.example` を `.env.local` にコピーして設定値を入力：

\`\`\`bash
cp .env.example .env.local
\`\`\`

`.env.local` を編集：

\`\`\`env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
\`\`\`

### 5. Firestore セキュリティルールの設定

Firebase Console の Firestore Database > ルール で以下を設定：

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザープロフィール
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // ユーザー関連データ
    match /{collection}/{document} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.uid == resource.data.userId);
    }
    
    // 削除ログ（管理者のみ）
    match /deletionLogs/{document} {
      allow write: if request.auth != null;
      allow read: if false; // 管理者のみアクセス可能
    }
  }
}
\`\`\`

### 6. 開発サーバーの起動

\`\`\`bash
npm run dev
# または
yarn dev
# または
pnpm dev
\`\`\`

[http://localhost:3000](http://localhost:3000) でアプリケーションが起動します。

## 📁 プロジェクト構造

\`\`\`
├── app/                    # Next.js App Router
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   ├── login/             # ログインページ
│   ├── signup/            # サインアップページ
│   └── profile/           # プロフィールページ
├── components/            # 再利用可能コンポーネント
│   ├── ui/               # shadcn/ui コンポーネント
│   ├── loading-screen.tsx # スタートローディング
│   ├── loading.tsx       # 通常ローディング
│   ├── theme-toggle.tsx  # テーマ切り替え
│   └── delete-account-dialog.tsx
├── contexts/             # React Context
│   ├── auth-context.tsx  # 認証コンテキスト
│   └── startup-context.tsx # スタートアップコンテキスト
├── lib/                  # ユーティリティ
│   ├── firebase.ts       # Firebase設定
│   ├── profile-service.ts # プロフィール管理
│   └── utils.ts          # 共通ユーティリティ
└── hooks/                # カスタムフック
\`\`\`

## 🎨 カスタマイズ

### テーマカラーの変更

`tailwind.config.ts` でカラーパレットを変更できます：

\`\`\`typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
}
\`\`\`

### ブランディングの変更

- ロゴ: `components/` 内のSVGアイコンを変更
- アプリ名: `app/layout.tsx` の metadata を変更
- カラーグラデーション: CSS クラスの `from-blue-500 to-purple-600` を変更

## 🔧 主要な技術スタック

- **[Next.js 15](https://nextjs.org/)** - React フレームワーク
- **[Firebase v10](https://firebase.google.com/)** - 認証・データベース
- **[TypeScript](https://www.typescriptlang.org/)** - 型安全性
- **[Tailwind CSS](https://tailwindcss.com/)** - スタイリング
- **[shadcn/ui](https://ui.shadcn.com/)** - UIコンポーネント
- **[Lucide React](https://lucide.dev/)** - アイコン
- **[next-themes](https://github.com/pacocoursey/next-themes)** - テーマ管理

## 📱 レスポンシブ対応

- **モバイルファースト** デザイン
- **タブレット** 最適化
- **デスクトップ** 対応
- **ダークモード** 完全対応

## 🛡️ セキュリティ機能

### 認証セキュリティ
- パスワード強度チェック
- 再認証システム
- セッション管理
- CSRF保護

### データ保護
- 個人情報暗号化
- 完全データ削除
- GDPR準拠
- 監査ログ

## 🚀 デプロイ

### Vercel (推奨)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/modern-auth-template)

1. Vercel にプロジェクトをインポート
2. 環境変数を設定
3. デプロイ

### その他のプラットフォーム

- **Netlify**: `npm run build` でビルド
- **Railway**: Docker対応
- **Firebase Hosting**: `firebase deploy`

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🙏 謝辞

- [shadcn/ui](https://ui.shadcn.com/) - 美しいUIコンポーネント
- [Lucide](https://lucide.dev/) - 素晴らしいアイコンセット
- [Firebase](https://firebase.google.com/) - 強力なバックエンドサービス

## 📞 サポート

問題や質問がある場合は、[Issues](https://github.com/yourusername/modern-auth-template/issues) を作成してください。

---

⭐ このプロジェクトが役に立った場合は、スターを付けていただけると嬉しいです！
