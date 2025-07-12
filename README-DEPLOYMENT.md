# Feed Inc. - 完全デプロイメントガイド

XserverVPSの素のUbuntuから Feed Inc.ウェブサイトを完全にデプロイするための詳細ガイドです。

## 🚀 概要

このプロジェクトは以下の技術スタックで構成されています：
- **フロントエンド**: Next.js 15.3.5 (TypeScript)
- **バックエンド**: Laravel 12.0 (PHP 8.2+)
- **データベース**: SQLite
- **インフラ**: Docker + Docker Compose
- **Webサーバー**: Nginx
- **SSL**: Let's Encrypt

## 📋 前提条件

### XserverVPS要件
- **OS**: Ubuntu 20.04+ または Ubuntu 22.04+
- **CPU**: 2コア以上推奨
- **メモリ**: 4GB以上推奨
- **ストレージ**: 40GB以上推奨
- **ネットワーク**: グローバルIPアドレス

### ドメイン要件
- 独自ドメイン (例: designcreateform.com)
- DNS管理権限
- SSL証明書用のメールアドレス

## 🖥️ XserverVPS初期セットアップ

### 1. XserverVPSコンソールでの設定

1. **XserverVPSにログイン**
   - XserverVPSのコントロールパネルにログイン
   - 新しいサーバーを作成または既存サーバーを選択

2. **OS設定**
   - OS: Ubuntu 20.04 または Ubuntu 22.04 を選択
   - rootパスワードを設定（強力なパスワードを使用）
   - SSH鍵認証を有効にすることを推奨

3. **ネットワーク設定**
   - グローバルIPアドレスの確認
   - ファイアウォール設定（80, 443, 22ポートを許可）

### 2. 初回SSH接続とサーバー設定

#### 2.1 SSH接続
```bash
# rootユーザーで接続
ssh root@YOUR_SERVER_IP

# 初回接続時のホスト確認で「yes」を入力
```

#### 2.2 基本的なセキュリティ設定
```bash
# システム更新
apt update && apt upgrade -y

# タイムゾーン設定
timedatectl set-timezone Asia/Tokyo

# ホスト名設定（オプション）
hostnamectl set-hostname feed-inc-server

# 一般ユーザーの作成（推奨）
adduser deploy
usermod -aG sudo deploy

# SSH設定の強化
nano /etc/ssh/sshd_config
# 以下を変更:
# PermitRootLogin no
# PasswordAuthentication no (SSH鍵使用時)
# Port 22 (または別のポート)

# SSH設定の再読み込み
systemctl restart ssh

# 基本的なパッケージのインストール
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

#### 2.3 ファイアウォール初期設定
```bash
# UFWファイアウォールの設定
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp

# ファイアウォール状態確認
ufw status verbose
```

#### 2.4 システム監視とログ設定
```bash
# 自動セキュリティ更新の有効化
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

# ログ保持期間設定
nano /etc/logrotate.conf
# 以下を確認/設定:
# weekly
# rotate 4
```

### 3. ドメインとDNS設定

#### 3.1 ドメイン取得（既に持っている場合はスキップ）
- お名前.com、ムームードメイン、XserverDomainなどでドメインを取得

#### 3.2 DNS設定
ドメイン管理画面で以下のレコードを設定：

```
タイプ: A
名前: @（またはドメイン名）
値: YOUR_SERVER_IP
TTL: 3600

タイプ: A  
名前: www
値: YOUR_SERVER_IP
TTL: 3600

# CNAME設定（オプション）
タイプ: CNAME
名前: admin
値: designcreateform.com
TTL: 3600
```

#### 3.3 DNS伝播確認
```bash
# DNSの伝播を確認（10-15分待機）
nslookup your-domain.com
dig your-domain.com

# または外部サービスで確認
# https://www.whatsmydns.net/
```

## 🛠️ Feed Inc. アプリケーションデプロイ

### 1. プロジェクトの取得

#### 方法A: Git経由（推奨）
```bash
# プロジェクトディレクトリの作成
mkdir -p /var/www
cd /var/www

# Gitリポジトリのクローン
git clone https://github.com/your-username/feed-inc.git feed-inc
cd feed-inc

