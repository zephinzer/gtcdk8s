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

  /**
   * Use this to simulate an error which will hit the all-encompassing error-handler
   */
  _server.get('/error', (_request, _response, next) => {
    logger.error('Something disastrous happens here');
    next(new Error('Something disastrous happened'));
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