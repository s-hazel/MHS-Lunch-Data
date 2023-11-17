import express, { json } from 'express';
import scrapeWebsite from './lunch.js';
const app = express();
const port = 3000;

app.use(json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.post('https://lunch-data.vercel.app/api/lunch', async (req, res) => {
    const data = await scrapeWebsite();
    res.send(data);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});