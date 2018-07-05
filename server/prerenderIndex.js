const express = require('express');
const puppeteer = require('puppeteer');

// Consider keeping a launched browser for a longer period of time
// Will also need to look at caching the html files at some point
const ssr = async (url) => {
	let html = '';

	await puppeteer.launch().then(async (browser) => {
		// console.log('Starting ssr');

		const page = await browser.newPage();
		// console.log('Browser is up');

		await page.goto(url || 'https://is.bible.build/engesv/gen/1', {
			waitUntil: 'networkidle0',
		});
		// console.log('Dom content loaded');
		// await page.waitForSelector('.main-wrapper');
		// console.log('.main-wrapper is now on the page');

		html = await page.content();
		// console.log('content is available');

		await browser.close();
	});

	return html;
};

const app = express();

app.get('*', async (req, res) => {
	// const origin = `${req.protocol}://${req.get('host')}`;
	// const html = await ssr(`${origin}/index.html`);
	const url = req.url;
	const route = `https://is.bible.build${url}`;
	// console.log('route', route);
	// console.log('req', req);

	const html = await ssr(route);

	res.status(200).send(html);
});

app.listen('3000', () => console.log('Server Started')); // eslint-disable-line no-console

module.exports = {
	ssr,
};
