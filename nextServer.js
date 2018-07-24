const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
	.prepare()
	.then(() => {
		const server = express();

		// server.get('/p/:id', (req, res) => {
		// 	const actualPage = '/post';
		// 	const queryParams = { id: req.params.id };
		// 	app.render(req, res, actualPage, queryParams);
		// });
		// server.get('/http:/*', (req, res) => {
		// 	console.log('caught the api request I hope', `${req.protocol}://${req.get('host')}${req.originalUrl}`);
		// 	handle(req, res);
		// })

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
		server.get('/404', (req, res) => handle(req, res));

		// server.get('/:bibleId', (req, res) => {
		// 	const actualPage = '/app';
		// 	console.log('Getting bible for route', `${req.protocol}://${req.get('host')}${req.originalUrl}`);
		//
		// 	// Params may not actually be passed using this method
		// 	const queryParams = {
		// 		bibleId: req.params.bibleId,
		// 	};
		// 	app.render(req, res, actualPage, queryParams);
		// });
		server.get('/bible/:bibleId/:bookId', (req, res) => {
			const actualPage = '/app';
			// console.log(
			// 	'Getting bible and book for route',
			// 	`${req.protocol}://${req.get('host')}${req.originalUrl}`,
			// );
			// Params may not actually be passed using this method
			const queryParams = {
				bibleId: req.params.bibleId,
				bookId: req.params.bookId,
			};
			app.render(req, res, actualPage, queryParams);
		});
		server.get('/bible/:bibleId/:bookId/:chapter', (req, res) => {
			const actualPage = '/app';
			// Params may not actually be passed using this method
			// console.log(
			// 	'Getting bible and book and chapter for route',
			// 	`${req.protocol}://${req.get('host')}${req.originalUrl}`,
			// );
			const queryParams = {
				bibleId: req.params.bibleId,
				bookId: req.params.bookId,
				chapter: req.params.chapter,
			};
			app.render(req, res, actualPage, queryParams);
		});
		server.get('/bible/:bibleId/:bookId/:chapter/:verse', (req, res, nextP) => {
			const actualPage = '/app';
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
			if (queryParams.verse !== 'style.css') {
				app.render(req, res, actualPage, queryParams);
			}
			nextP();
		});

		server.get('*', (req, res) => {
			// console.log(
			// 	'in get * with url: ',
			// 	`${req.protocol}://${req.get('host')}${req.originalUrl}`,
			// );

			// const actualPage = '/app';
			// // Params may not actually be passed using this method
			// const queryParams = {
			// 	bibleId: req.params.bibleId,
			// 	bookId: req.params.bookId,
			// 	chapter: req.params.chapter,
			// 	verse: req.params.verse,
			// };
			// app.render(req, res, actualPage, queryParams);
			return handle(req, res);
		});

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
