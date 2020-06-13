require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const fluxoConversar = require("./fluxos/conversar");

const token = process.env.TELEGRAM_BOT_API;

// TODO: polling é ótimo para prototipo e testes, mas produção precisaria ser um webhook
const bot = new TelegramBot(token, { polling: true });

// definir todos os botões principais e deixar para cada fluxo o registro de seus hooks
// TODO: mandar teclado para telegram

// fluxos
fluxoConversar.init(bot);
