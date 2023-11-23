const puppeteer = require("puppeteer")
const express = require("express")
require("dotenv").config()

const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.get('/lunch', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--disable-setuid-sandbox",
                "--no-sandbox",
                "--no-zygote"
            ],
            executablePath: process.env.NODE_ENV === 'production'
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath()
        });

        const page = await browser.newPage();
        page.setDefaultTimeout(0); // SUPER IMPORTANT
        await page.goto('https://melroseschools.nutrislice.com/menu/melrose/breakfast', { waitUntil: 'networkidle0' });

        try {
            const button = await page.waitForSelector('.primary');
            await button.click();
        } catch (error) {
            console.error('Error:', error);
        }

        try {
            // Wait for either .food-name-container or .no-data to appear
            await page.waitForSelector('.food-name-container, .no-data');
        } catch (error) {
            console.log('Timeout waiting for .food-name-container or .no-data');
            await browser.close();
            res.send("No data available (Timeout)");
            return;
        }

        // Check if .no-data exists
        const noDataElement = await page.$('.no-data');
        if (noDataElement) {
            console.log('No lunch today');
            await browser.close();
            res.send("No lunch today");
            return;
        }

        // Continue if .no-data is not found
        const foodNameContainer = await page.$('.food-name-container');

        if (!foodNameContainer) {
            console.log('Food name not found');
            await browser.close();
            res.send("No data available");
            return;
        }

        const textContent = await page.evaluate(el => el.textContent, foodNameContainer);

        await browser.close();

        res.send(textContent);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});