# 権限設定
chown -R root:root /var/www/feed-inc
chmod +x deploy-docker.sh
```

#### 方法B: ファイルアップロード経由
```bash
# SCPでファイルアップロード（ローカルから）
scp -r ./feed-inc root@YOUR_SERVER_IP:/var/www/

# または、wgetでダウンロード
cd /var/www
wget https://github.com/your-username/feed-inc/archive/main.zip
unzip main.zip
mv feed-inc-main feed-inc
cd feed-inc
chmod +x deploy-docker.sh
```

### 2. デプロイ設定のカスタマイズ

#### 2.1 デプロイスクリプトの設定
```bash
# デプロイスクリプトを編集
nano deploy-docker.sh

# 以下の設定を変更:
DOMAIN="your-domain.com"              # 実際のドメインに変更
EMAIL="admin@your-domain.com"         # SSL証明書用メールアドレス
APP_NAME="feed-inc"                   # アプリケーション名（変更不要）
```

#### 2.2 Nginx設定の確認
```bash
# Nginx設定ファイルを確認
nano nginx.conf

# ドメイン名が正しく設定されているか確認
# 必要に応じてserver_nameを修正
```

### 3. ワンクリックデプロイの実行

```bash
# メインデプロイスクリプトの実行
cd /var/www/feed-inc
sudo ./deploy-docker.sh
```

このスクリプトが自動的に以下を実行します：

1. **システム環境構築**
   - パッケージマネージャーの更新
   - Docker & Docker Composeのインストール
   - 必要なシステムツールのインストール

2. **アプリケーション環境構築**
   - アプリケーションディレクトリの作成
   - 環境設定ファイルの自動生成
   - Laravel アプリケーションキーの生成

3. **Docker環境構築**
   - Dockerイメージのビルド
   - データベースの初期化
   - コンテナの起動

4. **SSL証明書設定**
   - Let's Encrypt証明書の取得
   - 自動更新の設定

5. **セキュリティ設定**
   - ファイアウォールの設定
   - セキュリティヘッダーの設定

6. **運用設定**
   - 自動バックアップの設定
   - ログローテーションの設定
   - 監視設定

### 4. デプロイ進行状況の確認

デプロイ中は以下のような出力が表示されます：

```bash
[2024-01-01 12:00:00] Starting Feed Inc. Docker deployment for XserverVPS...
[2024-01-01 12:00:01] Updating system packages...
[2024-01-01 12:01:00] Installing Docker...
[2024-01-01 12:03:00] Installing Docker Compose...
[2024-01-01 12:04:00] Setting up application directory...
[2024-01-01 12:04:30] Creating environment files...
[2024-01-01 12:05:00] Building and starting Docker containers...
[2024-01-01 12:08:00] Setting up SSL certificate with Let's Encrypt...
[2024-01-01 12:10:00] Deployment completed successfully!
```

## 🔧 詳細設定

### 環境変数の詳細設定

#### Laravel (.env)
```bash
# 作成されるLaravel環境設定
APP_NAME="Feed Inc."
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
APP_TIMEZONE=Asia/Tokyo

DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite

SANCTUM_STATEFUL_DOMAINS=your-domain.com,www.your-domain.com
SESSION_DOMAIN=your-domain.com

MAIL_MAILER=log
MAIL_FROM_ADDRESS="noreply@your-domain.com"
MAIL_FROM_NAME="Feed Inc."

LOG_LEVEL=error
CACHE_STORE=file
QUEUE_CONNECTION=database
```

#### Next.js (.env.production)
```bash
# 作成されるNext.js環境設定
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_SITE_NAME="Feed Inc."
NEXT_PUBLIC_CONTACT_EMAIL=info@your-domain.com
```

### Docker設定の詳細

#### docker-compose.yml構成
```yaml
# 3つのメインサービス
services:
  laravel:    # PHP-FPM + Laravel
  nextjs:     # Next.js Frontend  
  nginx:      # Reverse Proxy
```

#### コンテナ間通信
- Laravel: Internal port 9000 (PHP-FPM)
- Next.js: Internal port 3000 (Node.js)
- Nginx: External ports 80, 443

### SSL設定の詳細

#### Let's Encrypt証明書
```bash
# 証明書の場所
/etc/letsencrypt/live/your-domain.com/fullchain.pem
/etc/letsencrypt/live/your-domain.com/privkey.pem

