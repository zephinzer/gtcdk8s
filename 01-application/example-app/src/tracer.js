const {BatchRecorder, Tracer, jsonEncoder} = require('zipkin');
const {HttpLogger} = require('zipkin-transport-http');
const CLSContext = require('zipkin-context-cls');
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;

let _ctxImpl;
let _tracer;
let _localServiceName;

module.exports = {
  init: ({
    remoteZipkinUrl,
    localServiceName,
  }) => {
    _ctxImpl = new CLSContext();
    _localServiceName = localServiceName;
    _tracer = new Tracer({
      ctxImpl: _ctxImpl,
      recorder: new BatchRecorder({
        logger: new HttpLogger({
          endpoint: `${remoteZipkinUrl}/api/v2/spans`,
          jsonEncoder: jsonEncoder.JSON_V2,
          httpInterval: 1000
        })
      }),
      traceId128Bit: true,
      localServiceName,
    });
  },
  getContext: () => _ctxImpl,
  getLocalServiceName: () => _localServiceName,
  getMiddleware: () =>
    zipkinMiddleware({tracer: _tracer}),
  getTracer: () => _tracer,
};
