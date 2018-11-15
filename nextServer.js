// Has the test variable for if I run the project locally without newrelic
if (process.env.NODE_ENV === 'production' && process.env.TEST !== 'test') {
  require('newrelic'); // eslint-disable-line
}
require('@babel/polyfill');
require('dotenv').config();
const express = require('express');
const next = require('next');
const compression = require('compression');
// const fs = require('fs');
// const path = require('path');
// const https = require('https');
const LRUCache = require('lru-cache');
const fetch = require('isomorphic-fetch');
// const port =
// 	process.env.NODE_ENV === 'development' ? 443 : process.env.PORT || 3000;
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV === 'development';
const manifestJson = require('./static/manifest');
// const dev = false;
// const certOptions = {
// 	key: fs.readFileSync(path.resolve('./server.key')),
// 	cert: fs.readFileSync(path.resolve('./server.crt')),
// };
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

    server.get('/', async (req, res) => {
      // console.log('request on server', req.originalUrl);
      // console.log('query', req.query.code);
      // console.log('cookie', req.headers.cookie);

      if (req.query.code && req.headers.cookie) {
        // Facebook sent a id code
        // Only save code for 1 minute, that is just enough time to get the user
        const mins = 1000 * 60;
        res.setHeader('SET-COOKIE', [
          `bible_is_cb_code=${req.query.code}; expires=${new Date(
            new Date().getTime() + mins,
          ).toUTCString()}; path=/`,
        ]);
        // console.log(
        //   'date',
        //   new Date(new Date().getTime() + mins).toUTCString(),
        // );
        console.log(
          'before fetch',
          req.headers.cookie
            .split('; ')
            .find((c) => c.split('=')[0] === 'bible_is_provider')
            .split('=')[1],
        );
        console.log(
          'request url',
          `${process.env.BASE_API_ROUTE}/login/${
            req.headers.cookie
              .split('; ')
              .find((c) => c.split('=')[0] === 'bible_is_provider')
              .split('=')[1]
          }/callback?v=4&project_id=${process.env.NOTES_PROJECT_ID}&key=${
            process.env.DBP_API_KEY
          }&alt_url=true&code=${req.query.code}`,
        );

        const user = await fetch(
          `${process.env.BASE_API_ROUTE}/login/${
            req.headers.cookie
              .split('; ')
              .find((c) => c.split('=')[0] === 'bible_is_provider')
              .split('=')[1]
          }/callback?v=4&project_id=${process.env.NOTES_PROJECT_ID}&key=${
            process.env.DBP_API_KEY
          }&alt_url=true&code=${req.query.code}`,
        )
          .then((body) => {
            console.log('in fetch');
            return body.json();
          })
          .catch((err) => {
            console.log('Error getting oauth user', err);
            res.redirect('/bible/engesv/mat/1');
          });

        console.log('user on server', user);

        // Authentication Information
        // userId = user.data.id || '';
        // isAuthenticated = !!user.data.id;

        // User Profile
        // userProfile.email = user.data.email || '';
        // userProfile.nickname = user.data.nickname || '';
        // userProfile.name = user.data.first_name || '';
        // userProfile.avatar = '';
      }
      // TODO: Figure out a way to fix this for languages other than english
      // Probably need to use a cookie to grab the last known location and send the user there
      res.redirect('/bible/engesv/mat/1');
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
      // console.log('req stuff', req.originalUrl);
      // console.log('req route', req.route);
      // console.log('cookie: ', req && req.headers && req.headers.cookie);
      const queryParams = {
        bibleId: req.params.bibleId,
        bookId: req.params.bookId,
        chapter: req.params.chapter,
      };
      // res.setHeader('SET-COOKIE', [
      //   'mySpecialTest=the stuff inside the cookie',
      //   'type=ninja',
      //   'language=javascript',
      // ]);

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
