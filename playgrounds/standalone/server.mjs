import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const port = Number(process.env.PORT ?? '5174')

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
}

function toSafePath(pathname) {
  const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1)
  const filePath = normalize(join(rootDir, relativePath))
  return filePath.startsWith(rootDir) ? filePath : null
}

const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, 'http://localhost').pathname
    let filePath = toSafePath(pathname)

    if (filePath === null) {
      response.writeHead(403).end('Forbidden')
      return
    }

    const fileStat = await stat(filePath)
    if (fileStat.isDirectory()) {
      filePath = join(filePath, 'index.html')
    }

    const file = await readFile(filePath)
    const contentType =
      mimeTypes[extname(filePath)] ?? 'application/octet-stream'
    response.writeHead(200, { 'Content-Type': contentType }).end(file)
  } catch {
    response.writeHead(404).end('Not found')
  }
})

server.listen(port, () => {
  console.log(`Standalone playground available at http://localhost:${port}`)
})
