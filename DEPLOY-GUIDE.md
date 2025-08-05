# designcreateform.com デプロイガイド

株式会社フィード コーポレートサイト (designcreateform.com) のVPSサーバーへのデプロイ手順書です。

## 📋 目次

1. [サーバー情報](#サーバー情報)
2. [SSH接続設定](#ssh接続設定)
3. [サーバー環境確認](#サーバー環境確認)
4. [プロジェクト転送](#プロジェクト転送)
5. [本番環境デプロイ](#本番環境デプロイ)
6. [動作確認](#動作確認)
7. [SSL証明書設定](#ssl証明書設定)
8. [メンテナンス・更新](#メンテナンス更新)
9. [トラブルシューティング](#トラブルシューティング)

## 📊 サーバー情報

### 本番サーバー詳細

**designcreateform.com サーバー情報:**
```
ドメイン: designcreateform.com
IPアドレス: 162.43.91.172
OS: Ubuntu (x86_64)
Docker: 28.3.2
SSH: rootユーザー、鍵認証
プロジェクト配置: /var/www/feed-inc/
```

**アクセス情報:**
```
メインサイト: https://designcreateform.com
管理画面: https://designcreateform.com/admin/login
API: https://designcreateform.com/api/
```

**管理者アカウント:**
```
Email: admin@feed-inc.com
Password: password123
```

## 🔐 SSH接続設定

### SSH鍵認証での接続

**必要なファイル:**
- SSH秘密鍵: `~/.ssh/programing-SSHKey.pem`

**接続方法:**

```bash
# SSH鍵の権限設定
chmod 600 ~/.ssh/programing-SSHKey.pem

# サーバーへのSSH接続
ssh -i ~/.ssh/programing-SSHKey.pem root@162.43.91.172

# 接続確認
whoami  # root
pwd     # /root
```

**WSL環境での注意点:**
- Windows側の.sshディレクトリからWSLにコピーが必要な場合があります
- 権限設定は必須 (`chmod 600`)

### サーバー環境確認

```bash
# OS・システム情報確認
uname -a
df -h

# Docker確認
docker --version
docker ps

# プロジェクト確認
ls -la /var/www/feed-inc/
```

## 📁 プロジェクト転送

### 既存コンテナの停止

```bash
# サーバーでの作業
ssh -i ~/.ssh/programing-SSHKey.pem root@162.43.91.172

# 既存コンテナ確認・停止
cd /var/www/feed-inc
docker ps
docker stop $(docker ps -q)
docker rm $(docker ps -aq)
```

### ローカルからサーバーへのファイル転送

```bash
# ローカル環境での作業（プロジェクトルートで実行）
rsync -avz --delete \
  -e "ssh -i ~/.ssh/programing-SSHKey.pem" \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='vendor' \
  --exclude='backend/storage/logs/*' \
  ./ root@162.43.91.172:/var/www/feed-inc/

# 転送完了確認
ssh -i ~/.ssh/programing-SSHKey.pem root@162.43.91.172 "ls -la /var/www/feed-inc/"
```

**転送されるファイル:**
- `docker-compose.prod.yml` - 本番用Docker設定
- `nginx.prod.conf` - 本番用Nginx設定
- `.env.prod` - 本番用環境変数
- `ssl/` - SSL証明書ディレクトリ
- `backend/` - Laravel アプリケーション
- `frontend/` - Next.js アプリケーション

## 🚀 本番環境デプロイ

### 本番用Docker Compose起動

```bash
# サーバーでの作業
ssh -i ~/.ssh/programing-SSHKey.pem root@162.43.91.172
cd /var/www/feed-inc

# 本番環境起動（初回は時間がかかります）
docker-compose -f docker-compose.prod.yml up -d --build

# 起動状況確認
docker-compose -f docker-compose.prod.yml ps
```

**ビルド時間の目安:**
- Laravel: 約2-3分
- Next.js: 約5-10分（フロントエンドのビルド）
- Nginx: 即座

### データベース初期化

```bash
# マイグレーション・シーダー実行
docker exec feed-laravel-prod php artisan migrate:fresh --seed --force

# データベース確認
docker exec feed-laravel-prod php artisan tinker --execute="echo 'Articles: ' . App\Models\Article::count() . PHP_EOL . 'Users: ' . App\Models\User::count();"
```

### サービス構成

**起動するコンテナ:**
- `feed-laravel-prod` - Laravel API (PHP-FPM)
- `feed-nextjs-prod` - Next.js Frontend
- `feed-nginx-prod` - Nginx Reverse Proxy (80/443ポート)

## ✅ 動作確認

### 基本動作確認

```bash
# HTTPS フロントエンドアクセス確認
curl -k -I https://designcreateform.com

# API動作確認
curl -k -I https://designcreateform.com/api/categories

# データ確認
curl -k -s https://designcreateform.com/api/articles | jq '.data | length'
```

**期待される結果:**
```
Frontend: HTTP/2 200 (Next.js応答)
API: HTTP/2 200 (Laravel応答)
Articles: 8件のサンプル記事
```

### Webブラウザでの確認

1. **メインサイト**: https://designcreateform.com
   - フロントページ表示確認
   - 各ページ遷移確認
   - レスポンシブ動作確認

2. **管理画面**: https://designcreateform.com/admin/login
   - ログイン画面表示確認
   - 管理者ログイン確認
   - 記事管理機能確認

3. **API**: https://designcreateform.com/api/categories
   - JSON応答確認

### パフォーマンス確認

```bash
# レスポンス時間測定
curl -k -o /dev/null -s -w "Time: %{time_total}s\nStatus: %{http_code}\n" https://designcreateform.com

# コンテナリソース確認
docker stats --no-stream
```

## 🔒 SSL証明書設定

### 現在の状況

**自己署名証明書:**
- 現在は開発・テスト用の自己署名証明書を使用
- ブラウザで「安全でない接続」警告が表示される
- 機能的には問題なく動作

### Let's Encrypt証明書への移行（推奨）

```bash
# Certbot インストール
apt install -y certbot

# 一時的にNginxを停止
docker stop feed-nginx-prod

# SSL証明書取得
certbot certonly --standalone -d designcreateform.com -d www.designcreateform.com

# 証明書を配置
sudo cp /etc/letsencrypt/live/designcreateform.com/fullchain.pem /var/www/feed-inc/ssl/server.crt
sudo cp /etc/letsencrypt/live/designcreateform.com/privkey.pem /var/www/feed-inc/ssl/server.key

# 権限設定
chown root:root /var/www/feed-inc/ssl/*
chmod 644 /var/www/feed-inc/ssl/server.crt
chmod 600 /var/www/feed-inc/ssl/server.key

# Nginxを再起動
docker start feed-nginx-prod
```

### 証明書自動更新設定

```bash
# Crontab設定
crontab -e

# 毎月1日に証明書更新
0 3 1 * * /usr/bin/certbot renew --quiet && /usr/bin/docker exec feed-nginx-prod nginx -s reload
```

## 🔄 メンテナンス・更新

### アプリケーション更新手順

```bash
# ローカルでの作業
rsync -avz --delete \
  -e "ssh -i ~/.ssh/programing-SSHKey.pem" \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='vendor' \
  ./ root@162.43.91.172:/var/www/feed-inc/

# サーバーでの作業
ssh -i ~/.ssh/programing-SSHKey.pem root@162.43.91.172
cd /var/www/feed-inc

# コンテナ再ビルド・再起動
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# データベースマイグレーション（必要時のみ）
docker exec feed-laravel-prod php artisan migrate
```

### 定期メンテナンス

```bash
# システム更新
apt update && apt upgrade -y

# Docker不要イメージ削除
docker system prune -f

# ログローテーション確認
logrotate -d /etc/logrotate.d/docker-containers

# SSL証明書期限確認
openssl x509 -in /var/www/feed-inc/ssl/server.crt -noout -dates
```

### バックアップ

```bash
# データベースバックアップ
docker exec feed-laravel-prod cp /var/www/html/database/database.sqlite /var/www/html/database/backup_$(date +%Y%m%d).sqlite

# 設定ファイルバックアップ
tar -czf /root/backup_$(date +%Y%m%d).tar.gz /var/www/feed-inc/
```

## 🚨 トラブルシューティング

### よくある問題と解決方法

#### 1. コンテナが起動しない

```bash
# ログ確認
docker-compose -f docker-compose.prod.yml logs

# コンテナ状況確認
docker ps -a

# 再ビルド
docker-compose -f docker-compose.prod.yml down
docker system prune -f
docker-compose -f docker-compose.prod.yml up -d --build
```

#### 2. SSL証明書エラー

```bash
# 証明書ファイル確認
ls -la /var/www/feed-inc/ssl/

# 自己署名証明書再作成
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /var/www/feed-inc/ssl/server.key \
  -out /var/www/feed-inc/ssl/server.crt \
  -subj "/C=JP/ST=Tokyo/L=Tokyo/O=Feed Inc/CN=designcreateform.com"

# 権限修正
chmod 644 /var/www/feed-inc/ssl/server.crt
chmod 600 /var/www/feed-inc/ssl/server.key
```

#### 3. Next.jsビルドエラー

```bash
# ビルドログ確認
docker-compose -f docker-compose.prod.yml logs nextjs

# フロントエンドコンテナ再ビルド
docker-compose -f docker-compose.prod.yml build --no-cache nextjs
docker-compose -f docker-compose.prod.yml up -d nextjs
```

### 現在の本番環境状況

**✅ 稼働中のサービス:**
- designcreateform.com (メインサイト)
- designcreateform.com/admin/login (管理画面)
- designcreateform.com/api/ (API)

**📊 パフォーマンス実績:**
- フロントエンド応答時間: ~0.3秒
- API応答時間: ~0.9秒
- 同時接続対応: HTTP/2
- リソース使用量: 軽微

---

## 🎯 デプロイ完了

**株式会社フィードのコーポレートサイト (designcreateform.com) が本番環境で正常に稼働しています！**

このガイドに従って、今後のメンテナンスとセキュリティ更新を定期的に実行してください。
