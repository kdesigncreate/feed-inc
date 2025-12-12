const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')
const fs = require('fs')

// Next.js アプリのためのカスタム Node.js サーバ。
// - 開発/本番のホスト・ポートを環境変数から設定
// - public 配下の favicon を静的配信
// - それ以外は Next.js のリクエストハンドラへ委譲

// 実行環境と待受設定
const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = parseInt(process.env.PORT, 10) || 3000

// Next.js アプリケーションと共通ハンドラを初期化
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  // 生の Node HTTP サーバを立て、リクエストを振り分ける
  createServer(async (req, res) => {
    try {
      // URL をパースしてパス名を取得
      const parsedUrl = parse(req.url, true)
      const { pathname } = parsedUrl

      // public 配下の favicon を静的に配信
      if (pathname.startsWith('/favicon.ico') || pathname.startsWith('/favicon.png')) {
        const filePath = path.join(__dirname, 'public', 'favicon.ico')
        
        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath)
          const fileStream = fs.createReadStream(filePath)
          
          res.writeHead(200, {
            'Content-Type': 'image/x-icon',
            'Content-Length': stat.size,
            'Cache-Control': 'public, max-age=31536000'
          })
          
          fileStream.pipe(res)
          return
        }
      }

      // それ以外のリクエストは Next.js に処理を委譲
      await handle(req, res, parsedUrl)
    } catch (err) {
      // 予期せぬエラーを 500 として返す
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err
    // 起動完了ログ
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})