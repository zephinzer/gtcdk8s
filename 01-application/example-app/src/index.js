const logger = require('./logger');
const tracer = require('./tracer');
const server = require('./server');

tracer.init({
  remoteZipkinUrl: process.env.ZIPKIN_URL,
  localServiceName: process.env.INSTANCE_ID,
});

const instance = server({
  instanceId: process.env.INSTANCE_ID,
  proxyIdOne: process.env.NEXT_SERVER_1_ID,
  proxyIdTwo: process.env.NEXT_SERVER_2_ID,
  proxyUrlOne: process.env.NEXT_SERVER_1,
  proxyUrlTwo: process.env.NEXT_SERVER_2,
}).listen(process.env.PORT);

instance.on('listening', () => {
  logger.info(`Listening on port ${process.env.PORT}`);
});
