require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
let bot = null;

if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
  console.info('Telegram bot token found!');
  bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});
  bot.on('message', (msg) => {
    bot.sendMessage(msg.chat.id, `chat id: ${msg.chat.id}`);
  });
} else {
  console.error('Telegram bot token not found.');
}
const server = require('express')();
server.use(require('body-parser').json());

server.post('/', (req, res, next) => {
  const {body} = req;
  body.alerts.forEach((alert) => {
    if (bot !== null && bot.sendMessage) {
      bot.sendMessage(process.env.TELEGRAM_CHAT_ID,
        `ALERT : ${alert.labels.alertname} : ${alert.labels.job}\n`
        + `${alert.annotations.summary} - ${alert.annotations.description}`
      );
    } else {
      console.info(`ALERT : ${alert.labels.alertname} : ${alert.labels.job}\n`
      + `${alert.annotations.summary} - ${alert.annotations.description}`)
    }
  });
  res.json('ok');
});

server.listen(59093).on('listening', () => {
  console.info('Listening on port 59093');
});
