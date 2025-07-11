# 株式会社フィード コーポレートサイト

株式会社フィードの公式Webサイトです。プロモーションとブランディングの専門会社として、30年以上の実績とノウハウを活かしたサービスを紹介しています。

## 🏢 会社概要

**株式会社フィード**は、「気づき」を活かしたプランニングとデザインで、クライアントの商品の成長と生活者の快適な暮らしをサポートするプロモーション・ブランディング会社です。

- **設立**: 1990年10月
- **所在地**: 〒106-0032 東京都港区六本木4-1-1 第二黒崎ビル2F
- **事業内容**: リアル×デジタルによる、商品のプロモーション企画やPR・ブランディング支援

## 🚀 プロジェクト構成

このプロジェクトは、Laravel（バックエンド）とNext.js（フロントエンド）を使用したフルスタックWebアプリケーションです。

```
feed-inc/
├── backend/          # Laravel バックエンド
├── frontend/         # Next.js フロントエンド
├── CLAUDE.md         # 開発ガイド
├── DEPLOYMENT.md     # デプロイ手順
└── README.md         # このファイル
```

## 🛠️ 技術スタック

### フロントエンド
- **Framework**: Next.js 15.3.5 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI
- **Testing**: Jest + Testing Library
- **Build Tool**: Turbopack

### バックエンド
- **Framework**: Laravel 12.0
- **Language**: PHP 8.2+
- **Database**: MySQL
- **Authentication**: Laravel Sanctum
- **Testing**: PHPUnit

## 📋 主な機能

### 🎨 フロントエンド機能
- **レスポンシブデザイン**: PC・スマートフォン対応
- **会社紹介**: 企業理念、沿革、アクセス情報
- **サービス紹介**: 7つのサービスカテゴリー
- **実績紹介**: ケーススタディとクリエイティブ事例
- **ナレッジ**: 専門知識とインサイト記事
- **多言語対応**: 日本語メイン、英語表記併記

### ⚙️ バックエンド機能
- **記事管理システム**: CRUD操作、カテゴリ管理
- **ユーザー認証**: 管理者ログイン/ログアウト
- **検索・フィルタリング**: タイトル・内容での検索
- **API**: RESTful API設計
- **セキュリティ**: XSS防止、SQLインジェクション対策

## 🚀 開発環境セットアップ

### 必要な環境
- **Node.js**: 18.x以上
- **PHP**: 8.2以上
- **Composer**: 2.x
- **MySQL**: 8.0以上

### インストール手順

#### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd feed-inc
```

#### 2. バックエンドセットアップ
```bash
cd backend

# 依存関係のインストール
composer install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してデータベース情報を設定

# アプリケーションキーの生成
php artisan key:generate

# データベースマイグレーション
php artisan migrate

# シーダーの実行（オプション）
php artisan db:seed

# 開発サーバーの起動
composer run dev
```

#### 3. フロントエンドセットアップ
```bash
cd frontend

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 🧪 テスト実行

### バックエンドテスト
```bash
cd backend

# 全テストの実行
composer run test

# コードフォーマット
./vendor/bin/pint
```

### フロントエンドテスト
```bash
cd frontend

# 全テストの実行
npm test

# テスト（ウォッチモード）
npm run test:watch

# カバレッジ測定
npm run test:coverage

# リンティング
npm run lint
```

## 📁 プロジェクト構造

### フロントエンド構造
```
frontend/src/
├── app/                 # Next.js App Router
│   ├── admin/          # 管理画面
│   ├── cases/          # 実績ページ
│   ├── company/        # 会社概要
│   ├── knowledge/      # ナレッジページ
│   └── services/       # サービス紹介
├── components/         # 再利用可能コンポーネント
├── contexts/           # React Context
├── lib/               # ユーティリティ・定数
└── types/             # TypeScript型定義
```

### バックエンド構造
```
backend/
├── app/
│   ├── Http/Controllers/  # API コントローラー
│   └── Models/           # Eloquent モデル
├── database/
│   ├── migrations/       # データベースマイグレーション
│   ├── seeders/         # テストデータ
│   └── factories/       # ファクトリー
├── routes/
│   └── api.php          # API ルート定義
└── tests/               # テストファイル
```

## 🔧 開発コマンド

### よく使用するコマンド

#### フロントエンド
```bash
npm run dev        # 開発サーバー起動
npm run build      # 本番ビルド
npm run start      # 本番サーバー起動
npm run lint       # ESLint実行
```

#### バックエンド
```bash
composer run dev   # 開発サーバー起動（Laravel + queue + vite）
composer run test  # テスト実行
./vendor/bin/pint  # コードフォーマット
```

## 🎯 開発のベストプラクティス

### コーディング規則
- **TypeScript**: 厳密な型チェックを使用
- **ESLint/Prettier**: コード品質の統一
- **PSR-12**: PHP コーディング標準に準拠
- **テスト駆動**: 新機能は必ずテストを含める

### Git ワークフロー
```bash
# 新機能の開発
git checkout -b feature/新機能名
git add .
git commit -m "feat: 新機能の説明"
git push origin feature/新機能名
```

### コミットメッセージ規則
- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント更新
- `style:` コードスタイル変更
- `refactor:` リファクタリング
- `test:` テスト関連

## 🚀 デプロイ

本番環境へのデプロイ手順は `DEPLOYMENT.md` を参照してください。

### 環境別設定
- **開発環境**: `localhost:3000` (フロント), `localhost:8000` (API)
- **ステージング**: TBD
- **本番環境**: TBD

## 📊 パフォーマンス

### フロントエンド最適化
- **Next.js Image**: 画像の自動最適化
- **Code Splitting**: ページ別の分割読み込み
- **Turbopack**: 高速ビルドツール
- **CSS最適化**: Tailwind CSS JIT

### バックエンド最適化
- **Eloquent**: ORM による効率的なDB操作
- **Queue**: 非同期処理
- **Cache**: Redis/Database キャッシュ

## 🔒 セキュリティ

### 実装済みセキュリティ対策
- **CSRF Protection**: Laravel標準
- **XSS Prevention**: DOMPurify使用
- **SQL Injection**: Eloquent ORM
- **Authentication**: Laravel Sanctum
- **CORS**: 適切な設定

## 🐛 トラブルシューティング

### よくある問題と解決方法

#### フロントエンド
```bash
# node_modules関連のエラー
rm -rf node_modules package-lock.json
npm install

# Next.js キャッシュクリア
npm run build
```

#### バックエンド
```bash
# Composer依存関係の問題
composer install --no-cache

# Laravel キャッシュクリア
php artisan config:clear
php artisan cache:clear
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/新機能`)
3. 変更をコミット (`git commit -am 'feat: 新機能を追加'`)
4. ブランチにプッシュ (`git push origin feature/新機能`)
5. プルリクエストを作成

## 📞 サポート

### 開発チーム連絡先
- **プロジェクト責任者**: [連絡先]
- **技術サポート**: [連絡先]

### 有用なリンク
- [Next.js ドキュメント](https://nextjs.org/docs)
- [Laravel ドキュメント](https://laravel.com/docs)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)

## 📝 ライセンス

このプロジェクトは株式会社フィードの所有物です。無断での複製・配布は禁止されています。

---

**株式会社フィード** | プロモーション・ブランディングの専門会社  
🌐 Website: https://www.feed-inc.com  
📧 Email: contact@feed-inc.com  
📞 Phone: 03-3505-3005# feed-inc
