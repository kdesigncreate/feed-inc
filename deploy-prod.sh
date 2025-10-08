#!/bin/bash

# Feed Inc. Production Server Deploy Script
# プロダクションサーバー専用のデプロイスクリプト（Gitチェックなし）

set -e  # エラーが発生したら停止

echo "🚀 Feed Inc. プロダクションサーバーデプロイを開始します..."

# 1. Laravel依存関係とキャッシュの修正
echo "🔧 Laravel依存関係とキャッシュを修正中..."
# パッケージの自動発見を再実行してCollisionServiceProviderエラーを防ぐ
docker-compose exec -T laravel composer dump-autoload
docker-compose exec -T laravel php artisan package:discover --ansi
docker-compose exec -T laravel composer install --no-dev --optimize-autoloader
docker-compose exec -T laravel php artisan config:clear
docker-compose exec -T laravel php artisan cache:clear
docker-compose exec -T laravel php artisan view:clear

# 2. Next.jsコンテナをリビルド
echo "🏗️  Next.jsコンテナをリビルド中..."
docker-compose down nextjs
docker-compose build --no-cache nextjs
docker-compose up -d nextjs

# 3. コンテナの起動を待機
echo "⏳ コンテナの起動を待機中..."
sleep 20

# 4. デプロイ後の健全性チェック
echo "🔍 デプロイ後の健全性チェック中..."

# APIの健全性チェック
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.feed-inc.com/api/articles)
if [ "$API_STATUS" = "200" ]; then
    echo "✅ API正常: $API_STATUS"
else
    echo "❌ API異常: $API_STATUS"
    exit 1
fi

# フロントエンドの健全性チェック
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.feed-inc.com/cases)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ フロントエンド正常: $FRONTEND_STATUS"
else
    echo "❌ フロントエンド異常: $FRONTEND_STATUS"
    exit 1
fi

# モーダル画像の健全性チェック
MODAL_IMAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.feed-inc.com/image/cases/case_hnsk_01_modal.png)
if [ "$MODAL_IMAGE_STATUS" = "200" ]; then
    echo "✅ モーダル画像正常: $MODAL_IMAGE_STATUS"
else
    echo "❌ モーダル画像異常: $MODAL_IMAGE_STATUS"
    exit 1
fi

echo "🎉 プロダクションサーバーデプロイが正常に完了しました！"
echo "🌐 サイトURL: https://www.feed-inc.com"
echo "📊 casesページ: https://www.feed-inc.com/cases"