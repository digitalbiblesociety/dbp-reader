const express = require('express');
const next = require('next');

const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const eApp = express();

	eApp.use('*', (req, res) => {
		console.log('Caught request');

		if (req.url) {
			console.log('req.url', req.url);
			app.render(req, res, req.url);
		}

		// app.render(req, res, '/app');
		handle(req, res);
	});

	eApp.listen(3000, (err) => {
		if (err) throw err;
		console.log('> Ready on port 3k');
	});
});
