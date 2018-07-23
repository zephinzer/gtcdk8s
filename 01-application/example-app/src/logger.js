const url = require('url');
const {createLogger, format, transports} = require('winston');
const fluentTransport = require('fluent-logger').support.winstonTransport();

const tracer = require('./tracer');

const fluentUrl = url.parse(process.env.FLUENT_URL);

const fluentOptions = {
  host: fluentUrl.hostname,
  port: fluentUrl.port,
  timeout: 3.0,
  requireAckResponse: true,
};

const fluentLogger = new fluentTransport(fluentOptions);

const logger = createLogger({
  level: 0,
  exitOnError: false,
  format: format.combine(
    format((info) => {
      if (typeof info.message !== 'object') {
        info.message = {data: info.message};
      }
      info.message.spanId = tracer.getTracer().id.spanId;
      info.message.parentId = tracer.getTracer().id.parentId;
      info.message.traceId = tracer.getTracer().id.traceId;
      info.message.sampled = tracer.getTracer().id.sampled;
      return info;
    })(),
    format.timestamp(),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    fluentLogger,
  ],
});

module.exports = logger;
