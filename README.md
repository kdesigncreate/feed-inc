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
├── docker-compose.yml # 本番環境設定
└── README.md         # このファイル
```

## 🛠️ 技術スタック

### フロントエンド
- **Framework**: Next.js 14.2.0 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI
- **Animation**: Swiper.js
- **HTTP Client**: Axios

### バックエンド
- **Framework**: Laravel 12.0
- **Language**: PHP 8.2+
- **Database**: SQLite
- **Authentication**: Laravel Sanctum
- **Testing**: PHPUnit

### インフラ
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (Reverse Proxy)
- **SSL**: 自己署名証明書対応

## 🎯 主要機能

### 公開サイト
- **企業情報**: 会社概要、アクセス情報、企業理念
- **サービス紹介**: 7つの主要サービスカテゴリ
- **実績紹介**: プロジェクト事例とクリエイティブ実績
- **ナレッジ**: プロモーション・デザインに関する専門記事
- **ワークフロー**: プロジェクト進行プロセスの可視化

### 管理システム
- **認証システム**: 管理者ログイン・ログアウト
- **記事管理**: ナレッジ記事のCRUD操作
- **カテゴリ管理**: 記事カテゴリの分類・フィルタリング
- **公開制御**: 記事の公開・非公開切り替え

## 🏃‍♂️ クイックスタート

### 前提条件
- Docker & Docker Compose
- Node.js 18+（ローカル開発時）
- PHP 8.2+（ローカル開発時）
- Composer（ローカル開発時）

### Docker による起動（推奨）

1. **リポジトリのクローン**
```bash
git clone <repository-url>
cd feed-inc
```

2. **本番環境の起動**
```bash
docker-compose up -d
```

3. **アクセス確認**
- フロントエンド: http://localhost
- バックエンド API: http://localhost/api
- 管理画面: http://localhost/admin

### ローカル開発環境

#### バックエンド（Laravel）
```bash
cd backend

# 依存関係のインストール
composer install

# 環境変数の設定
cp .env.example .env
php artisan key:generate

# データベースのセットアップ
touch database/database.sqlite
php artisan migrate:fresh --seed

# 開発サーバーの起動
composer run dev
```

#### フロントエンド（Next.js）
```bash
cd frontend

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 📁 ディレクトリ構造

### フロントエンド (`/frontend`)
```
src/
├── app/                 # Next.js App Router
│   ├── admin/          # 管理画面ページ
│   ├── company/        # 企業情報ページ
│   ├── services/       # サービス紹介ページ
│   ├── cases/          # 実績紹介ページ
│   └── knowledge/      # ナレッジページ
├── components/         # 再利用可能コンポーネント
├── contexts/           # React Context
├── lib/                # ユーティリティ・設定
└── types/              # TypeScript型定義
```

### バックエンド (`/backend`)
```
app/
├── Http/
│   ├── Controllers/    # APIコントローラー
│   └── Middleware/     # ミドルウェア
├── Models/             # Eloquentモデル
database/
├── migrations/         # データベースマイグレーション
├── seeders/           # シードデータ
└── database.sqlite    # SQLiteデータベース
```

## 🔧 開発コマンド

### バックエンド開発
```bash
# テスト実行
composer run test

# コード整形
./vendor/bin/pint

# キャッシュクリア
php artisan cache:clear
php artisan config:clear

# データベースリセット
php artisan migrate:fresh --seed
```

### フロントエンド開発
```bash
# リンター実行
npm run lint

# 本番ビルド
npm run build

# 本番サーバー起動
npm start
```

### Docker操作
```bash
# コンテナ状況確認
docker-compose ps

# ログ確認
docker-compose logs [service-name]

# コンテナ内でコマンド実行
docker exec feed-laravel php artisan migrate
docker exec feed-nextjs npm run build

# 停止・削除
docker-compose down
```

## 🗃️ データベース構造

