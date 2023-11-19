import * as puppeteer from 'puppeteer';
const { launch } = puppeteer;
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            executablePath: puppeteer.executablePath(),
            headless: "new"
          });

        const page = await browser.newPage();
        await page.goto('https://melroseschools.nutrislice.com/menu/melrose/breakfast', { waitUntil: 'networkidle0' });

        const button = await page.$('.primary');
        if (button) {
            await button.click();
        }

        try {
            // Wait for either .food-name-container or .no-data to appear
            await page.waitForSelector('.food-name-container, .no-data');
        } catch (error) {
            console.log('Timeout waiting for .food-name-container or .no-data');
            await browser.close();
            res.send("data: No data available");
            return; // Add return statement to exit the function
        }

        // Check if .no-data exists
        const noDataElement = await page.$('.no-data');
        if (noDataElement) {
            console.log('No data available');
            await browser.close();
            res.send("data: No lunch today");
            return; // Add return statement to exit the function
        }

        // Continue if .no-data is not found
        const foodNameContainer = await page.$('.food-name-container');

        if (!foodNameContainer) {
            console.log('Food name not found');
            await browser.close();
            res.send("data: No data available");
            return; // Add return statement to exit the function
        }

        const textContent = await page.evaluate(el => el.textContent, foodNameContainer);

        await browser.close();

        res.send('data: ' + textContent);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Hey Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});