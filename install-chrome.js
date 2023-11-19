const puppeteer = require('puppeteer');

async function installChrome() {
  console.log('Installing Chrome...');
  await puppeteer.install({ product: 'chrome' });
  console.log('Chrome installation complete.');
}

installChrome();