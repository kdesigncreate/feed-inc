#!/bin/bash

# Feed Inc. セキュリティキー生成スクリプト
# このスクリプトは本番環境のデプロイ前に実行してください

set -e

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "🔐 Feed Inc. セキュリティキー生成開始"

# 環境設定ファイルのパス
ENV_FILE=".env.docker"

# バックアップを作成
if [ -f "$ENV_FILE" ]; then
    log "既存の環境設定ファイルをバックアップ中..."
    cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%Y%m%d_%H%M%S)"
fi

# 新しいLaravel APP_KEYを生成
log "新しいLaravel APP_KEYを生成中..."
NEW_APP_KEY=$(docker run --rm -v "$(pwd)/backend:/var/www/html" php:8.2-cli php -r "
require_once '/var/www/html/vendor/autoload.php';
\$key = base64_encode(random_bytes(32));
echo 'base64:' . \$key;
")

if [ -z "$NEW_APP_KEY" ]; then
    log "❌ APP_KEYの生成に失敗しました"
    exit 1
fi

log "✅ 新しいAPP_KEYを生成: $NEW_APP_KEY"

# .env.dockerファイルを更新
log ".env.dockerファイルを更新中..."
if [ -f "$ENV_FILE" ]; then
    # 既存ファイルのAPP_KEYを更新
    if grep -q "^APP_KEY=" "$ENV_FILE"; then
        sed -i "s|^APP_KEY=.*|APP_KEY=$NEW_APP_KEY|" "$ENV_FILE"
    else
        # APP_KEYが存在しない場合は追加
        echo "APP_KEY=$NEW_APP_KEY" >> "$ENV_FILE"
    fi
else
    log "❌ $ENV_FILE が見つかりません"
    exit 1
fi

# 権限設定
log "環境ファイルのセキュリティ権限を設定中..."
chmod 600 "$ENV_FILE"

# 検証
log "設定を検証中..."
if grep -q "^APP_KEY=$NEW_APP_KEY" "$ENV_FILE"; then
    log "✅ APP_KEYの設定が完了しました"
else
    log "❌ APP_KEYの設定に失敗しました"
    exit 1
fi

# セキュリティチェック
log "セキュリティチェック実行中..."

# 危険な設定をチェック
DANGEROUS_CONFIGS=(
    "APP_DEBUG=true"
    "APP_ENV=local" 
    "APP_ENV=development"
)

SECURITY_WARNINGS=0
for config in "${DANGEROUS_CONFIGS[@]}"; do
    if grep -q "^$config" "$ENV_FILE"; then
        log "⚠️  警告: 危険な設定が検出されました: $config"
        SECURITY_WARNINGS=$((SECURITY_WARNINGS + 1))
    fi
done

# APP_KEYの品質検証（実際のキーを含まない安全な方法）
if grep -q "^APP_KEY=" "$ENV_FILE"; then
    APP_KEY_VALUE=$(grep "^APP_KEY=" "$ENV_FILE" | cut -d'=' -f2)
    
    # 長さチェック
    if [ ${#APP_KEY_VALUE} -lt 50 ]; then
        log "❌ 致命的: APP_KEYが短すぎます（セキュリティリスク）"
        exit 1
    fi
    
    # base64形式チェック
    if ! echo "$APP_KEY_VALUE" | grep -q "^base64:"; then
        log "❌ 致命的: APP_KEYがbase64形式ではありません"
        exit 1
    fi
    
    # 弱いパターンのチェック（テスト/デモ用キーのパターン）
    if echo "$APP_KEY_VALUE" | grep -qE "base64:(dGVzdA|VGVzdA|dGVtcA|VGVtcA|ZGVtbw|RGVtbw)"; then
        log "❌ 致命的: テスト/デモ用のキーパターンが検出されました"
        exit 1
    fi
fi

# 最終確認
log "🔍 最終セキュリティチェック"
if [ $SECURITY_WARNINGS -eq 0 ]; then
    log "✅ セキュリティチェック: すべてのチェックに合格"
else
    log "⚠️  $SECURITY_WARNINGS 個の警告があります。本番環境デプロイ前に確認してください。"
fi

log "✅ セキュリティキー生成が完了しました"
log ""
log "📋 次のステップ:"
log "1. .env.docker ファイルの内容を確認してください"
log "2. 本番環境では APP_DEBUG=false および APP_ENV=production が設定されていることを確認してください"
log "3. docker-compose up -d でコンテナを起動してください"
log ""
log "⚠️  重要: .env.docker ファイルは機密情報を含むため、バージョン管理システムにコミットしないでください"