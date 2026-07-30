#!/usr/bin/env node
/**
 * Servidor de desenvolvimento.
 *
 * Reproduz o comportamento configurado no vercel.json (cleanUrls e
 * trailingSlash). Se o dev servisse /empresa e a produção só respondesse
 * /empresa/, um link quebrado só apareceria depois do deploy.
 *
 * O mapa de MIME cobre imagem e fonte: servir woff2 como octet-stream faz o
 * navegador recusar a fonte, e o site cairia silenciosamente no fallback.
 */

import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize, sep } from 'node:path'

const root = process.cwd()
const port = Number(process.env.PORT || 4173)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
}

const server = http.createServer(async (req, res) => {
  let pathname
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  } catch {
    res.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' })
    res.end('Requisição inválida')
    return
  }

  // normalize resolve os ".." antes da concatenação; a checagem de prefixo
  // depois garante que nem sequências codificadas escapem da raiz.
  const safe = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '')
  let target = join(root, safe)

  if (target !== root && !target.startsWith(root + sep)) {
    res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' })
    res.end('Acesso negado')
    return
  }

  try {
    let info = await stat(target).catch(() => null)

    if (info?.isDirectory()) {
      target = join(target, 'index.html')
      info = await stat(target).catch(() => null)
    } else if (!info && !extname(target)) {
      target = join(target, 'index.html')
      info = await stat(target).catch(() => null)
    }

    if (!info) throw new Error('not found')

    const data = await readFile(target)
    res.writeHead(200, {
      'content-type': TYPES[extname(target).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-cache',
    })
    res.end(data)
  } catch {
    try {
      const data = await readFile(join(root, '404.html'))
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
      res.end(data)
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('Não encontrado')
    }
  }
})

server.listen(port, () => console.log(`Designer Inox: http://localhost:${port}`))
