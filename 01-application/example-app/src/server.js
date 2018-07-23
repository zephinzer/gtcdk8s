const superagent = require('superagent');
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
  _server.use((request, response, next) => {
    logger.info(request.headers);
    next();
  });

  _server.get('/next-server-1', (_request, response) => {
    request(proxyIdOne, proxyUrlOne)
      .then((res) => res.text())
      .then((nextServerResponse) => {
        response.json(nextServerResponse);
      });
  });

  _server.get('/next-server-2', (_request, response) => {
    request(proxyIdTwo, proxyUrlTwo)
      .then((res) => res.text())
      .then((nextServerResponse) => {
        response.json(nextServerResponse);
      });
  });

  _server.get('/next-servers-simple-sequential', (_request, response) => {
    request(proxyIdOne, proxyUrlOne)
      .then(() => request(proxyIdTwo, proxyUrlTwo))
      .then(() => {
        response.json('done - /next-servers-simple-sequential');
      });
  });

  _server.get('/next-servers-simple-parallel', (_request, response) => {
    Promise.all([
      request(proxyIdOne, proxyUrlOne),
      request(proxyIdTwo, proxyUrlTwo),
    ]).then(() => {
      response.json('done - /next-servers-simple-parallel');
    });
  });

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

  _server.get('/', (request, response) => {
    logger.info(`Hello from ${instanceId}`);
    response.json(`Hello from ${instanceId}`);
  });

  _server.use((err, _request, response, _next) => {
    response.json({
      message: err.message,
      stack: err.stack.split('\n'),
    });
  });

  return _server;
};


module.exports = server;