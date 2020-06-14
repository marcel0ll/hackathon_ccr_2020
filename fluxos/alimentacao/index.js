const { sleep } = require("../../util");

const key = "Alimentacao";

const init = (bot) => {
  bot.onText(new RegExp(`${key}`, "i"), main(bot));
};

const main = (bot) => async (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `Fluxo ${key}`);
};

const withLocation = (bot, msg) => {
  bot.sendMessage(
    msg.chat.id,
    `Sua localização: ${msg.location.long} / ${msg.location.lat}`
  );
};

module.exports = {
  key,
  init,
  withLocation,
};
