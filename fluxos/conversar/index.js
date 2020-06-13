const { sleep } = require("../../util");

function init(bot) {
  bot.onText(/\/conversar/i, oiCallback(bot));
}

const oiCallback = (bot) => async (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `Fala meu chapa ${msg.from.first_name}`);
  await sleep(5000);
  bot.sendMessage(chatId, "O que você precisa?");
};

module.exports = {
  init,
};