### Articles テーブル
- `id`: 主キー
- `title`: 記事タイトル
- `slug`: URL用スラッグ
- `content`: 記事本文（HTML）
- `excerpt`: 記事概要
- `category`: カテゴリ
- `author`: 著者名
- `is_published`: 公開フラグ
- `published_at`: 公開日時

### Users テーブル
- `id`: 主キー
- `name`: ユーザー名
- `email`: メールアドレス
- `password`: ハッシュ化パスワード

## 🔐 認証システム

### 管理者ログイン
- **URL**: `/admin/login`
- **認証方式**: Laravel Sanctum (Token-based)
- **デフォルト管理者**:
  - Email: `admin@feed-inc.com`
  - Password: `password123`

### API認証
```typescript
// リクエストヘッダー
Authorization: Bearer {token}

// 自動トークン管理
// localStorage に保存
// 401エラー時に自動ログアウト
```

## 🌐 API エンドポイント

### 公開API
- `GET /api/articles` - 記事一覧取得
- `GET /api/articles/{slug}` - 個別記事取得
- `GET /api/categories` - カテゴリ一覧取得

### 認証API
- `POST /api/login` - ログイン
- `POST /api/logout` - ログアウト
- `GET /api/user` - 現在のユーザー情報

### 管理者API（認証必須）
- `POST /api/articles` - 記事作成
- `PUT /api/articles/{id}` - 記事更新
- `DELETE /api/articles/{id}` - 記事削除
- `GET /api/admin/articles` - 管理者用記事一覧

## 🎨 デザインシステム

### カラーパレット
- **Primary**: Corporate Blue
- **Gray Scale**: Tailwind CSS default
- **Background**: White/Gray-100

### タイポグラフィ
- **日本語**: Noto Sans JP
- **英語**: Montserrat
- **Responsive**: Mobile-first approach

### コンポーネント
- **Button**: 統一されたボタンスタイル
- **Card**: 情報表示用カード
- **Modal**: モーダルダイアログ
- **Loading**: ローディングスピナー

## 📱 レスポンシブ対応

- **Mobile**: ~767px
- **Tablet**: 768px~1023px  
- **Desktop**: 1024px~

すべてのページでモバイルファーストのレスポンシブデザインを採用。

## 🚀 デプロイ

### 本番環境への配置

1. **環境変数の設定**
```bash
# 本番用の環境変数を設定
export APP_ENV=production
export APP_DEBUG=false
export APP_URL=https://your-domain.com
```

2. **SSL証明書の配置**
```bash
# 本番用SSL証明書を配置
cp your-certificate.crt ssl/server.crt
cp your-private-key.key ssl/server.key
```

3. **デプロイ実行**
```bash
docker-compose up -d
```

### パフォーマンス最適化
- Laravel: Route & Config Cache
- Next.js: Static Generation & Image Optimization
- Nginx: Gzip Compression & Caching Headers

## 🧪 テスト

### バックエンドテスト
```bash
# 全テスト実行
composer run test

# 特定テスト実行
php artisan test --filter ArticleTest
```

### フロントエンドテスト
```bash
# Jest テスト実行
npm test

# TypeScript型チェック
npm run type-check
```

## 📈 パフォーマンス

### 実測値（Docker環境）
- **Laravel API**: ~24ms応答時間
- **Next.js**: ~18ms応答時間
- **メモリ使用量**: 
  - Laravel: ~70MB
  - Next.js: ~38MB
  - Nginx: ~14MB

## 🤝 コントリビューション

1. Forkしてください
2. 機能ブランチを作成してください (`git checkout -b feature/amazing-feature`)
3. 変更をコミットしてください (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュしてください (`git push origin feature/amazing-feature`)
5. Pull Requestを作成してください

## 📄 ライセンス

このプロジェクトは株式会社フィードの企業サイトです。

## 📞 お問い合わせ

- **会社**: 株式会社フィード
- **Email**: contact@feed-inc.com
- **電話**: 03-3505-3005
- **住所**: 〒106-0032 東京都港区六本木4-1-1 第二黒崎ビル2F

---

**株式会社フィード** - プロモーション・ブランディングの専門会社