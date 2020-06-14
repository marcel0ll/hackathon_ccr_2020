require("dotenv").config();
require("./server");

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

const { users, places, votes } = require("./storage");

const flows = {
  [banheiro.key]: banheiro,
  [alimentacao.key]: alimentacao,
  [combustivel.key]: combustivel,
  [descanso.key]: descanso,
  [dicas.key]: dicas,
};
// fluxos
banheiro.init(bot);
alimentacao.init(bot);
combustivel.init(bot);
descanso.init(bot);
dicas.init(bot);

const teclado = async (msg) => {
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

const initFlow = async (msg, match) => {
  // if user does not exist, register
  let user;
  if (!(await users.has({ chatId: msg.chat.id }))) {
    user = users.new(msg.from.first_name, msg.chat.id);

    await user.save().catch((e) => error("failed to save user"));
    debug("Saved new user:", user.id);

    const allUsers = await users.list();
    debug("Users count:", process.env.REPO_TYPE, allUsers.length);
  } else {
    user = await users.findOne({ chatId: msg.chat.id });
  }

  if (!user.phoneNumber) {
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
  } else {
    if (user.state === "visiting") {
      let place = await places.findOne({
        "location.coordinates": [
          user.lastPlaceVisitedId.longitude,
          user.lastPlaceVisitedId.latitude,
        ],
      });

      bot.sendMessage(
        msg.chat.id,
        `${msg.from.first_name} você visitou ${place.nomeFantasia}?`,
        {
          reply_markup: {
            one_time_keyboard: true,
            keyboard: [["Sim", "Não"]],
          },
        }
      );

      user.state = "visiting.confirmation";
      await user.save();
    } else {
      user.state = "init";
      await user.save();

      await teclado(msg);
    }
  }
};

const ynFlow = async (msg, match) => {
  let user = await users.findOne({ chatId: msg.chat.id });
  if (!user) {
    return;
  }

  let reply = match[0];

  if (reply === "Sim") {
    let place = await places.findOne({
      "location.coordinates": [
        user.lastPlaceVisitedId.longitude,
        user.lastPlaceVisitedId.latitude,
      ],
    });

    if (user.state === "visiting.confirmation") {
      bot.sendMessage(msg.chat.id, `Você recomendaria ${place.nomeFantasia}?`, {
        reply_markup: {
          one_time_keyboard: true,
          keyboard: [["Sim", "Não"]],
        },
      });

      user.state = "visiting.voting";
      await user.save();
    } else if (user.state == "visiting.voting") {
      let vote = votes.new(user, place);
      await vote.save();

      place.score += 1;
      await place.save();

      user.state = "init";
      await user.save();

      await teclado(msg);
    }
  } else {
    user.state = "init";
    await user.save();

    await teclado(msg);
  }
};

const onMessage = async (msg) => {
  debug(`${msg.from.first_name}`, msg);
  let user = await users.findOne({ chatId: msg.chat.id });
  if (!user) {
    return;
  }

  debug(user.firstName, user.state);

  // if there is msg on
  if (!user.phoneNumber && msg.contact) {
    let user = await users.findOne({ chatId: msg.chat.id });
    user.phoneNumber = msg.contact.phone_number;
    await user.save().catch((e) => error("failed to save user phone"));
    debug("Saved user phone:", user.id);

    await teclado(msg);
    return;
  }

  if (msg.location) {
    if (Object.keys(flows).includes(user.state)) {
      const flow = flows[user.state];

      flow.withLocation(bot, msg, user);

      user.state += ".options";
      await user.save();
      return;
    }
  }
};

bot.on("message", onMessage);
bot.onText(/\/start/i, initFlow);
bot.onText(/oi/i, initFlow);
bot.onText(/Sim|Não/i, ynFlow);
