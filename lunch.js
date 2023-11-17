import { launch } from 'puppeteer';

async function scrapeWebsite() {
    const browser = await launch({ headless: "new" });
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