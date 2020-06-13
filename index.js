require("dotenv").config();

const { TELEGRAM_BOT_API, NODE_ENV } = process.env;

const isProd = NODE_ENV === "production";
const isDev = !isProd;

const config = {
  isDev,
  isProd,
  TELEGRAM_BOT_API,
};

const TelegramBot = require("node-telegram-bot-api");
const fluxoConversar = require("./fluxos/conversar");

const token = TELEGRAM_BOT_API;

// TODO: polling é ótimo para prototipo e testes, mas produção precisaria ser um webhook
const bot = new TelegramBot(token, { polling: true });

// definir todos os botões principais e deixar para cada fluxo o registro de seus hooks

bot.onText(/\/start/i, (msg, match) => {
  bot.sendMessage(
    msg.chat.id,
    `Fala meu chapa ${msg.from.first_name}! Para começarmos vou precisar de seu número.`,
    {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [[{ text: "Enviar número?", request_contact: true }]],
      },
    }
  );
});

// fluxos
fluxoConversar.init(config, bot);

// debugging

if (isDev) {
  bot.on("message", (msg) => {
    console.log(`${msg.from.first_name}`, msg);
  });
}
