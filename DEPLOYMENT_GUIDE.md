# XserverVPS デプロイガイド

## 概要

このガイドは、Feed Inc.のWebサイトをXserverVPSにデプロイする手順を説明します。
プロジェクトは以下の構成で動作します：

- **フロントエンド**: Next.js 15.3.5 (TypeScript)
- **バックエンド**: Laravel 12.0 (PHP 8.2+)
- **データベース**: SQLite
- **Webサーバー**: Nginx
- **コンテナ**: Docker Compose

## 前提条件

- XserverVPSアカウント
- ドメイン設定済み
- SSL証明書設定済み
- Docker, Docker Composeインストール済み

## デプロイ手順

### 1. サーバーへの接続

```bash
ssh root@your-server-ip
```

### 2. 必要なパッケージのインストール

```bash
# Docker & Docker Composeのインストール
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Composeのインストール
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Gitのインストール (Ubuntu/Debian)
apt update && apt install -y git

# または CentOS/RHEL の場合
# yum install -y git
```

### 3. プロジェクトのクローン

```bash
cd /var/www
git clone https://github.com/your-username/feed-inc.git
cd feed-inc
```

### 4. 環境設定

#### 4.1 Laravel環境設定

```bash
# 本番環境用の.envファイルを作成
cp .env.production backend/.env

# 以下の値を実際の値に変更
# - APP_KEY: php artisan key:generate で生成
# - APP_URL: 実際のドメイン
# - SANCTUM_STATEFUL_DOMAINS: 実際のドメイン
# - SESSION_DOMAIN: 実際のドメイン
```

#### 4.2 Next.js環境設定

```bash
# フロントエンド環境設定
cp frontend/.env.production frontend/.env.local

# 以下の値を実際の値に変更
# - NEXT_PUBLIC_APP_URL: 実際のドメイン
# - NEXT_PUBLIC_API_URL: 実際のドメイン/api
# - NEXT_PUBLIC_GA_ID: Google Analytics ID
# - NEXT_PUBLIC_GTM_ID: Google Tag Manager ID
```

#### 4.3 Nginx設定

```bash
# nginx.confを編集
nano nginx.conf

# 以下を実際の値に変更
# - server_name: 実際のドメイン
# - ssl_certificate: SSL証明書のパス
# - ssl_certificate_key: SSL秘密鍵のパス
```

### 5. アプリケーションキーの生成

```bash
# Laravelアプリケーションキーの生成
cd backend
php artisan key:generate --env=production
```

### 6. Docker Composeでビルド・起動

```bash
# アプリケーションのビルドと起動
docker-compose up -d --build

# ログの確認
docker-compose logs -f
```

### 7. データベース設定

```bash
# コンテナに入ってマイグレーション実行
docker-compose exec app php artisan migrate --force

# 初期データの投入（必要に応じて）
docker-compose exec app php artisan db:seed --force
```

### 8. 権限設定

```bash
# Laravel storageディレクトリの権限設定
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
docker-compose exec app chmod -R 775 storage bootstrap/cache
```

### 9. 動作確認

```bash
# ヘルスチェック
curl http://localhost/health

# アプリケーションの動作確認
curl https://designcreateform.com
```

## SSL証明書の設定

### Let's Encrypt使用の場合

```bash
# Certbotのインストール (Ubuntu/Debian)
apt update && apt install -y certbot

# または CentOS/RHEL の場合
# yum install -y certbot

# SSL証明書の取得
certbot certonly --webroot -w /var/www/feed-inc/frontend/out -d designcreateform.com -d www.designcreateform.com

# nginx.confで証明書パスを更新
# ssl_certificate /etc/letsencrypt/live/designcreateform.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/designcreateform.com/privkey.pem;

# 自動更新設定
echo "0 12 * * * /usr/bin/certbot renew --quiet && docker-compose restart nginx" | crontab -
```

## 運用・メンテナンス

### アプリケーションの更新

```bash
# 最新コードの取得
git pull origin main

# アプリケーションの再ビルド
docker-compose down
docker-compose up -d --build

# マイグレーション実行（必要に応じて）
docker-compose exec app php artisan migrate --force
```

### ログの確認

```bash
# アプリケーションログ
docker-compose logs app

# Nginxログ
docker-compose logs nginx

# Laravel ログ
docker-compose exec app tail -f storage/logs/laravel.log
```

### バックアップ

```bash
# データベースバックアップ
docker-compose exec app cp database/database.sqlite /var/www/html/backups/database-$(date +%Y%m%d).sqlite

# アップロードファイルのバックアップ
docker-compose exec app tar -czf /var/www/html/backups/storage-$(date +%Y%m%d).tar.gz storage/app/public/
```

### パフォーマンスチューニング

```bash
# Laravelキャッシュの最適化
docker-compose exec app php artisan config:cache
docker-compose exec app php artisan route:cache
docker-compose exec app php artisan view:cache

# Next.jsビルド最適化
docker-compose exec node npm run build
```

## トラブルシューティング

### よくあるエラーと解決方法

1. **500エラー**
   - Laravel ログを確認: `docker-compose logs app`
   - 権限問題: `chown -R www-data:www-data storage bootstrap/cache`

2. **データベース接続エラー**
   - SQLiteファイルの存在確認: `ls -la backend/database/database.sqlite`
   - 権限確認: `chmod 664 backend/database/database.sqlite`

3. **CORS エラー**
   - `config/cors.php`の設定確認
   - `SANCTUM_STATEFUL_DOMAINS`の設定確認

4. **静的ファイル404エラー**
   - Next.jsビルド確認: `docker-compose exec node npm run build`
   - Nginxの設定確認

### 監視とアラート

```bash
# システムリソース監視
docker stats

# アプリケーション死活監視
curl -f https://designcreateform.com/health || echo "Application is down"
```

## セキュリティ設定

### ファイアウォール設定

```bash
# 必要なポートのみ開放
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --permanent --add-port=22/tcp
firewall-cmd --reload
```

### 定期的なセキュリティ更新

```bash
# システムパッケージの更新 (Ubuntu/Debian)
apt update && apt upgrade -y

# または CentOS/RHEL の場合
# yum update -y

# Dockerイメージの更新
docker-compose pull
docker-compose up -d --build
```

## 参考情報

- [XserverVPS公式ドキュメント](https://vps.xserver.ne.jp/)
- [Laravel公式ドキュメント](https://laravel.com/docs/12.x)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Docker Compose公式ドキュメント](https://docs.docker.com/compose/)