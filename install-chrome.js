import { install } from 'puppeteer-core/lib/install.js';

async function installChrome() {
  console.log('Installing Chrome...');
  await install({ product: 'chrome' });
  console.log('Chrome installation complete.');
}

installChrome();