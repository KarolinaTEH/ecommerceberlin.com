const express = require('express');
const cookieSession = require('cookie-session');
const next = require('next');
const LRUCache = require('lru-cache');
const querystring = require('query-string');
const fetch = require('isomorphic-unfetch');
const _keyBy = require('lodash/keyBy');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dir: '.', dev });
const handle = app.getRequestHandler();

const i18n = require('./i18n');

const apiUrl = 'https://api.eventjuicer.com/v1/public/hosts/targiehandlu.pl/';

const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60 // 1hour
});

app
  .prepare()
  .then(() => {
    const server = express();

    // const protocol = req.headers['x-forwarded-proto'] || 'http';
    // const baseUrl = req ? `${protocol}://${req.headers.host}` : '';

    server.use(
      cookieSession({
        name: 'eventjuicer-site',
        keys: ['dumb'],
        //Cookie Options
        maxAge: 180 * 24 * 60 * 60 * 1000 // 24 hours
      })
    );

    server.use(async function(req, res, next) {
      const texts = await i18n.getTexts(ssrCache, 'purge' in req.query);

      res.locals.texts = texts;

      req.session.views = (req.session.views || 0) + 1;

      res.locals.counter = req.session.views;
      res.locals.locale = req.session.locale || '';

      next(); // <-- important!
    });

    //  server.get('/c,:id,:creative', (req, res) => {
    //    const queryParams = { id: req.params.id, creative : req.params.creative }
    //    res.redirect('/agenda?utm_content=')
    //
    //   // app.render(req, res, '/exhibitor', queryParams)
    // //  REDIRECT
    //    //renderAndCache(req, res, '/company', queryParams)
    //  })

    // server.get('/locale/:locale', (req, res) => {
    //   req.session.locale = req.params.locale
    //  /// res.redirect('/')
    // })

    server.get('/stage,:stage', (req, res) => {
      renderAndCache(req, res, '/stage', { stage: req.params.stage });
    });

    server.get('/ticket,:hash', (req, res) => {
      renderAndCache(req, res, '/ticket', { hash: req.params.hash });
    });

    server.get('/thankyou,:hash', (req, res) => {
      renderAndCache(req, res, '/thankyou', { hash: req.params.hash });
    });

    server.get('/archive,:id', (req, res) => {
      renderAndCache(req, res, '/archive', { id: req.params.id });
    });

    server.get('/invite,:id', (req, res) => {
      renderAndCache(req, res, '/invite', { id: req.params.id });
    });

    server.get('/:slug,s,:id', (req, res) => {
      renderAndCache(req, res, '/speaker', { id: req.params.id });
    });

    server.get('/:slug,c,:id', (req, res) => {
      renderAndCache(req, res, '/company', { id: req.params.id });
    });

    // Serve the item webpage with next.js as the renderer
    server.get('/setup', async (req, res) => {
      const texts = await i18n.getTexts(ssrCache, 'purge' in req.query);
      app.render(req, res, '/setup', { texts });
    });

    // When rendering client-side, we will request the same data from this route
    server.get('/_data/texts', async (req, res) => {
      const texts = await i18n.getTexts(ssrCache);
      res.json(texts);
    });

    server.get('/', (req, res) => {
      renderAndCache(req, res, '/', {});
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });

async function fetchFromApiEndpoint(endpoint) {
  const _res = await fetch(`${apiUrl}${endpoint}`);
  const res = await _res.json();
  return res;
}

function cacheApiResult(endpoint) {
  if (ssrCache.has(endpoint)) {
    res.setHeader('x-api-cache', 'HIT');
    res.send(ssrCache.get(key));
    return;
  }

  // fetchFromApiEndpoint(endpoint).
  // then(data => data.data).
  // then()
}

/*
 * NB: make sure to modify this to take into account anything that should trigger
 * an immediate page change (e.g a locale stored in req.session)
 */
function getCacheKey(req) {
  return `${req.url}`;
}

async function renderAndCache(req, res, pagePath, queryParams) {
  const key = getCacheKey(req);

  const purge = 'purge' in req.query;

  if (purge) {
    ssrCache.del(key);
  }

  //const texts = await i18n.getTexts(ssrCache)
  //add (cached) texts...

  //accessing middleware data....
  queryParams.texts = res.locals.texts;

  // If we have a page in the cache, let's serve it
  if (ssrCache.has(key)) {
    res.setHeader('x-cache', 'HIT');
    res.send(ssrCache.get(key));
    return;
  }

  try {
    // If not let's render the page into HTML
    const html = await app.renderToHTML(req, res, pagePath, queryParams);

    // Something is wrong with the request, let's skip the cache
    if (dev || res.statusCode !== 200) {
      res.setHeader('x-cache', 'SKIP');
      res.send(html);
      return;
    }

    // Let's cache this page
    ssrCache.set(key, html);
    res.setHeader('x-cache', 'MISS');
    res.send(html);
  } catch (err) {
    app.renderError(err, req, res, pagePath, queryParams);
  }
}