#!/bin/bash

# Docker設定のセキュリティ監査スクリプト
# Feed Inc. プロジェクト用

set -e

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

warn() {
    echo "⚠️  $1"
}

error() {
    echo "❌ $1"
}

success() {
    echo "✅ $1"
}

log "🔍 Docker セキュリティ監査開始"

ISSUES_FOUND=0
WARNINGS_FOUND=0

# 1. 環境変数ファイルのチェック
log "1. 環境変数ファイルのセキュリティチェック"

if [ -f ".env.docker" ]; then
    # ファイル権限チェック
    PERM=$(stat -c "%a" .env.docker)
    if [ "$PERM" != "600" ]; then
        error "環境ファイルの権限が不適切: $PERM (推奨: 600)"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    else
        success "環境ファイルの権限: 適切"
    fi
    
    # APP_KEYの存在確認
    if ! grep -q "^APP_KEY=" .env.docker; then
        error "APP_KEYが設定されていません"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    elif grep -q "^APP_KEY=$" .env.docker || grep -q "^APP_KEY=\s*$" .env.docker; then
        error "APP_KEYが空です"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    else
        success "APP_KEY: 設定済み"
    fi
    
    # 危険なデフォルトキーのチェック
    INSECURE_KEYS=(
        "base64:VhQa+IQ13kR/0dV3u+XmPkvRMuuGyTTSUZh0Hy01SWg="
        "base64:dGVzdF9rZXlfZm9yX2RlbW9fcHVycG9zZXNfb25seQ=="
    )
    
    for key in "${INSECURE_KEYS[@]}"; do
        if grep -q "^APP_KEY=$key" .env.docker; then
            error "危険なデフォルトキーが使用されています"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
            break
        fi
    done
    
    # 開発環境設定のチェック
    if grep -q "^APP_DEBUG=true" .env.docker; then
        warn "本番環境でAPP_DEBUG=trueが設定されています"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    fi
    
    if grep -q "^APP_ENV=local\|^APP_ENV=development" .env.docker; then
        warn "本番環境でAPP_ENVが開発用に設定されています"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    fi
    
    # APP_KEYの品質チェック（安全なアプローチ）
    APP_KEY_VALUE=$(grep "^APP_KEY=" .env.docker 2>/dev/null | cut -d'=' -f2)
    if [ -n "$APP_KEY_VALUE" ]; then
        # 長さチェック（適切なLaravelキーは50文字以上）
        if [ ${#APP_KEY_VALUE} -lt 50 ]; then
            error "APP_KEYが短すぎます（セキュリティリスク）"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
        
        # base64形式チェック
        if ! echo "$APP_KEY_VALUE" | grep -q "^base64:"; then
            error "APP_KEYがbase64形式ではありません"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
        
        # 弱いパターンのチェック（実際のキーは含めない）
        if echo "$APP_KEY_VALUE" | grep -qE "base64:(dGVzdA|VGVzdA|dGVtcA|VGVtcA|ZGVtbw|RGVtbw)"; then
            error "APP_KEYにテスト/デモ用のパターンが検出されました"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
        
        # エントロピーの簡易チェック（同じ文字の連続）
        base64_part=$(echo "$APP_KEY_VALUE" | sed 's/base64://')
        if echo "$base64_part" | grep -qE "([A-Za-z0-9])\1{4,}"; then
            warn "APP_KEYのランダム性が低い可能性があります"
            WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
        fi
    fi
    
else
    error ".env.docker ファイルが見つかりません"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# 2. docker-compose.ymlのセキュリティチェック
log "2. docker-compose.yml セキュリティチェック"

if [ -f "docker-compose.yml" ]; then
    # ハードコードされたシークレットのチェック
    if grep -q "APP_KEY=" docker-compose.yml && ! grep -q "env_file:" docker-compose.yml; then
        error "docker-compose.ymlにAPP_KEYがハードコードされています"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
    
    # セキュリティオプションのチェック
    if ! grep -q "no-new-privileges:true" docker-compose.yml; then
        warn "no-new-privileges セキュリティオプションが設定されていません"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    else
        success "no-new-privileges: 設定済み"
    fi
    
    # ポートバインディングのチェック
    if grep -q '"9000:9000"' docker-compose.yml; then
        warn "Laravel ポートが外部に公開されています（推奨: 127.0.0.1:9000:9000）"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    else
        success "ポートバインディング: 安全"
    fi
    
    # read-onlyオプションのチェック
    if ! grep -q "read_only:" docker-compose.yml; then
        warn "read-only オプションが設定されていません"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    else
        success "read-only オプション: 設定済み"
    fi
    
else
    error "docker-compose.yml が見つかりません"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# 3. Dockerfileのセキュリティチェック
log "3. Dockerfile セキュリティチェック"

if [ -f "Dockerfile" ]; then
    # rootユーザー使用のチェック
    if ! grep -q "USER " Dockerfile; then
        error "非rootユーザーが設定されていません"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    elif grep -q "USER root" Dockerfile; then
        error "rootユーザーで実行されています"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    else
        success "非rootユーザー: 設定済み"
    fi
    
    # 不要なパッケージのチェック
    if grep -q "sudo\|ssh\|telnet" Dockerfile; then
        warn "不要なパッケージがインストールされている可能性があります"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    fi
    
    # キャッシュクリーンアップのチェック
    if ! grep -q "rm -rf /var/lib/apt/lists" Dockerfile; then
        warn "パッケージキャッシュのクリーンアップが不十分"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    else
        success "キャッシュクリーンアップ: 適切"
    fi
    
else
    error "Dockerfile が見つかりません"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# 4. SSL証明書のチェック
log "4. SSL証明書チェック"

if [ -d "ssl" ]; then
    # 証明書ファイルの権限チェック
    if [ -f "ssl/server.key" ]; then
        PERM=$(stat -c "%a" ssl/server.key)
        if [ "$PERM" != "600" ]; then
            error "秘密鍵の権限が不適切: $PERM (推奨: 600)"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        else
            success "秘密鍵の権限: 適切"
        fi
    else
        warn "SSL秘密鍵が見つかりません"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    fi
else
    warn "SSLディレクトリが見つかりません"
    WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
fi

# 5. Docker volume のチェック
log "5. Docker volume セキュリティチェック"

if docker volume ls | grep -q feed; then
    success "Docker volume: 設定済み"
else
    warn "Docker volumeが見つかりません"
    WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
fi

# 6. Git secrets チェック
log "6. Git リポジトリセキュリティチェック"

# .gitignore で機密ファイルが除外されているかチェック
if [ -f ".gitignore" ]; then
    # .gitignoreの内容をチェック
    if grep -q "^\.env" .gitignore; then
        success ".gitignore: .env ファイルが除外されています"
    else
        warn ".gitignore: .env ファイルが除外されていません"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    fi
    
    if grep -q "ssl/.*\.key" .gitignore || grep -q "ssl/\*\.key" .gitignore; then
        success ".gitignore: SSL秘密鍵が除外されています"
    else
        warn ".gitignore: SSL秘密鍵が除外されていません"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    fi
    
    if grep -q "ssl/.*\.crt" .gitignore || grep -q "ssl/\*\.crt" .gitignore; then
        success ".gitignore: SSL証明書が除外されています"
    else
        warn ".gitignore: SSL証明書が除外されていません"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    fi
    
    if grep -q ".*\.backup" .gitignore || grep -q "\*\.backup" .gitignore; then
        success ".gitignore: バックアップファイルが除外されています"
    else
        warn ".gitignore: バックアップファイルが除外されていません"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    fi
else
    error ".gitignore ファイルが見つかりません"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Git履歴に機密情報が含まれていないかの簡易チェック
if git rev-parse --git-dir > /dev/null 2>&1; then
    suspicious_patterns=("password" "secret" "key" "token" "private")
    
    for pattern in "${suspicious_patterns[@]}"; do
        if git log --oneline --all | grep -qi "$pattern"; then
            warn "Git履歴に '$pattern' を含むコミットが見つかりました"
            WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
        fi
    done
    
    success "Git リポジトリチェック完了"
else
    warn "Gitリポジトリではありません"
fi

# 7. 設定ファイルの権限チェック
log "7. 重要ファイルの権限チェック"

important_files=("docker-compose.yml" "nginx.conf" "backend/config/database.php")

for file in "${important_files[@]}"; do
    if [ -f "$file" ]; then
        perm=$(stat -c "%a" "$file")
        if [ "$perm" = "600" ] || [ "$perm" = "644" ]; then
            success "$file の権限: 適切 ($perm)"
        elif [ "$perm" = "777" ] || [ "$perm" = "666" ]; then
            error "$file の権限が危険: $perm"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        else
            warn "$file の権限: $perm (確認推奨)"
            WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
        fi
    fi
done

# 結果サマリー
log ""
log "📊 セキュリティ監査結果"
log "================================"

if [ $ISSUES_FOUND -eq 0 ]; then
    success "重要な問題は見つかりませんでした"
else
    error "$ISSUES_FOUND 個の重要な問題が見つかりました"
fi

if [ $WARNINGS_FOUND -eq 0 ]; then
    success "警告はありません"
else
    warn "$WARNINGS_FOUND 個の警告があります"
fi

log ""
log "🛠️  推奨アクション:"

if [ $ISSUES_FOUND -gt 0 ]; then
    log "1. 上記の重要な問題を修正してください"
    log "2. scripts/generate-keys.sh を実行して新しいキーを生成してください"
fi

if [ $WARNINGS_FOUND -gt 0 ]; then
    log "3. 警告項目を確認し、必要に応じて修正してください"
fi

log "4. 定期的にこの監査スクリプトを実行してください"

# 終了ステータス
if [ $ISSUES_FOUND -gt 0 ]; then
    exit 1
else
    exit 0
fi