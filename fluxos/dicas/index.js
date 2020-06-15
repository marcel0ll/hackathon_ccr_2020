const { sleep, getRandom } = require("../../util");

const { users } = require("../../storage");
const dicas = require("./dicas");
const eventos = require("./eventos");
const contatos = require("./contatos");

const key = "O chapa responde!";

const submenu = {
  dicas: "Dicas",
  eventos: "Eventos!",
  fale: "Fale com alguém!",
  site: "Conheça nosso site!",
};

const init = (bot) => {
  bot.onText(new RegExp(`${key}`, "i"), main(bot));

  bot.onText(new RegExp(submenu.dicas), onDicas(bot));
  bot.onText(new RegExp(submenu.eventos), onEventos(bot));
  bot.onText(new RegExp(submenu.fale), onFale(bot));
  bot.onText(new RegExp(submenu.site), onSite(bot));

  eventos.forEach((e) => {
    bot.onText(new RegExp(e[0]), onEventoAnswer(bot));
  });

  contatos.forEach((e) => {
    bot.onText(new RegExp(e[0]), onFaleAnswer(bot));
  });
};

const main = (bot) => async (msg, match) => {
  let user = await users.findOne({ chatId: msg.chat.id });
  if (!user) {
    return;
  }

  user.state = `${key}.submenu`;
  await user.save();

  bot.sendMessage(
    msg.chat.id,
    `O que você quer saber ${msg.chat.first_name}?`,
    {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [
          [submenu.dicas, submenu.eventos],
          [submenu.fale, submenu.site],
        ],
      },
    }
  );
};

const onDicas = (bot) => async (msg, match) => {
  let user = await users.findOne({ chatId: msg.chat.id });
  if (!user) {
    return;
  }

  if (user.state !== `${key}.submenu`) {
    return;
  }

  let dica = getRandom(dicas);

  for (let i = 0; i < dica.length; i++) {
    bot.sendMessage(msg.chat.id, dica[i]);
    await sleep(0.6);
  }

  await sleep(1);
  bot.sendMessage(msg.chat.id, `Quer saber mais?`, {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [["Quero sim!"]],
    },
  });

  user.state = "init";
  await user.save();
};

const onEventos = (bot) => async (msg, match) => {
  let user = await users.findOne({ chatId: msg.chat.id });
  if (!user) {
    return;
  }

  if (user.state !== `${key}.submenu`) {
    return;
  }

  let buttons = eventos.map((e) => {
    return [e[0]];
  });

  bot.sendMessage(msg.chat.id, `Esses são os eventos da região!`, {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [...buttons],
    },
  });

  user.state = `${key}.eventos`;
  await user.save();
};

const onFale = (bot) => async (msg, match) => {
  let user = await users.findOne({ chatId: msg.chat.id });
  if (!user) {
    return;
  }

  if (user.state !== `${key}.submenu`) {
    return;
  }

  let dica = getRandom(dicas);

  let buttons = contatos.map((e) => {
    return [e[0]];
  });

  bot.sendMessage(
    msg.chat.id,
    `Esses são os profissionais da saúde disponíveis na região!`,
    {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [...buttons],
      },
    }
  );

  user.state = `${key}.fale`;
  await user.save();
};

const onEventoAnswer = (bot) => async (msg, match) => {
  let user = await users.findOne({ chatId: msg.chat.id });
  if (!user) {
    return;
  }

  if (user.state !== `${key}.eventos`) {
    return;
  }

  let evtKey = match[0];

  let evento = eventos.find((e) => e[0] === evtKey);

  if (evento) {
    for (let i = 0; i < evento.length; i++) {
      bot.sendMessage(msg.chat.id, evento[i]);
      await sleep(0.6);
    }
  }

  await sleep(1);
  bot.sendMessage(msg.chat.id, `Quer saber mais?`, {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [["Quero sim!"]],
    },
  });

  user.state = "init";
  await user.save();
};

const onFaleAnswer = (bot) => async (msg, match) => {
  let user = await users.findOne({ chatId: msg.chat.id });
  if (!user) {
    return;
  }

  if (user.state !== `${key}.fale`) {
    return;
  }

  let evtKey = match[0];

  let contato = contatos.find((e) => e[0] === evtKey);

  if (contato) {
    for (let i = 0; i < contato.length; i++) {
      bot.sendMessage(msg.chat.id, contato[i]);
      await sleep(0.6);
    }
  }

  await sleep(1);
  bot.sendMessage(msg.chat.id, `Quer saber mais?`, {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [["Quero sim!"]],
    },
  });

  user.state = "init";
  await user.save();
};

const onSite = (bot) => async (msg, match) => {
  let user = await users.findOne({ chatId: msg.chat.id });
  if (!user) {
    return;
  }

  if (user.state !== `${key}.submenu`) {
    return;
  }

  bot.sendMessage(msg.chat.id, `https://omeuchapa.com/info`);

  await sleep(1);
  bot.sendMessage(msg.chat.id, `Quer saber mais?`, {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [["Quero sim!"]],
    },
  });

  user.state = "init";
  await user.save();
};

module.exports = {
  key,
  init,
};
