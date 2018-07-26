const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
	.prepare()
	.then(() => {
		const server = express();

		const sitemapOptions = {
			root: `${__dirname}/static/sitemaps/`,
			headers: {
				'Content-Type': 'text/xml;charset=UTF-8',
			},
		};
		server.get('/sitemap.xml', (req, res) =>
			res.status(200).sendFile('sitemap-index.xml', sitemapOptions),
		);

		server.get('/dev-sitemap*', (req, res) =>
			res.status(200).sendFile(req.originalUrl, sitemapOptions),
		);

		const faviconOptions = {
			root: `${__dirname}/static/`,
		};
		server.get('/favicon.ico', (req, res) =>
			res.status(200).sendFile('favicon.ico', faviconOptions),
		);

		server.get('/_next*', (req, res) => {
			// console.log('caught _next request');
			handle(req, res);
		});

		server.get('/reset/password/:token', (req, res) => {
			const actualPage = '/app';
			const queryParams = {
				token: req.params.token,
			};
			// console.log(
			// 	'Getting reset password token',
			// 	`${req.protocol}://${req.get('host')}${req.originalUrl}`,
			// );

			app.render(req, res, actualPage, queryParams);
		});

		server.get('/terms', (req, res) => handle(req, res));
		server.get('/privacy-policy', (req, res) => handle(req, res));
		server.get('/about-page', (req, res) => handle(req, res));

		server.get('/bible/:bibleId', (req, res, nextP) => {
			const actualPage = '/app';
			// console.log(req.originalUrl.includes('/static'))
			// console.log(
			// 	'Getting bible and book for route',
			// 	`${req.protocol}://${req.get('host')}${req.originalUrl}`,
			// );
			// Params may not actually be passed using this method
			const queryParams = {
				bibleId: req.params.bibleId,
				bookId: 'mat',
				chapter: '1',
			};

			if (
				queryParams.verse !== 'style.css' &&
				!req.originalUrl.includes('/static')
			) {
				app.render(req, res, actualPage, queryParams);
			} else {
				nextP();
			}
		});

		server.get('/bible/:bibleId/:bookId', (req, res, nextP) => {
			const actualPage = '/app';
			// console.log(req.originalUrl.includes('/static'))
			// console.log(
			// 	'Getting bible and book for route',
			// 	`${req.protocol}://${req.get('host')}${req.originalUrl}`,
			// );
			// Params may not actually be passed using this method
			const queryParams = {
				bibleId: req.params.bibleId,
				bookId: req.params.bookId,
				chapter: '1',
			};

			if (
				queryParams.verse !== 'style.css' &&
				!req.originalUrl.includes('/static')
			) {
				app.render(req, res, actualPage, queryParams);
			} else {
				nextP();
			}
		});

		server.get('/bible/:bibleId/:bookId/:chapter', (req, res, nextP) => {
			const actualPage = '/app';
			// Params may not actually be passed using this method
			// console.log(req.originalUrl.includes('/static'))
			// console.log(
			// 	'Getting bible and book and chapter for route',
			// 	`${req.protocol}://${req.get('host')}${req.originalUrl}`,
			// );
			const queryParams = {
				bibleId: req.params.bibleId,
				bookId: req.params.bookId,
				chapter: req.params.chapter,
			};
			if (
				queryParams.verse !== 'style.css' &&
				!req.originalUrl.includes('/static')
			) {
				app.render(req, res, actualPage, queryParams);
			} else {
				nextP();
			}
		});

		server.get('/bible/:bibleId/:bookId/:chapter/:verse', (req, res, nextP) => {
			const actualPage = '/app';
			// console.log(req.originalUrl.includes('/static'))
			// console.log(
			// 	'Getting bible and book and chapter and verse for route',
			// 	`${req.protocol}://${req.get('host')}${req.originalUrl}`,
			// );
			// Params may not actually be passed using this method
			const queryParams = {
				bibleId: req.params.bibleId,
				bookId: req.params.bookId,
				chapter: req.params.chapter,
				verse: req.params.verse,
			};
			if (
				queryParams.verse !== 'style.css' &&
				!req.originalUrl.includes('/static')
			) {
				app.render(req, res, actualPage, queryParams);
			} else {
				nextP();
			}
		});

		server.get('*', (req, res) => handle(req, res));

		server.listen(3000, (err) => {
			if (err) throw err;
			console.log('> Ready on http://localhost:3000'); // eslint-disable-line no-console
		});
	})
	.catch((ex) => {
		/* eslint-disable no-console */
		console.error(
			'---------------------------------------------------------------\n',
			ex.stack,
		);
		/* eslint-enable no-console */
		process.exit(1);
	});