# 自動更新設定（cron）
0 12 * * * root /usr/bin/certbot renew --quiet --post-hook "cd /var/www/feed-inc && docker-compose restart nginx"
```

#### SSL設定確認
```bash
# SSL証明書の確認
openssl x509 -in /etc/letsencrypt/live/your-domain.com/fullchain.pem -text -noout

# SSL評価サイトでの確認
# https://www.ssllabs.com/ssltest/
```

## 🔍 動作確認とテスト

### 1. 基本動作確認

#### システム全体の状態確認
```bash
# コンテナ状態確認
cd /var/www/feed-inc
docker-compose ps

# 出力例:
#      Name                    Command               State                    Ports                  
# feed-laravel      docker-entrypoint.sh php-fpm    Up      9000/tcp                                
# feed-nextjs       docker-entrypoint.sh node ...   Up      3000/tcp                                
# feed-nginx        /docker-entrypoint.sh ngin ...   Up      0.0.0.0:443->443/tcp, 0.0.0.0:80->80/tcp

# システムリソース確認
docker stats

# ディスク使用量確認
df -h
```

#### ヘルスチェック
```bash
# ローカルヘルスチェック
curl -I http://localhost/health
# 期待値: HTTP/1.1 200 OK

# 外部からのアクセス確認
curl -I https://your-domain.com/health
# 期待値: HTTP/1.1 200 OK

# SSL証明書確認
curl -I https://your-domain.com
# 期待値: HTTP/2 200 (SSL有効)
```

### 2. アプリケーション機能テスト

#### フロントエンド動作確認
```bash
# トップページ確認
curl -s https://your-domain.com | grep -i "feed"

# 管理画面アクセス確認
curl -I https://your-domain.com/admin
# 期待値: HTTP/2 200 or 302 (リダイレクト)

# 静的ファイル確認
curl -I https://your-domain.com/image/logo_feed.png
# 期待値: HTTP/2 200
```

#### バックエンドAPI確認
```bash
# API疎通確認
curl -H "Accept: application/json" https://your-domain.com/api/
# 期待値: JSONレスポンス

# 記事API確認
curl -H "Accept: application/json" https://your-domain.com/api/articles
# 期待値: 記事一覧のJSONレスポンス
```

#### データベース確認
```bash
# SQLiteデータベース確認
docker-compose exec laravel ls -la database/
# 期待値: database.sqlite ファイルが存在

# マイグレーション状況確認
docker-compose exec laravel php artisan migrate:status
# 期待値: 全てのマイグレーションが "Ran"
```

### 3. パフォーマンステスト

#### レスポンス時間測定
```bash
# フロントエンドレスポンス時間
time curl -s https://your-domain.com > /dev/null
# 期待値: 3秒以内

# APIレスポンス時間
time curl -s https://your-domain.com/api/articles > /dev/null
# 期待値: 2秒以内
```

#### 負荷テスト（簡易）
```bash
# 同時接続テスト
for i in {1..10}; do
  curl -s https://your-domain.com > /dev/null &
done
wait

# CPU・メモリ使用量確認
docker stats --no-stream
```

## 📊 監視とメンテナンス

### 1. ログ監視

#### リアルタイムログ監視
```bash
# 全体ログ監視
cd /var/www/feed-inc
docker-compose logs -f

# 個別サービスログ監視
docker-compose logs -f laravel
docker-compose logs -f nextjs
docker-compose logs -f nginx

# システムログ監視
tail -f /var/log/syslog
journalctl -f
```

#### ログ分析
```bash
# Nginxアクセスログ分析
tail -100 /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -nr
# IPアドレス別アクセス数

# エラーログ確認
grep -i error /var/log/nginx/error.log | tail -10

# Laravel ログ確認
docker-compose exec laravel tail -f storage/logs/laravel.log
```

### 2. パフォーマンス監視

#### システムリソース監視
```bash
# CPU使用率
top
htop

# メモリ使用量
free -h

