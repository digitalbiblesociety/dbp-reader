require('babel-polyfill');
const express = require('express');
const next = require('next');
const compression = require('compression');
const LRUCache = require('lru-cache');
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV === 'development';
const manifestJson = require('./static/manifest');
// const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

const ssrCache = new LRUCache({
	max: 100,
	maxAge: 1000 * 60 * 5,
});

function getCacheKey(req) {
	return `${req.url}`;
}

async function renderAndCache(req, res, pagePath, queryParams) {
	if (dev) {
		app.render(req, res, pagePath, queryParams);
		return;
	}
	const key = getCacheKey(req);

	if (ssrCache.has(key)) {
		res.setHeader('x-cache', 'HIT');
		res.send(ssrCache.get(key));
		return;
	}

	try {
		const html = await app.renderToHTML(req, res, pagePath, queryParams);

		if (res.statusCode !== 200) {
			res.send(html);
			return;
		}

		ssrCache.set(key, html);

		res.setHeader('x-cache', 'MISS');
		res.send(html);
	} catch (err) {
		app.renderError(err, req, res, pagePath, queryParams);
	}
}

app
	.prepare()
	.then(() => {
		const server = express();

		server.use(compression());

		server.get('/', (req, res) => res.redirect('/bible/engesv/mat/1'));

		const sitemapOptions = {
			root: `${__dirname}/static/sitemaps/`,
			headers: {
				'Content-Type': 'text/xml;charset=UTF-8',
			},
		};
		server.get('/sitemap.xml', (req, res) =>
			res.status(200).sendFile('sitemap-index.xml', sitemapOptions),
		);

		// const manifestOptions = { root: `${__dirname}/static/`, headers: { 'Content-Type': 'application/json;charset=UTF-8' } };

		server.get('/manifest.json', (req, res) =>
			res.status(200).json(manifestJson),
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

		server.get('/bible/:bibleId/:bookId/:chapter', (req, res, nextP) => {
			const actualPage = '/app';
			// Params may not actually be passed using this method
			// console.log(req.originalUrl.includes('/static'))
			// console.log('Caught the chapter request ----------');
			//
			// console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
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
				!req.originalUrl.includes('/static') &&
				!queryParams.verse &&
				!isNaN(parseInt(req.params.chapter, 10))
			) {
				renderAndCache(req, res, actualPage, queryParams);
			} else {
				nextP();
			}
		});

		server.get('/bible/:bibleId/:bookId/:chapter/:verse', (req, res, nextP) => {
			const actualPage = '/app';
			// console.log(req.originalUrl.includes('/static'))
			// console.log('Caught the verse request ---------------')
			// console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
			// Params may not actually be passed using this method
			const queryParams = {
				bibleId: req.params.bibleId,
				bookId: req.params.bookId,
				chapter: req.params.chapter,
				verse: req.params.verse,
			};
			if (
				queryParams.verse !== 'style.css' &&
				!req.originalUrl.includes('/static') &&
				!isNaN(parseInt(req.params.verse, 10)) &&
				!isNaN(parseInt(req.params.chapter, 10))
			) {
				renderAndCache(req, res, actualPage, queryParams);
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
				renderAndCache(req, res, actualPage, queryParams);
			} else {
				nextP();
			}
		});

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
				renderAndCache(req, res, actualPage, queryParams);
			} else {
				nextP();
			}
		});

		server.get('*', (req, res) => handle(req, res));

		server.listen(port, (err) => {
			if (err) throw err;
			console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line no-console
		});

		// This code was causing the server to hang forever when in development, need to tweak it to enable a graceful shutdown
		// process.on('SIGINT', () => {
		// 	app.close((err) => {
		// 		if (err) {
		// 			console.error(err); // eslint-disable-line no-console
		// 			process.exit(1);
		// 		}
		// 	});
		// });
	})
	.catch((ex) => {
		/* eslint-disable no-console */
		console.error(
			'------------------------^_^---*_*--$_$--------------------------------\n',
			ex,
		);
		/* eslint-enable no-console */
		process.exit(1);
	});
