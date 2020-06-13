function init(bot) {
  bot.onText(/oi/i, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "Fala meu chapa " + msg.from.first_name);
    bot.sendMessage(chatId, "O que você precisa?");
  });
}

module.exports = {
  init,
};
