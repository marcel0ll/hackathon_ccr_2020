const { sleep } = require("../../util");

const { users } = require("../../storage");
const key = "Telefones";

const init = (bot) => {
  bot.onText(new RegExp(`${key}`, "i"), main(bot));
};

const main = (bot) => async (msg, match) => {
  let user = await users.findOne({ chatId: msg.chat.id });
  if (!user) {
    return;
  }

  bot.sendMessage(
    msg.chat.id,
    `Bombeiros: 193
Ambulância: 192

Polícia Rodoviária Federal: 191
Polícia Rodoviária Estadual: 198
Polícia Militar: 190
Polícia Civil: 197

Disque Denúncia: 181

Centro de Valorização da Vida - CVV: 188
`
  );

  sleep(2);

  bot.sendMessage(msg.chat.id, `Se precisar, só enviar um oi`, {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [["Oi"]],
    },
  });

  user.state = "init";
  await user.save();
};

module.exports = {
  key,
  init,
};
