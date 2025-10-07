# Stage 1: ビルド用のステージ
FROM node:18-alpine AS builder
WORKDIR /app

# 依存パッケージをインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピーしてビルド
COPY . .
RUN npm run build

# Stage 2: 本番用のステージ
FROM node:18-alpine
WORKDIR /app

# ビルダーからビルド済みのファイルのみをコピー
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 環境変数を設定
ENV NODE_ENV=production

# アプリケーションを起動
CMD ["npm", "start"]