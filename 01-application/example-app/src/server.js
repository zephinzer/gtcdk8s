const boilerplate = require('@mcf/server-boilerplate-middleware');
const tracer = require('./tracer');
const request = require('./request');

const logger = require('./logger');

function server({
  instanceId,
  proxyIdOne,
  proxyIdTwo,
  proxyUrlOne,
  proxyUrlTwo,
}) {
  const _server = boilerplate({
    serverLogging: {
      logLevel: 'info',
      logStream: {
        write: (accessLog) => logger.http(Object.assign(JSON.parse(accessLog), {
          spanId: tracer.getTracer().id.spanId,
          parentId: tracer.getTracer().id.parentId,
          traceId: tracer.getTracer().id.traceId,
          sampled: tracer.getTracer().id.sampled,
        })),
      },
    },
  });

  _server.use(tracer.getMiddleware());

  /**
   * Retrieves the response from the next server #1
   */
  _server.get('/next-server-1', (_request, response) => {
    request(proxyIdOne, proxyUrlOne)
      .then((res) => res.text())
      .then((nextServerResponse) => {
        response.json(nextServerResponse);
      });
  });

  /**
   * Retrieves the response from the next server #2
   */
  _server.get('/next-server-2', (_request, response) => {
    request(proxyIdTwo, proxyUrlTwo)
      .then((res) => res.text())
      .then((nextServerResponse) => {
        response.json(nextServerResponse);
      });
  });

  /**
   * Use this to demonstrate what a multi-application call looks like in series
   */
  _server.get('/next-servers-simple-sequential', (_request, response) => {
    request(proxyIdOne, proxyUrlOne)
      .then(() => request(proxyIdTwo, proxyUrlTwo))
      .then(() => {
        response.json('done - /next-servers-simple-sequential');
      });
  });

  /**
   * Use this to demonstrate what a multi-application call looks like in parallel
   */
  _server.get('/next-servers-simple-parallel', (_request, response) => {
    Promise.all([
      request(proxyIdOne, proxyUrlOne),
      request(proxyIdTwo, proxyUrlTwo),
    ]).then(() => {
      response.json('done - /next-servers-simple-parallel');
    });
  });

  /**
   * Use this to simulate a series of API calls to the various application instances
   */
  _server.get('/next-servers-complex-sequential', (_request, response) => {
    request(proxyIdOne, proxyUrlOne)
      .then(() => request(proxyIdOne, `${proxyUrlOne}/next-server-1`))
      .then(() => request(proxyIdOne, `${proxyUrlOne}/next-server-2`))
      .then(() => request(proxyIdTwo, proxyUrlTwo))
      .then(() => request(proxyIdTwo, `${proxyUrlTwo}/next-server-1`))
      .then(() => request(proxyIdTwo, `${proxyUrlTwo}/next-server-2`))
      .then(() => {
        response.json('done - /next-servers-complex-sequential');
      });
  });

  /**
   * Use this to simulate a complex network of API calls amongst application instances
   */
  _server.get('/next-servers-complex-parallel', (_request, response) => {
    Promise.all([
      request(proxyIdOne, proxyUrlOne),
      request(proxyIdOne, `${proxyUrlOne}/next-server-1`),
      request(proxyIdOne, `${proxyUrlOne}/next-server-2`),
      request(proxyIdTwo, proxyUrlTwo),
      request(proxyIdOne, `${proxyUrlTwo}/next-server-1`),
      request(proxyIdOne, `${proxyUrlTwo}/next-server-2`),
    ]).then(() => {
      response.json('done - /next-servers-complex-parallel');
    });
  });

  _server.get('/complex-error/:iteration', (req, response, next) => {
    const {iteration} = req.params;
    const nextNumber = (typeof iteration !== 'number') ? 5 : iteration - 1;
    const proxies = [
      {id: proxyIdOne, url: `${proxyUrlOne}`},
      {id: proxyIdOne, url: `${proxyUrlOne}/next-server-1`},
      {id: proxyIdOne, url: `${proxyUrlOne}/next-server-2`},
      {id: proxyIdOne, url: `${proxyUrlOne}/next-servers-complex-sequential`},
      {id: proxyIdOne, url: `${proxyUrlOne}/next-servers-complex-sequential`},
      {id: proxyIdOne, url: `${proxyUrlOne}/complex-error/${nextNumber}`},
      {id: proxyIdTwo, url: `${proxyUrlTwo}/complex-error/${nextNumber}`},
      {id: proxyIdTwo, url: `${proxyUrlTwo}`},
      {id: proxyIdTwo, url: `${proxyUrlTwo}`},
      {id: proxyIdTwo, url: `${proxyUrlTwo}/next-server-1`},
      {id: proxyIdTwo, url: `${proxyUrlTwo}/next-server-2`},
      {id: proxyIdTwo, url: `${proxyUrlTwo}/next-servers-complex-sequential`},
      {id: proxyIdTwo, url: `${proxyUrlTwo}/next-servers-simple-parallel`},
      {id: proxyIdTwo, url: `${proxyUrlTwo}/error`}
    ];
    if (nextNumber > 0) {
      Promise.all((() => {
        let connections = [];
        // we iterate to the number of proxies so that statistically we should get an error
        for (let i = 0; i < proxies.length; ++i) {
          const proxySelection = proxies[Math.floor(Math.random() * proxies.length)];
          connections.push(
            request(proxySelection.id, proxySelection.url).then((res) => res.json())
          );
        }
        return connections;
      })()).then((results) => {
        console.info(results);
        response.json({
          results
        });
      }).catch((err) => {
        response.json(err);
      });
    } else {
      response.json('you got lucky');
    }
  });

  /**
   * Use this to simulate an error which will hit the all-encompassing error-handler
   */
  _server.get('/error', (_request, _response, next) => {
    logger.error('Something disastrous happens here');
    next(new Error('Something disastrous happened'));
  });

  _server.get('/healthz', (_request, response) => {
    response
      .status(200)
      .json('ok');
  });

  /**
   * Base replies
   */
  _server.get('/', (request, response) => {
    logger.info(`Hello from ${instanceId}`);
    response.json(`Hello from ${instanceId}`);
  });

  /**
   * The all-encompassing error handler
   */
  _server.use((err, _request, response, _next) => {
    response
      .status(500)
      .json({
        message: err.message,
        stack: err.stack.split('\n'),
      });
  });

  return _server;
};


module.exports = server;