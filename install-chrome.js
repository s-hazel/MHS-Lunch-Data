import { install } from 'puppeteer';

async function installChrome() {
  console.log('Installing Chrome...');
  await install({ product: 'chrome' });
  console.log('Chrome installation complete.');
}

installChrome();