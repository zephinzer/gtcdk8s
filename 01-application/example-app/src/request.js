const fetch = require('node-fetch');
const wrapFetch = require('zipkin-instrumentation-fetch');
const tracer = require('./tracer');

module.exports = (remoteServiceName, remoteUrl, options) =>
  wrapFetch(fetch, {
    tracer: tracer.getTracer(),
    remoteServiceName,
  })(remoteUrl, options);
