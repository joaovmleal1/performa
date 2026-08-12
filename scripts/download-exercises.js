#!/usr/bin/env node
/**
 * Downloads exercise GIFs from Google Drive into public/exercises/
 * so the app can serve them locally (Expo public folder).
 *
 * Usage: npm run download:exercises
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const catalog = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/exercises/catalog.json'), 'utf8')
);
const outDir = path.join(__dirname, '../public/exercises');
fs.mkdirSync(outDir, { recursive: true });

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchBuffer(res.headers.location).then(resolve, reject);
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
  });
}

async function downloadOne(ex, i) {
  const dest = path.join(outDir, `${ex.id}.gif`);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) return 'skip';
  const urls = [
    `https://lh3.googleusercontent.com/d/${ex.driveFileId}`,
    `https://drive.google.com/thumbnail?id=${ex.driveFileId}&sz=w1000`,
  ];
  for (const url of urls) {
    try {
      const data = await fetchBuffer(url);
      if (data.length > 1000 && data.slice(0, 3).toString() === 'GIF') {
        fs.writeFileSync(dest, data);
        return 'ok';
      }
      if (data.length > 1000 && data[0] === 0xff && data[1] === 0xd8) {
        fs.writeFileSync(path.join(outDir, `${ex.id}.jpg`), data);
        return 'ok-jpg';
      }
    } catch {
      // try next
    }
  }
  return 'fail';
}

(async () => {
  let ok = 0;
  let skip = 0;
  let fail = 0;
  const concurrency = 10;
  let idx = 0;
  async function worker() {
    while (idx < catalog.length) {
      const i = idx++;
      const ex = catalog[i];
      const res = await downloadOne(ex, i);
      if (res === 'ok' || res === 'ok-jpg') ok++;
      else if (res === 'skip') skip++;
      else fail++;
      if ((ok + skip + fail) % 50 === 0) {
        console.log(`${ok + skip + fail}/${catalog.length} ok=${ok} skip=${skip} fail=${fail}`);
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  console.log(`Done. ok=${ok} skip=${skip} fail=${fail} → ${outDir}`);
})();
