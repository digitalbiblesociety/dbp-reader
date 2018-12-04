// Has the test variable for if I run the project locally without newrelic
if (process.env.NODE_ENV === 'production' && process.env.TEST !== 'test') {
	require('newrelic'); // eslint-disable-line
}
require('@babel/polyfill');
require('dotenv').config();
const express = require('express');
const next = require('next');
const compression = require('compression');
const LRUCache = require('lru-cache');
const fetch = require('isomorphic-fetch');
const crypto = require('crypto');
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV === 'development';
const manifestJson = require('./static/manifest');
const app = next({ dev });
const handle = app.getRequestHandler();

const ssrCache = new LRUCache({
	max: 100,
	maxAge:
		process.env.NODE_ENV === 'production' ? 1000 * 60 * 60 * 24 : 1000 * 60 * 5,
});

function getCacheKey(req) {
	return `${req.url}`;
}

function parseServerCookie(cookie) {
	return cookie
		.split('; ')
		.filter((c) => c.includes('bible_is_ref'))
		.reduce((a, c) => {
			const ca = c.split('=');
			return {
				...a,
				[ca[0]]: ca[1],
			};
		}, {});
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

		// TODO: Ask api team for the redirect for oauth be to /oauth instead of just /
		// Then I can move all of the extra logic out of this route which is really gross
		server.get('/', async (req, res) => {
			let cookie;

			if (req.headers.cookie) {
				cookie = parseServerCookie(req.headers.cookie);
			}
			if (process.env.IS_DEV) {
				console.log('logs for development testing');
				console.log(req.query.code);
			}

			if (req.query.code && req.headers.cookie) {
				// Get encrypted string of user data
				const encryptedData = req.query.code;
				// Decrypt user data
				const secret = crypto
					.createHash('sha-256')
					.update(
						`${process.env.DBP_API_KEY}${process.env.NOTES_PROJECT_ID}`,
						'utf8',
					)
					.digest();

				// Might need an initialization vector
				const decipher = crypto.createDecipheriv('aes-128-cbc', secret, null);
				// May need to turn encryptedData into a buffer
				decipher.update(encryptedData, 'base64');

				const userString = decipher.final('ascii');
				console.log('userString', userString);
				const userObject = userString.split(',').reduce((a, c, i) => {
					if (i === 0) {
						return { ...a, userId: c };
					} else if (i === 1) {
						return { ...a, email: c };
					} else if (i === 2) {
						return { ...a, name: c };
					}
					return a;
				}, {});
				console.log('user object', userObject);
				// Facebook sent a id code
				// Only save code for 1 minute, that is just enough time to get the user
				const mins = 1000 * 60;
				// TODO: May not need to set this cookie since I have the code here
				// I think I only need this if I do yet another redirect/api call, but
				// I don't want to do that
				res.setHeader('SET-COOKIE', [
					`bible_is_cb_code=${req.query.code}; expires=${new Date(
						new Date().getTime() + mins,
					).toUTCString()}; path=/`,
				]);
				// TODO: Determine exactly how the api returns here to only use one of the if statements
				if (userObject) {
					res.setHeader('SET-COOKIE', [
						`bible_is_user_id=${userObject.id}; path=/`,
					]);
					res.setHeader('SET-COOKIE', [
						`bible_is_user_authenticated=${true}; path=/`,
					]);
					res.setHeader('SET-COOKIE', [
						`bible_is_email=${userObject.email}; path=/`,
					]);
					res.setHeader('SET-COOKIE', [
						`bible_is_nickname=${userObject.name}; path=/`,
					]);
					res.setHeader('SET-COOKIE', [
						`bible_is_name=${userObject.name}; path=/`,
					]);
				}
			}
			// TODO: Figure out a way to fix this for languages other than english
			// Probably need to use a cookie to grab the last known location and send the user there
			if (cookie) {
				// console.log(
				//   'cookie redirect',
				//   `/bible/${cookie.bible_is_ref_bible_id ||
				//     'engesv'}/${cookie.bible_is_ref_book_id ||
				//     'mat'}/${cookie.bible_is_ref_chapter || '1'}${
				//     cookie.bible_is_ref_verse ? `/${cookie.bible_is_ref_verse}` : ''
				//   }`,
				// );
				res.redirect(
					`/bible/${cookie.bible_is_ref_bible_id ||
						'engesv'}/${cookie.bible_is_ref_book_id ||
						'mat'}/${cookie.bible_is_ref_chapter || '1'}${
						cookie.bible_is_ref_verse ? `/${cookie.bible_is_ref_verse}` : ''
					}`,
				);
			} else {
				res.redirect('/bible/engesv/mat/1');
			}
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

		server.get('/status', async (req, res) => {
			const ok = await fetch(
				`${process.env.BASE_API_ROUTE}/bibles?v=4&bucket_id=${
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
		server.get('/privacy-policy', (req, res) => handle(req, res));
		server.get('/about-page', (req, res) => handle(req, res));

		server.get('/bible/:bibleId/:bookId/:chapter', (req, res, nextP) => {
			const actualPage = '/app';
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
			//   'Getting bible and book for route',
			//   `${req.protocol}://${req.get('host')}${req.originalUrl}`,
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
			//   'Getting bible and book for route',
			//   `${req.protocol}://${req.get('host')}${req.originalUrl}`,
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

		// if (process.env.NODE_ENV === 'development') {
		// 	https.createServer(certOptions, server).listen(443);
		// } else {
		// 	server.listen(port, (err) => {
		// 		if (err) throw err;
		// 		console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line no-console
		// 	});
		// }
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
