const convict = require('convict');
const {
  createConsoleTransport,
  createFluentTransport,
  createLogger,
} = require('@mcf/logger');
const createServer = require('@mcf/server-boilerplate-middleware');
const {createTracer, getWinstonFormat} = require('@mcf/tracer');
const {createRequest} = require('@mcf/request');

const config = convict({
  serviceName: {
    default: 'unknown',
    env: 'INSTANCE_ID',
  },
  servicePort: {
    default: '11111',
    env: 'PORT',
  },
  nextServer1Id: {
    default: 'unknown',
    env: 'NEXT_SERVER_1_ID',
  },
  nextServer1Url: {
    default: 'http://localhost',
    env: 'NEXT_SERVER_1',
  },
  nextServer2Id: {
    default: 'unknown',
    env: 'NEXT_SERVER_2_ID',
  },
  nextServer2Url: {
    default: 'http://localhost',
    env: 'NEXT_SERVER_2',
  },
  fluentHost: {
    default: 'localhost',
    env: 'FLUENTD_HOST',
  },
  fluentPort: {
    default: '24224',
    env: 'FLUENTD_PORT',
  },
  zipkinHost: {
    default: 'localhost',
    env: 'ZIPKIN_HOST',
  },
  zipkinPort: {
    default: '9411',
    env: 'ZIPKIN_PORT',
  },
});

const tracer = createTracer({
  localServiceName: config.get('serviceName'),
  serverHost: config.get('zipkinHost'),
  serverPort: config.get('zipkinPort'),
  sampleRate: 1,
});

const context = tracer.getContext();

const logger = createLogger({
  formatters: [getWinstonFormat({context})],
  level: 0,
  transports: [
    createConsoleTransport(),
    createFluentTransport({
      host: config.get('fluentHost'),
      port: config.get('fluentPort'),
    }),
  ],
});

const request = createRequest({tracer: tracer.getTracer()});

const server = createServer({
  tracing: {
    tracer: tracer.getTracer(),
    context: tracer.getContext(),
  },
});

const instanceId = config.get('serviceName');
const proxyIdOne = config.get('nextServer1Id');
const proxyUrlOne = config.get('nextServer1Url');
const proxyIdTwo = config.get('nextServer2Id');
const proxyUrlTwo = config.get('nextServer2Url');

server.use(tracer.getExpressMiddleware());

/**
 * Retrieves the response from the next server #1
 */
server.get('/next-server-1', (_request, response) => {
  request(proxyIdOne, proxyUrlOne)
    .then((res) => res.text())
    .then((nextServerResponse) => {
      response.json(nextServerResponse);
    });
});

/**
 * Retrieves the response from the next server #2
 */
server.get('/next-server-2', (_request, response) => {
  request(proxyIdTwo, proxyUrlTwo)
    .then((res) => res.text())
    .then((nextServerResponse) => {
      response.json(nextServerResponse);
    });
});

/**
 * Use this to demonstrate what a multi-application call looks like in series
 */
server.get('/next-servers-simple-sequential', (_request, response) => {
  request(proxyIdOne, proxyUrlOne)
    .then(() => request(proxyIdTwo, proxyUrlTwo))
    .then(() => {
      response.json('done - /next-servers-simple-sequential');
    });
});

/**
 * Use this to demonstrate what a multi-application call looks like in parallel
 */
server.get('/next-servers-simple-parallel', (_request, response) => {
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
server.get('/next-servers-complex-sequential', (_request, response) => {
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
server.get('/next-servers-complex-parallel', (_request, response) => {
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

server.get('/complex-error/:iteration', (req, response, next) => {
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
server.get('/error', (_request, _response, next) => {
  logger.error('Something disastrous happens here');
  next(new Error('Something disastrous happened'));
});

server.get('/healthz', (_request, response) => {
  response
    .status(200)
    .json('ok');
});

/**
 * Base replies
 */
server.get('/', (request, response) => {
  logger.info(`Hello from ${instanceId}`);
  response.json(`Hello from ${instanceId}`);
});

/**
 * The all-encompassing error handler
 */
server.use((err, _request, response, _next) => {
  response
    .status(500)
    .json({
      message: err.message,
      stack: err.stack.split('\n'),
    });
});

const instance = server.listen(config.get('servicePort'));

instance.on('listening', () => {
  logger.info(`Listening at http://127.0.0.1:${instance.address().port}`);
});
