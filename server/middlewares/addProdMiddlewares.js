const path = require('path');
const fs = require('fs');
const express = require('express');
// const pupperender = require('pupperender');
const compression = require('compression');

module.exports = function addProdMiddlewares(app, options) {
	const publicPath = options.publicPath || '/';
	const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');

	// compression middleware compresses your server responses which makes them
	// smaller (applies also to assets). You can read more about that technique
	// and other good practices on official Express.js docs http://mxs.is/googmy
	app.use(compression());
	// app.use(pupperender.makeMiddleware({}));
	app.use(publicPath, express.static(outputPath));
	// console.log('Inside add prod middleware');
	app.get('*', async (req, res) => {
		// console.log('Inside app.get for prod');
		// whole url = `${req.protocol}://${req.get('host')}${req.originalUrl}`
		if (req.originalUrl) {
			const parsedUrl = req.originalUrl
				.slice(1)
				.replace(/\//g, '-')
				.toLowerCase();
			let hasHtml = false;
			await fs.access(
				`${outputPath}/${parsedUrl}.html`,
				fs.constants.F_OK,
				(err) => {
					if (!err) {
						hasHtml = true;
					}
					// console.log(`Has Html = ${err ? 'false' : 'true'}`);
				},
			);

			if (hasHtml) {
				res.sendFile(path.resolve(outputPath, `${parsedUrl}.html`));
			} else {
				res.sendFile(path.resolve(outputPath, 'index.html'));
			}
			// console.log('Sending rendered html');
		} else {
			// console.log('Sending normal html');
			res.sendFile(path.resolve(outputPath, 'index.html'));
		}
	});
};
