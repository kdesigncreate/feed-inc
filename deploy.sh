#!/bin/bash

# Feed Inc. Deployment Script
# このスクリプトは本番環境への安全なデプロイを自動化します

set -e  # エラーが発生したら停止

SSH_KEY="/home/kenta/.ssh/feed-sshkey.pem"
SERVER="root@162.43.87.222"
REMOTE_PATH="/var/www/feed-inc"

echo "🚀 Feed Inc. デプロイを開始します..."

# 1. ローカルでのgit状態確認
echo "📋 Git状態を確認中..."
git status --porcelain
if [ $? -ne 0 ]; then
    echo "❌ Gitリポジトリではありません"
    exit 1
fi

# 2. 変更をコミット（必要に応じて）
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  未コミットの変更があります。先にコミットしてください。"
    echo "git add . && git commit -m 'your message' && git push"
    exit 1
fi

# 3. ファイルをプロダクションサーバーにアップロード
echo "📤 ファイルをプロダクションサーバーにアップロード中..."
rsync -avz -e "ssh -i $SSH_KEY" \
  --exclude=node_modules \
  --exclude=vendor \
  --exclude=.git \
  --exclude=storage/logs \
  --exclude=.env \
  /home/kenta/feed-inc/ $SERVER:$REMOTE_PATH/

# 4. Laravel依存関係とキャッシュの修正
echo "🔧 Laravel依存関係とキャッシュを修正中..."
# パッケージの自動発見を再実行してCollisionServiceProviderエラーを防ぐ
ssh -i $SSH_KEY $SERVER "cd $REMOTE_PATH && docker-compose exec -T laravel composer dump-autoload"
ssh -i $SSH_KEY $SERVER "cd $REMOTE_PATH && docker-compose exec -T laravel php artisan package:discover --ansi"
ssh -i $SSH_KEY $SERVER "cd $REMOTE_PATH && docker-compose exec -T laravel composer install --no-dev --optimize-autoloader"
ssh -i $SSH_KEY $SERVER "cd $REMOTE_PATH && docker-compose exec -T laravel php artisan config:clear"
ssh -i $SSH_KEY $SERVER "cd $REMOTE_PATH && docker-compose exec -T laravel php artisan cache:clear"
ssh -i $SSH_KEY $SERVER "cd $REMOTE_PATH && docker-compose exec -T laravel php artisan view:clear"

# 5. Next.jsコンテナをリビルド
echo "🏗️  Next.jsコンテナをリビルド中..."
ssh -i $SSH_KEY $SERVER "cd $REMOTE_PATH && docker-compose down nextjs"
ssh -i $SSH_KEY $SERVER "cd $REMOTE_PATH && docker-compose build --no-cache nextjs"
ssh -i $SSH_KEY $SERVER "cd $REMOTE_PATH && docker-compose up -d nextjs"

# 6. コンテナの起動を待機
echo "⏳ コンテナの起動を待機中..."
sleep 20

# 7. デプロイ後の健全性チェック
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

echo "🎉 デプロイが正常に完了しました！"
echo "🌐 サイトURL: https://www.feed-inc.com"
echo "📊 casesページ: https://www.feed-inc.com/cases"