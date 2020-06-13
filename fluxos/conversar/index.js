const { clearMarkup } = require("../../util");

function init(config, bot) {
  bot.onText(/\/conversar/i, oiCallback, clearMarkup);
}

const oiCallback = (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `Fala meu chapa ${msg.from.first_name}`);
  bot.sendMessage(chatId, "O que você precisa?");
};

module.exports = {
  init,
};