# ディスク使用量
df -h
du -sh /var/www/feed-inc

# ネットワーク監視
iftop
netstat -tuln
```

#### Dockerリソース監視
```bash
# コンテナリソース使用量
docker stats

# イメージサイズ確認
docker images

# ボリューム使用量
docker system df
```

### 3. 自動バックアップ

#### バックアップ設定確認
```bash
# cron設定確認
crontab -l
# 期待値: 日次バックアップのcronジョブが存在

# バックアップスクリプト確認
cat /var/www/feed-inc/backup.sh

# バックアップディレクトリ確認
ls -la /var/backups/feed-inc/
```

#### 手動バックアップ実行
```bash
# バックアップ実行
cd /var/www/feed-inc
./backup.sh

# バックアップ確認
ls -la /var/backups/feed-inc/
# 期待値: database_YYYYMMDD_HHMMSS.sqlite, storage_YYYYMMDD_HHMMSS.tar.gz
```

#### バックアップリストア（緊急時）
```bash
# データベースリストア例
cd /var/www/feed-inc
docker-compose exec laravel cp /var/backups/feed-inc/database_YYYYMMDD_HHMMSS.sqlite database/database.sqlite

# ストレージリストア例
docker-compose exec laravel tar -xzf /var/backups/feed-inc/storage_YYYYMMDD_HHMMSS.tar.gz -C /var/www/html/
```

### 4. 定期メンテナンス

#### 週次メンテナンス
```bash
# システム更新
apt update && apt upgrade -y

# Dockerイメージ更新
cd /var/www/feed-inc
docker-compose pull
docker-compose up -d --build

# ディスク容量確認
df -h

# ログ整理
find /var/log -name "*.log" -mtime +7 -exec gzip {} \;
```

#### 月次メンテナンス
```bash
# 古いDockerイメージ削除
docker image prune -a

# システムログ整理
journalctl --vacuum-time=30d

# バックアップ整理（古いバックアップ削除）
find /var/backups/feed-inc -name "*.sqlite" -mtime +30 -delete
find /var/backups/feed-inc -name "*.tar.gz" -mtime +30 -delete
```

## 🚨 トラブルシューティング

### 1. デプロイ時の問題

#### Docker関連エラー
```bash
# Dockerサービス確認
systemctl status docker

# Dockerサービス再起動
systemctl restart docker

# Docker Composeの再インストール
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

#### DNS/SSL関連エラー
```bash
# DNS解決確認
nslookup your-domain.com
dig your-domain.com

# SSL証明書の手動取得
certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Nginx設定テスト
nginx -t

# Let's Encryptの証明書確認
certbot certificates
```

#### 権限エラー
```bash
# ファイル権限修正
chown -R www-data:www-data /var/www/feed-inc
chmod -R 755 /var/www/feed-inc

# SQLite権限修正
chmod 664 /var/www/feed-inc/backend/database/database.sqlite
chown www-data:www-data /var/www/feed-inc/backend/database/database.sqlite
```

### 2. 運用中の問題

#### コンテナ関連問題
```bash
# コンテナ再起動
docker-compose restart

# 強制再ビルド
docker-compose down
docker-compose up -d --build --force-recreate

# コンテナログ確認
docker-compose logs laravel | tail -50
docker-compose logs nextjs | tail -50
docker-compose logs nginx | tail -50
```

#### パフォーマンス問題
```bash
# メモリ使用量確認
free -m
docker stats --no-stream

# ディスク容量確認
df -h
du -sh /var/www/feed-inc

# プロセス確認
ps aux | grep -E "(php|node|nginx)"
```

#### データベース問題
```bash
# SQLiteデータベース確認
sqlite3 /var/www/feed-inc/backend/database/database.sqlite ".tables"

# マイグレーション再実行
docker-compose exec laravel php artisan migrate:fresh --force

# データベースの権限確認
ls -la /var/www/feed-inc/backend/database/
```

### 3. セキュリティ問題

#### 不正アクセス検知
```bash
# 失敗したSSH接続確認
grep "Failed password" /var/log/auth.log | tail -20

# 異常なアクセス確認
tail -100 /var/log/nginx/access.log | awk '$9 ~ /4[0-9][0-9]|5[0-9][0-9]/ {print $0}'

# ファイアウォール状態確認
ufw status verbose
```

