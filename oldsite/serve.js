// Basit statik sunucu (geliştirme önizlemesi için) — uzantısız adresleri destekler
const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

function send(res, file) {
  fs.readFile(file, (e, d) => {
    if (e) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(d);
  });
}

http.createServer((req, res) => {
  const [rawPath, query] = req.url.split('?');
  let p = decodeURIComponent(rawPath);
  const qs = query ? '?' + query : '';

  // /konu.html → /konu, /index.html → / (kalıcı yönlendirme)
  if (p.endsWith('.html')) {
    const clean = p.endsWith('/index.html') ? p.slice(0, -10) : p.slice(0, -5);
    res.writeHead(301, { Location: clean + qs });
    return res.end();
  }

  let file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (p.endsWith('/')) file = path.join(file, 'index.html');
  else if (!path.extname(p)) file += '.html';
  send(res, file);
}).listen(process.env.PORT || 5173);
