const convict = require('convict');
const fluentd = require('fluent-logger');

const config = convict({
  fluentHost: {
    default: 'localhost',
    env: 'FLUENTD_HOST',
  },
  fluentPort: {
    default: '24224',
    env: 'FLUENTD_PORT',
  },
});

const logger = fluentd.createFluentSender('test-fluentd-ok', {
  host: config.get('fluentHost'),
  port: config.get('fluentPort'),
  timeout: 5.0,
  reconnectInterval: 5000,
});

logger.on('error', (error) => {
  console.info('error ):');
});

logger.on('connect', () => {
  console.error('connected bitch');
  clearTimeout(connectionTest);
  process.exit(0);
});

let connectionTest = null;
(function testForConnection() {
  connectionTest = setTimeout(() => {
    console.info('check');
    logger.emit('test', {hello: 'world'});
    testForConnection();
  }, 1000);
})();

