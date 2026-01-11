const http = require('http');

http
  .createServer((req, res) => {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      console.log('Webhook recibido:', body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"ok":true}');
    });
  })
  .listen(9000, () => console.log('listening 9000'));
