// Has the test variable for if I run the project locally without newrelic
if (
	(process.env.NODE_ENV === 'production' ||
		process.env.NODE_ENV === 'staging') &&
	process.env.TEST !== 'test'
) {
	require('newrelic'); // eslint-disable-line
}
require('@babel/polyfill');
require('dotenv').config();
const cp = require('child_process');
const express = require('express');
const next = require('next');
const compression = require('compression');
const LRUCache = require('lru-cache');
const fetch = require('isomorphic-fetch');
// const crypto = require('crypto');p
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV === 'development';
const bugsnag = require('./app/utils/bugsnagServer');
const manifestJson = require('./static/manifest');
const checkBookId = require('./app/utils/checkBookName');
const app = next({ dev });
const handle = app.getRequestHandler();

const ssrCache = new LRUCache({
	max: 1000,
	maxAge: dev ? 1000 * 60 * 5 : 1000 * 60 * 60 * 24,
});

async function renderAndCache(req, res, pagePath, queryParams) {
	// Stop caching individual routes as it is causing inconsistencies with the audio types
	app.render(req, res, pagePath, queryParams);
}

app
	.prepare()
	.then(() => {
		const server = express();

		server.use(compression());

		// TODO: Ask api team for the redirect for oauth be to /oauth instead of just /
		// Then I can move all of the extra logic out of this route which is really gross
		server.get('/', async (req, res) => {
			if (req.query.code) {
				// TODO: Put decryption process into try catch for safety
				// Get encrypted string of user data
				const encryptedData = req.query.code;
				const userString = Buffer.from(encryptedData, 'base64').toString(
					'ascii',
				);
				const userArray = userString.split(',');

				res.redirect(
					301,
					`/bible/ENGESV/MAT/1?user_id=${userArray[0]}&user_email=${
						userArray[1]
					}&user_name=${userArray[2]}`,
				);
			} else {
				res.redirect(301, '/bible/ENGESV/MAT/1');
			}
		});

		server.get('/clean-the-cash', (req, res) => {
			ssrCache.reset();
			res.send('Cleaned the cache');
		});

		server.get('/oauth', (req, res) => {
			const userString = Buffer.from(req.query.code, 'base64').toString(
				'ascii',
			);
			// console.log('userString', userString);
			const userArray = userString.split(',');
			// console.log('user array', userArray);
			res.redirect(
				301,
				`/bible/ENGESV/MAT/1?user_id=${userArray[0]}&user_email=${
					userArray[1]
				}&user_name=${userArray[2]}`,
			);
		});

		const sitemapOptions = {
			root: `${__dirname}/static/sitemaps/`,
			headers: {
				'Content-Type': 'text/xml;charset=UTF-8',
			},
		};
		server.get('/sitemap.xml', (req, res) =>
			res.status(200).sendFile('sitemap-index.xml', sitemapOptions),
		);

		server.get('/git/version', async (req, res) => {
			cp.exec('git rev-parse HEAD', (err, stdout) => {
				if (err) {
					res.status(500).send('Could not get the revision head');
				} else {
					res.status(200).json({ head: stdout.replace('\n', '') });
				}
			});
		});

		server.get('/status', async (req, res) => {
			const ok = await fetch(
				`${process.env.BASE_API_ROUTE}/bibles?v=4&asset_id=${
					process.env.DBP_BUCKET_ID
				}&key=${process.env.DBP_API_KEY}&language_code=6414`,
			)
				.then((r) => r.status >= 200 && r.status < 300)
				.catch(() => false);

			if (ok) {
				res.sendStatus(200);
			} else {
				res.sendStatus(500);
			}
		});

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
		server.get('/privacy', (req, res) => handle(req, res));
		server.get('/about', (req, res) => handle(req, res));

		server.get('/bible/:bibleId/:bookId/:chapter', (req, res, nextP) => {
			const actualPage = '/app';
			const bookId = checkBookId(req.params.bookId);
			const chapter =
				isNaN(parseInt(req.params.chapter, 10)) || !req.params.chapter
					? '1'
					: req.params.chapter;
			const queryParams = {
				bibleId: req.params.bibleId,
				bookId,
				chapter,
			};
			const userParams = {};
			// console.count('------- chapter');
			// console.log('req params', req.params);
			// console.log('req.query', req.query);

			if (bookId !== req.params.bookId) {
				res.redirect(301, `/bible/${req.params.bibleId}/${bookId}/${chapter}`);
			} else if (
				req.query.user_id &&
				req.query.user_email &&
				req.query.user_name
			) {
				userParams.userId = req.query.user_id;
				userParams.userEmail = req.query.user_email;
				userParams.userName = req.query.user_name;

				// Remove all the query data so it doesn't appear in the url
				req.query = {};
			}

			if (
				queryParams.verse !== 'style.css' &&
				!req.originalUrl.includes('/static') &&
				!queryParams.verse
			) {
				renderAndCache(req, res, actualPage, { ...queryParams, ...userParams });
			} else {
				nextP();
			}
		});

		server.get('/bible/:bibleId/:bookId/:chapter/:verse', (req, res, nextP) => {
			const actualPage = '/app';
			const bookId = checkBookId(req.params.bookId);
			const chapter =
				isNaN(parseInt(req.params.chapter, 10)) || !req.params.chapter
					? '1'
					: req.params.chapter;
			const verse =
				isNaN(parseInt(req.params.verse, 10)) || !req.params.verse
					? '1'
					: req.params.verse;
			// console.count('------- verse');
			// console.log('req params', req.params);
			// console.log('req.query', req.query);
			// console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
			// Params may not actually be passed using this method
			const queryParams = {
				bibleId: req.params.bibleId,
				bookId,
				chapter,
				verse,
			};

			if (bookId !== req.params.bookId) {
				res.redirect(
					301,
					`/bible/${req.params.bibleId}/${bookId}/${chapter}/${verse}`,
				);
			} else if (
				queryParams.verse !== 'style.css' &&
				!req.originalUrl.includes('/static')
			) {
				renderAndCache(req, res, actualPage, queryParams);
			} else {
				nextP();
			}
		});

		server.get('/bible/:bibleId/:bookId', (req, res, nextP) => {
			const actualPage = '/app';
			const bookId = checkBookId(req.params.bookId);
			// console.log(req.originalUrl.includes('/static'))
			// console.log(
			//   'Getting bible and book for route',
			//   `${req.protocol}://${req.get('host')}${req.originalUrl}`,
			// );
			// Params may not actually be passed using this method
			const queryParams = {
				bibleId: req.params.bibleId,
				bookId,
				chapter: '1',
			};

			if (bookId !== req.params.bookId) {
				res.redirect(301, `/bible/${req.params.bibleId}/${bookId}/1`);
			} else if (
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
			//   'Getting bible and book for route',
			//   `${req.protocol}://${req.get('host')}${req.originalUrl}`,
			// );
			// Params may not actually be passed using this method
			const queryParams = {
				bibleId: req.params.bibleId,
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

		// if (process.env.NODE_ENV === 'development') {
		// 	https.createServer(certOptions, server).listen(443);
		// } else {
		// 	server.listen(port, (err) => {
		// 		if (err) throw err;
		// 		console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line no-console
		// 	});
		// }
		server.listen(port, (err) => {
			if (
				err &&
				(process.env.NODE_ENV === 'production' ||
					process.env.NODE_ENV === 'staging')
			) {
				bugsnag.notify(err);
			}
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
		if (process.env.NODE_ENV !== 'development') {
			bugsnag.notify(ex);
		}
		/* eslint-enable no-console */
		process.exit(1);
	});
