import { createServer } from 'https';
import { fileURLToPath, parse } from 'url';
import next from 'next';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const __dirname = dirname(fileURLToPath(import.meta.url));

const httpsOptions = {
  key: readFileSync(join(__dirname, 'ssl', 'server.key')),
  cert: readFileSync(join(__dirname, 'ssl', 'server.cert')),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(443, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:443');
  });
});

// to run the app from this server, change the following scripts in package.json:
//     "dev": "NODE_ENV=development node server.js",
//     "start": "NODE_ENV=production node server.js"
