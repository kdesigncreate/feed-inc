const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')
const fs = require('fs')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = parseInt(process.env.PORT, 10) || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      const { pathname } = parsedUrl

      // Handle static files from public directory
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

      // Handle all other requests with Next.js
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})