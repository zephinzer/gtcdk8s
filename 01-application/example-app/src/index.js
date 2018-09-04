const {Boilerplate} = require('@usvc/boilerplate');
const convict = require('convict');

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

Boilerplate.init({
  appAccessLoggingBypassUrls: ['/healthz', '/metrics'],
  appCorsWhitelist: [
    `http://localhost:${config.get('servicePort')}`
  ],
  appReadinessChecks: {
    simulatedFailure: () => new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: false,
          message: 'simulated error',
          data: {
            hello: 'world',
          },
        })
      }, 500);
    }),
  },
  serviceId: config.get('serviceName'),
  fluentdHost: config.get('fluentHost'),
  fluentdPort: config.get('fluentPort'),
  zipkinHost: config.get('zipkinHost'),
  zipkinPort: config.get('zipkinPort'),
});

const {app, logger, request} = Boilerplate;

function callServer(id, uri, callback) {
  if (typeof uri === 'function') {
    request(
      config.get(`nextServer${id}Id`),
      `${config.get(`nextServer${id}Url`)}`,
      uri
    );
  } else {
    request(
      config.get(`nextServer${id}Id`),
      `${config.get(`nextServer${id}Url`)}${uri}`,
      callback
    );
  }
}

app.get('/', (req, res) => {
  res.json(`hello from ${config.get('serviceName')}`);
});

app.get('/next-1', (req, res) => {
  callServer(1,
    (error, response, body) => {
      res.json(JSON.parse(body));
    }
  );
});

app.get('/next-2', (req, res) => {
  callServer(2,
    (error, response, body) => {
      res.json(JSON.parse(body));
    }
  );
});

app.get('/next-sequential', (req, res) => {
  callServer(1, (error, response, body1) =>
    callServer(2,
      (error, response, body2) =>
        res.json([
          {response: JSON.parse(body1)},
          {response: JSON.parse(body2)},
        ])));
});

app.get('/next-parallel', (req, res) => {
  const responses = [];
  const tryToFinish = () => {
    if (responses.length === 2) {
      res.json(responses);
    };
  }
  callServer(1,
    (error, response, body) => {
      responses.push({
        response: JSON.parse(body),
      });
      tryToFinish();
    }
  );
  callServer(2,
    (error, response, body) => {
      responses.push({
        response: JSON.parse(body),
      });
      tryToFinish();
    }
  );
});

app.get('/next-complex/:iteration', (req, res) => {
  let {iteration} = req.params;
  iteration = iteration - 0;
  const possibleCalls = [
    {id: 1},
    {id: 1, uri: '/next-1'},
    {id: 1, uri: '/next-parallel'},
    {id: 1, uri: '/next-sequential'},
    iteration !== 0 ? {id: 1, uri: `/next-complex/${iteration - 1}`} : undefined,
    {id: 2},
    {id: 2, uri: '/next-2'},
    {id: 2, uri: '/next-parallel'},
    {id: 2, uri: '/next-sequential'},
    iteration !== 0 ? {id: 2, uri: `/next-complex/${iteration - 1}`} : undefined,
    {id: 2, uri: '/error'},
  ].filter((v) => v !== undefined);
  const calls = (() => {
    const _calls = [];
    for (let i = 0; i < 5; ++i) {
      _calls.push(possibleCalls[Math.floor(Math.random() * possibleCalls.length)]);
    }
    return _calls;
  })();
  const responses = [];
  let responseCount = 0;
  let errorsExist = false;
  const tryToFinish = () => {
    if (responseCount === calls.length) {
      if (errorsExist) {
        res.json(responses);
      } else {
        logger.error(responses);
        res
          .status(500)
          .json('AN ERROR OCCURRED. Visit http://localhost:49411 to see the trace. Or visit http://localhost:45601 to see the logs.');
      }
    }
  }
  const callback = (_error, _response, body) => {
    if (_response.statusCode === 500) {
      errorsExist = true;
    }
    responseCount += 1;
    const response = JSON.parse(body);
    if (typeof response === 'string') {
      responses.push({response});
    } else if (response instanceof Array) {
      response.forEach((individualResponse) => {
        responses.push(individualResponse);
      });
    }
    tryToFinish();
  };
  calls.forEach((call) => {
    if (call.uri) {
      callServer(call.id, call.uri, callback);
    } else {
      callServer(call.id, callback);
    }
  })
});

app.get('/error', (req, res) => {
  throw new Error(`erroring out from ${config.get('serviceName')}`);
});

app.use((err, req, res, next) => {
  logger.info(err);
  res.status(500);
  if (err.message) {
    res.json(err.message);
  } else {
    res.json('an unknown error happened.');
  }
});

const server = app.listen(config.get('servicePort'));
server.on('listening', (req, res) => {
  logger.info(`${config.get('serviceName')} listening on port http://localhost:${server.address().port}`);
  logger.info(`
serviceName: ${config.get('serviceName')}
servicePort: ${config.get('servicePort')}
nextServer1Id: ${config.get('nextServer1Id')}
nextServer1Url: ${config.get('nextServer1Url')}
nextServer2Id: ${config.get('nextServer2Id')}
nextServer2Url: ${config.get('nextServer2Url')}
fluentHost: ${config.get('fluentHost')}
fluentPort: ${config.get('fluentPort')}
zipkinHost: ${config.get('zipkinHost')}
zipkinPort: ${config.get('zipkinPort')}
  `);
});