#### セキュリティ更新
```bash
# セキュリティ更新確認
apt list --upgradable | grep -i security

# セキュリティ更新適用
apt update && apt upgrade -y

# SSL証明書の有効期限確認
openssl x509 -in /etc/letsencrypt/live/your-domain.com/fullchain.pem -dates -noout
```

### 4. 復旧手順

#### 完全復旧（最終手段）
```bash
# 1. 現在の状態をバックアップ
cd /var/www/feed-inc
./backup.sh

# 2. 全コンテナ停止・削除
docker-compose down -v
docker system prune -a

# 3. 最新コードの取得
git pull origin main

# 4. 完全再デプロイ
./deploy-docker.sh
```

#### 部分復旧
```bash
# データベースのみ復旧
docker-compose exec laravel php artisan migrate:fresh --force
docker-compose exec laravel php artisan db:seed --force

# フロントエンドのみ再ビルド
docker-compose up -d --build nextjs

# Nginxのみ再起動
docker-compose restart nginx
```

## 📚 参考資料とリンク

### 公式ドキュメント
- [XserverVPS公式](https://vps.xserver.ne.jp/)
- [Docker公式ドキュメント](https://docs.docker.com/)
- [Laravel公式ドキュメント](https://laravel.com/docs)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Let's Encrypt公式](https://letsencrypt.org/)

### 監視・ツール
- [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/)
- [DNS Checker](https://www.whatsmydns.net/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### トラブルシューティング参考
- [Docker Troubleshooting](https://docs.docker.com/config/troubleshooting/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Ubuntu Server Guide](https://ubuntu.com/server/docs)

## 🎯 デプロイ成功チェックリスト

### デプロイ完了時の確認項目
- [ ] SSH接続でサーバーにアクセス可能
- [ ] ドメインがサーバーIPに向いている
- [ ] DNS設定が伝播している
- [ ] deploy-docker.sh が正常完了した
- [ ] 全Dockerコンテナが起動している
- [ ] SSL証明書が正常取得された
- [ ] ファイアウォールが適切に設定された

### 動作確認項目
- [ ] https://your-domain.com でウェブサイトが表示される
- [ ] https://your-domain.com/admin で管理画面にアクセスできる
- [ ] https://your-domain.com/api/ でAPIが応答する
- [ ] SSL証明書が有効（錠前アイコンが表示）
- [ ] モバイルでも正常表示される
- [ ] ページ読み込み速度が適切（3秒以内）

### セキュリティ確認項目
- [ ] ファイアウォールで不要ポートがブロックされている
- [ ] SSL/TLS設定が適切（A評価推奨）
- [ ] セキュリティヘッダーが設定されている
- [ ] 管理者パスワードが強力
- [ ] 定期バックアップが設定されている

### 運用準備項目
- [ ] ログ監視体制が整っている
- [ ] バックアップ・復旧手順が確認済み
- [ ] 緊急時連絡先が決まっている
- [ ] 定期メンテナンス計画が立てられている
- [ ] ドキュメントが整備されている

---

## 📞 サポート・お問い合わせ

### デプロイメントサポート
このガイドに従ってもデプロイに失敗する場合：

1. **ログの確認**
   ```bash
   # エラーログを確認
   docker-compose logs
   tail -f /var/log/syslog
   ```

2. **状況の詳細記録**
   - エラーメッセージ
   - 実行したコマンド
   - サーバー環境（OS、スペック）
   - ドメイン設定状況

3. **基本的な確認**
   - DNS設定の伝播
   - ファイアウォール設定
   - ディスク容量

### 緊急時対応

**ウェブサイトがダウンした場合：**

1. **即座に確認**
   ```bash
   docker-compose ps
   systemctl status docker
   ```

2. **クイック復旧**
   ```bash
   docker-compose restart
   ```

3. **完全復旧**
   ```bash
   cd /var/www/feed-inc
   ./deploy-docker.sh
   ```

---

これで、XserverVPSの素のUbuntuから Feed Inc.ウェブサイトを完全にデプロイし、運用できる体制が整います！