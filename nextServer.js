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

		server.get('/reset/password/:token', (req, res) => {
			const actualPage = '/app';
			const queryParams = {
				token: req.params.token,
			};

			app.render(req, res, actualPage, queryParams);
		});

		server.get('/terms', (req, res) => handle(req, res));
		server.get('/privacy-policy', (req, res) => handle(req, res));
		server.get('/about-page', (req, res) => handle(req, res));
		server.get('/404', (req, res) => handle(req, res));

		server.get('/:bibleId', (req, res) => {
			const actualPage = '/app';
			// Params may not actually be passed using this method
			const queryParams = {
				bibleId: req.params.bibleId,
			};
			app.render(req, res, actualPage, queryParams);
		});
		server.get('/:bibleId/:bookId', (req, res) => {
			const actualPage = '/app';
			// Params may not actually be passed using this method
			const queryParams = {
				bibleId: req.params.bibleId,
				bookId: req.params.bookId,
			};
			app.render(req, res, actualPage, queryParams);
		});
		server.get('/:bibleId/:bookId/:chapter', (req, res) => {
			const actualPage = '/app';
			// Params may not actually be passed using this method
			const queryParams = {
				bibleId: req.params.bibleId,
				bookId: req.params.bookId,
				chapter: req.params.chapter,
			};
			app.render(req, res, actualPage, queryParams);
		});
		server.get('/:bibleId/:bookId/:chapter/:verse', (req, res) => {
			const actualPage = '/app';
			// Params may not actually be passed using this method
			const queryParams = {
				bibleId: req.params.bibleId,
				bookId: req.params.bookId,
				chapter: req.params.chapter,
				verse: req.params.verse,
			};
			app.render(req, res, actualPage, queryParams);
		});

		server.get('*', (req, res) => {
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
			console.log('> Ready on http://localhost:3000');
		});
	})
	.catch((ex) => {
		console.error(
			'---------------------------------------------------------------\n',
			ex.stack,
		);
		process.exit(1);
	});
