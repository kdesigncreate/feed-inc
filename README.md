# Feed Inc. - プロモーション企画・制作会社

> リアルとデジタルの両面からプロモーションやPR、ブランディングを支援する専門会社のWebサイト

[![Production Status](https://img.shields.io/badge/status-live-brightgreen)](https://www.feed-inc.com/)
[![Laravel](https://img.shields.io/badge/Laravel-12.0-red)](https://laravel.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org)

## 🌟 プロジェクト概要

フィードは、リアルとデジタルの両面からプロモーションやPR、ブランディングを支援する専門会社です。このプロジェクトは、企業の成長をサポートする独自の企画・制作サービスを紹介するWebサイトです。

### 🏗️ アーキテクチャ

- **Backend**: Laravel 12 API with MySQL database
- **Frontend**: Next.js 14 React application with TypeScript
- **Deployment**: Docker Compose with Nginx reverse proxy
- **Security**: 包括的なセキュリティヘッダー、CSP、ロールベースアクセス制御

## 🚀 クイックスタート

### 開発環境の起動

```bash
# 全サービスの起動
make up

# 開発環境のセットアップ（SSL + セキュリティキー）
make dev

# ログの確認
make logs
```

### バックエンド開発

```bash
cd backend

# 開発サーバー（Laravel + Queue Worker + Vite）
composer dev

# テスト実行
composer test
# または
php artisan test

# コードフォーマット
./vendor/bin/pint

# データベースマイグレーション
php artisan migrate

# データベースシーディング
php artisan db:seed
```

### フロントエンド開発

```bash
cd frontend

# 開発サーバー
npm run dev

# 本番ビルド
npm run build

# 本番サーバー
npm run start

# リンティング
npm run lint
```

## 📁 プロジェクト構造

```
feed-inc/
├── backend/                 # Laravel 12 API
│   ├── app/
│   │   ├── Http/           # コントローラー、ミドルウェア
│   │   └── Models/         # Eloquentモデル
│   ├── config/             # アプリケーション設定
│   ├── database/           # マイグレーション、シーダー
│   └── routes/             # API・Webルート
├── frontend/               # Next.js 14 アプリケーション
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # Reactコンポーネント
│   │   ├── contexts/      # React Context
│   │   └── lib/           # ユーティリティ関数
│   └── public/            # 静的ファイル
├── docker-compose.yml     # マルチコンテナ編成
├── nginx.conf            # リバースプロキシ設定
├── Makefile              # 開発・デプロイ自動化
└── CLAUDE.md             # 詳細なプロジェクトドキュメント
```

## 🛡️ セキュリティ機能

- **認証**: Laravel Sanctum SPA Cookie認証（トークンベースではない）
- **認可**: カスタムミドルウェアによるロールベースアクセス制御
- **CSP**: ナンスベースのインラインスクリプト保護
- **セキュリティヘッダー**: 包括的なセキュリティヘッダー
- **入力検証**: バックエンド・フロントエンド両方での検証
- **Dockerセキュリティ**: 読み取り専用コンテナとセキュリティ強化

## 🗄️ データベース

- **メインDB**: MySQL 8.0
- **テーブル**: users（管理者ロール対応）、articles（スラッグベースルーティング）、sessions、personal_access_tokens、cache、jobs
- **シーディング**: 管理者ユーザーとサンプル記事
- **テスト用DB**: `feed_inc_test`（`backend/phpunit.xml`で設定）

## 🧪 テスト

### バックエンドテスト

```bash
cd backend

# 全テスト実行
./vendor/bin/phpunit --testdox
# または
composer test

# 特定のテストファイル
./vendor/bin/phpunit tests/Feature/AuthTest.php

# 特定のテストメソッド
./vendor/bin/phpunit --filter testLogin
```

テストカバレッジ:
- 認証（ログイン、ログアウト、ユーザー取得、CSRF）
- 記事管理（CRUD操作、権限）
- APIバリデーションとセキュリティ

### フロントエンドテスト

```bash
cd frontend

# コード品質チェック
npm run lint
```

## 🚀 本番デプロイ

### 本番サーバー情報

- **サーバー**: root@162.43.87.222
- **SSHキー**: /home/kenta/.ssh/feed-sshkey.pem
- **プロジェクトパス**: /var/www/feed-inc/
- **データベース**: MySQL（Dockerコンテナで実行）

### デプロイプロセス

```bash
# 1. 変更をアップロード（ビルド成果物除く）
rsync -avz -e "ssh -i /home/kenta/.ssh/feed-sshkey.pem" \
  --exclude=node_modules --exclude=vendor --exclude=.git \
  /home/kenta/feed-inc/ root@162.43.87.222:/var/www/feed-inc/

# 2. コンテナ再起動
ssh -i /home/kenta/.ssh/feed-sshkey.pem root@162.43.87.222 \
  "cd /var/www/feed-inc && docker-compose restart"

# 3. コンテナの完全起動を待機（重要！）
sleep 15

# 4. サービス稼働確認
ssh -i /home/kenta/.ssh/feed-sshkey.pem root@162.43.87.222 \
  "cd /var/www/feed-inc && docker-compose ps"
```

### デプロイ時の重要な注意事項

- **マイグレーション**: 明示的に要求されない限り、本番で新規マイグレーションは実行しない
- **データベース設定**: 現在の設定を確認せずに.envファイルを変更しない
- **コンテナ再起動**: 変更アップロード後は必ずDockerコンテナを再起動
- **待機時間**: コンテナが完全に起動するまで待機
- **本番DB**: MySQL in Docker（SQLiteではない）
- **フロントエンドビルド**: Dockerコンテナで自動処理

### 検証コマンド

```bash
# 全サービスの健全性確認
ssh -i /home/kenta/.ssh/feed-sshkey.pem root@162.43.87.222 \
  "cd /var/www/feed-inc && docker-compose ps"

# アプリケーション応答確認
curl -I https://www.feed-inc.com/
```

## 🔧 利用可能なMakeコマンド

```bash
make up                  # 全サービス起動
make down               # 全サービス停止
make logs               # ログ表示
make status             # サービス状態確認
make dev                # 開発セットアップ（SSL + セキュリティキー）
make security-audit     # セキュリティ監査
make restart            # 全サービス再起動
make backup             # データベースとSSL証明書のバックアップ
make production-check   # デプロイ前チェック
make ci-security       # CIセキュリティチェック
make setup-git-hooks   # プリコミットセキュリティフック設定
```

## 📊 主要機能

### 認証システム
- SPAクッキー認証（Laravel Sanctum使用）
- ロールベースアクセス制御
- 自動CSRF保護
- セキュアなセッション管理

### コンテンツ管理
- 記事システム（スラッグベースルーティング）
- 画像アップロード機能
- カテゴリ管理
- 管理者パネル

### フロントエンド機能
- レスポンシブデザイン（モバイルファースト）
- パフォーマンス最適化
- SEO対応
- アクセシビリティ対応
- エラーハンドリング

## 🔍 最近のアップデート

- **PostCSS設定修正**: Next.js 14対応形式に更新
- **CasesSlider改善**: 表示問題修正とSwiper CSS追加
- **Cardコンポーネント**: スタイリング更新
- **SailServiceProvider**: 本番環境からの除去
- **依存関係最適化**: 本番用パッケージ構成

## 📝 重要な設定

- **登録無効**: 設計により登録は無効化 - 管理者アカウントは手動作成
- **記事スラッグ**: 自動生成、日本語タイトルはランダム文字列にフォールバック
- **CSRFトークン**: Laravel Sanctum SPA認証により自動処理
- **SSL証明書**: 開発・本番両方でMakefileコマンドで管理可能

## 🤝 開発に貢献

1. プロジェクトをフォーク
2. 機能ブランチを作成（`git checkout -b feature/amazing-feature`）
3. 変更をコミット（`git commit -m 'Add amazing feature'`）
4. ブランチにプッシュ（`git push origin feature/amazing-feature`）
5. Pull Requestを作成

## 📄 ライセンス

このプロジェクトは株式会社フィードの所有物です。

## 📞 サポート

問い合わせや相談は下記まで：

- **電話**: 03-3505-3005
- **メール**: contact@feed-inc.com
- **ウェブサイト**: https://www.feed-inc.com/

---

⚡ **Status**: Production Ready | 🌐 **Live**: https://www.feed-inc.com/