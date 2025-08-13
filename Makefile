# Feed Inc. プロジェクト管理用 Makefile

.PHONY: help ssl-check ssl-renew ssl-setup ssl-production dev-ssl clean-ssl security-audit generate-keys

help: ## ヘルプを表示
	@echo "Feed Inc. プロジェクト管理コマンド"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""

# SSL証明書管理
ssl-check: ## SSL証明書の状態をチェック
	@./scripts/ssl-setup.sh --check

ssl-renew: ## SSL証明書を更新
	@./scripts/renew-ssl.sh

ssl-setup: ## 本番環境用SSL設定のセットアップ
	@./scripts/ssl-setup.sh --production

ssl-production: ## Let's Encrypt証明書を取得（本番環境用）
	@echo "🔐 Let's Encrypt証明書を取得中..."
	@docker-compose -f docker-compose.ssl.yml --profile ssl-setup up -d nginx-acme
	@sleep 5
	@docker-compose -f docker-compose.ssl.yml --profile ssl-management run --rm certbot certonly \
		--webroot --webroot-path=/var/www/certbot \
		--email admin@feed-inc.com --agree-tos --no-eff-email \
		-d feed-inc.com -d www.feed-inc.com
	@docker-compose -f docker-compose.ssl.yml --profile ssl-setup down
	@./scripts/ssl-setup.sh --fix-permissions
	@echo "✅ 証明書取得完了。メインのコンテナを再起動してください。"

dev-ssl: ## 開発用自己署名証明書を生成
	@./scripts/ssl-setup.sh --self-signed

clean-ssl: ## SSL関連ファイルをクリーンアップ
	@echo "⚠️  SSL証明書とキーファイルを削除します。続行しますか? [y/N]"
	@read -r REPLY; if [ "$$REPLY" = "y" ] || [ "$$REPLY" = "Y" ]; then \
		rm -f ssl/server.crt ssl/server.key; \
		rm -rf ssl/letsencrypt ssl/www ssl/logs; \
		rm -f ssl/*.backup.*; \
		echo "✅ SSL関連ファイルを削除しました"; \
	else \
		echo "❌ キャンセルされました"; \
	fi

# セキュリティ関連
security-audit: ## セキュリティ監査を実行
	@./scripts/docker-security-audit.sh

generate-keys: ## セキュリティキーを生成
	@./scripts/generate-keys.sh

# Docker管理
up: ## サービスを起動
	@docker-compose up -d

down: ## サービスを停止
	@docker-compose down

restart: ## サービスを再起動
	@docker-compose restart

logs: ## ログを表示
	@docker-compose logs -f

status: ## サービスの状態を確認
	@docker-compose ps

# メンテナンス
backup: ## データベースとSSL証明書をバックアップ
	@mkdir -p backups/$(shell date +%Y%m%d_%H%M%S)
	@cp -r ssl backups/$(shell date +%Y%m%d_%H%M%S)/
	@cp backend/database/database.sqlite backups/$(shell date +%Y%m%d_%H%M%S)/ 2>/dev/null || true
	@echo "✅ バックアップを作成しました: backups/$(shell date +%Y%m%d_%H%M%S)/"

install-cron: ## SSL証明書自動更新のcronジョブをインストール
	@echo "# Feed Inc. SSL証明書自動更新" | crontab -l 2>/dev/null | grep -v "Feed Inc. SSL" | crontab -
@(crontab -l 2>/dev/null; echo "0 3 * * * cd $(PWD) && ./scripts/renew-ssl.sh >> ssl/cron.log 2>&1") | crontab -
	@echo "✅ Cronジョブをインストールしました（毎日午前3時に実行）"

remove-cron: ## SSL証明書自動更新のcronジョブを削除
@crontab -l 2>/dev/null | grep -v "renew-ssl.sh" | crontab -
	@echo "✅ Cronジョブを削除しました"

# 開発支援
dev: ## 開発環境をセットアップ
	@make dev-ssl
	@make generate-keys
	@echo "✅ 開発環境の準備完了"

production-check: ## 本番環境デプロイ前のチェック
	@echo "🔍 本番環境デプロイ前チェック実行中..."
	@make security-audit
	@make ssl-check
	@echo "✅ 本番環境チェック完了"

ci-security: ## CI環境での全セキュリティチェック
	@echo "🤖 CI セキュリティチェック実行中..."
	@make security-audit
	@echo "📄 ファイル権限チェック実行中..."
	@find . -name "*.sh" -exec chmod +x {} \;
	@echo "✅ CI セキュリティチェック完了"

setup-git-hooks: ## Git pre-commit フックをセットアップ
	@echo "#!/bin/bash" > .git/hooks/pre-commit
	@echo "make security-audit" >> .git/hooks/pre-commit
	@chmod +x .git/hooks/pre-commit
	@echo "✅ Git pre-commit フックをセットアップしました"