require("dotenv").config();

const { debug, error } = require("./util");

const { TELEGRAM_BOT_API } = process.env;

const TelegramBot = require("node-telegram-bot-api");

const banheiro = require("./fluxos/banheiro");
const alimentacao = require("./fluxos/alimentacao");
const combustivel = require("./fluxos/combustivel");
const descanso = require("./fluxos/descanso");
const dicas = require("./fluxos/dicas");

const token = TELEGRAM_BOT_API;

// TODO: polling é ótimo para prototipo e testes, mas produção precisaria ser um webhook
const bot = new TelegramBot(token, { polling: true });

const { users } = require("./storage");

// fluxos
banheiro.init(bot);
alimentacao.init(bot);
combustivel.init(bot);
descanso.init(bot);
dicas.init(bot);

const initFlow = async (msg, match) => {
  if (!(await users.has({ chatId: msg.chat.id }))) {
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
  }

  bot.sendMessage(
    msg.chat.id,
    `O que você quer saber ${msg.chat.first_name}?`,
    {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [
          [banheiro.key, alimentacao.key],
          [combustivel.key, descanso.key],
          [dicas.key],
        ],
      },
    }
  );
};

const onMessage = async (msg) => {
  debug(`${msg.from.first_name}`, msg);

  // if user does not exist, register
  if (!(await users.has({ chatId: msg.chat.id }))) {
    let user = users.new(msg.from.first_name, msg.chat.id);

    await user.save().catch((e) => error("failed to save user"));
    debug("Saved new user:", user.id);

    const allUsers = await users.list();
    debug("Users count:", process.env.REPO_TYPE, allUsers.length);
  }

  // if there is msg on
  if (msg.contact) {
    let user = await users.findOne({ chatId: msg.chat.id });
    user.phoneNumber = msg.contact.phone_number;
    await user.save().catch((e) => error("failed to save user phone"));
    debug("Saved user phone:", user.id);

    bot.sendMessage(msg.chat.id, `O que você quer saber ${user.firstName}?`, {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [
          [banheiro.key, alimentacao.key],
          [combustivel.key, descanso.key],
          [dicas.key],
        ],
      },
    });
  }
};

bot.on("message", onMessage);
bot.onText(/\/start/i, initFlow);
bot.onText(/oi/i, initFlow);
