require("dotenv").config();
require("./server");

const { sleep, debug, error } = require("./util");

const { TELEGRAM_BOT_API } = process.env;

const TelegramBot = require("node-telegram-bot-api");

const banheiro = require("./fluxos/banheiro");
const alimentacao = require("./fluxos/alimentacao");
const combustivel = require("./fluxos/combustivel");
const descanso = require("./fluxos/descanso");
const dicas = require("./fluxos/dicas");
const telefones = require("./fluxos/telefones");
const inserirLocal = require("./fluxos/inserir");

const token = TELEGRAM_BOT_API;

// TODO: polling é ótimo para prototipo e testes, mas produção precisaria ser um webhook
const bot = new TelegramBot(token, { polling: true });

const { users, places, votes } = require("./storage");

const yes = "✅ Sim";
const no = "❎ Não";

const flows = {
  [banheiro.key]: banheiro,
  [alimentacao.key]: alimentacao,
  [combustivel.key]: combustivel,
  [descanso.key]: descanso,
  [inserirLocal.key]: inserirLocal,
};
// fluxos
banheiro.init(bot);
alimentacao.init(bot);
combustivel.init(bot);
descanso.init(bot);
dicas.init(bot);
telefones.init(bot);
inserirLocal.init(bot);

const teclado = async (msg) => {
  bot.sendMessage(msg.chat.id, `O que você precisa ${msg.chat.first_name}?`, {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [
        [banheiro.key, alimentacao.key],
        [combustivel.key, descanso.key],
        [dicas.key, inserirLocal.key],
        [telefones.key],
      ],
    },
  });
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
      `Fala meu chapa ${msg.from.first_name}! Para começarmos vou precisar de seu telefone.
É só clicar no botão abaixo!
      `,
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
        longitude: user.lastPlaceVisitedId.longitude,
        latitude: user.lastPlaceVisitedId.latitude,
      });

      bot.sendMessage(
        msg.chat.id,
        `${msg.from.first_name} você visitou ${place.nomeFantasia}?`,
        {
          reply_markup: {
            one_time_keyboard: true,
            keyboard: [[yes, no]],
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

  if (reply === yes) {
    let place = await places.findOne({
      longitude: user.lastPlaceVisitedId.longitude,
      latitude: user.lastPlaceVisitedId.latitude,
    });

    if (user.state === "visiting.confirmation") {
      bot.sendMessage(msg.chat.id, `Você recomendaria ${place.nomeFantasia}?`, {
        reply_markup: {
          one_time_keyboard: true,
          keyboard: [[yes, no]],
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

      bot.sendMessage(
        msg.chat.id,
        `Agradeço por responder, isso ajuda todos os caminhoneiros 🙂`
      );

      await sleep(1);

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

      // migué para não ter que reescrever tudo
      let returnInit = await flow.withLocation(bot, msg, user);

      if (returnInit) {
        user.state = "init";
      } else {
        user.state += ".options";
      }

      await user.save();
      return;
    }
  }
};

bot.on("message", onMessage);
bot.onText(/\/start/i, initFlow);
bot.onText(/^o+i+e*$/i, initFlow);
bot.onText(/^ola$/i, initFlow);
bot.onText(/^olá$/i, initFlow);
bot.onText(/^Quero sim!$/i, initFlow);
bot.onText(/^opa$/i, initFlow);
bot.onText(new RegExp(`${yes}\|${no}`, "i"), ynFlow);

bot.onText(new RegExp(`Cancelar!`), async (msg, match) => {
  await sleep(1);

  bot.sendMessage(msg.chat.id, `Opa! Qualquer coisa só mandar um olá!`, {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [["olá"]],
    },
  });
});
