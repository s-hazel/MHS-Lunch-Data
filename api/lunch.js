import { launch } from 'puppeteer';
import chromium from 'chrome-aws-lambda';

async function scrapeWebsite() {
    // const browser = await launch({ headless: "new" });
    const browser = await chromium.puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      })
    const page = await browser.newPage();
    await page.goto('https://melroseschools.nutrislice.com/menu/melrose/breakfast', { waitUntil: 'networkidle0' });

    const button = await page.$('.primary');
    if (button) {
        await button.click();
    }

    await page.waitForSelector('.food-name-container');
    const test = await page.$('.food-name-container');
    const textContent = await page.evaluate(el => el.textContent, test);

    await browser.close();

    return textContent;
}

export default scrapeWebsite;