/**
 * Captura screenshots 390×844 das rotas principais em /design/current/
 * Uso: BASE_URL=https://performa-xi.vercel.app node scripts/capture-ui.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE_URL ?? 'https://performa-xi.vercel.app';
const OUT = join(process.cwd(), 'design', 'current');

const routes = [
  { path: '/', file: '01-splash.png', wait: 800 },
  { path: '/onboarding', file: '02-onboarding-1.png', wait: 600 },
  { path: '/login', file: '05-login.png', wait: 600 },
  { path: '/register', file: '06-register.png', wait: 600 },
  { path: '/', file: '04-dashboard.png', wait: 1200, demo: true },
  { path: '/workout', file: '05-treino.png', wait: 800, demo: true },
  { path: '/nutrition', file: '07-nutricao.png', wait: 800, demo: true },
  { path: '/progress', file: '12-progresso.png', wait: 800, demo: true },
  { path: '/profile', file: '15-perfil.png', wait: 800, demo: true },
  { path: '/habits', file: '13-habitos.png', wait: 800, demo: true },
  { path: '/technique', file: 'technique.png', wait: 800, demo: true },
  { path: '/nutrition/ai-diet', file: '08-dieta-ia.png', wait: 800, demo: true },
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

async function enterDemo() {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  const demo = page.getByText('Continuar como demo');
  if (await demo.count()) {
    await demo.first().click();
    await page.waitForTimeout(900);
  }
}

let demoReady = false;

for (const route of routes) {
  try {
    if (route.demo && !demoReady) {
      await enterDemo();
      demoReady = true;
    }
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(route.wait);
    const file = join(OUT, route.file);
    await page.screenshot({ path: file, fullPage: false });
    console.log('OK', route.file);
  } catch (err) {
    console.error('FAIL', route.file, err.message);
  }
}

await browser.close();
console.log('Screenshots em', OUT);
