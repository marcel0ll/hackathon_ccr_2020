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
    `Polícia rodoviária: 111
Polícia militar: 111
Bombeiros: 111
Concessionária: 111
Centro de valorização da vida: 111
Ambulância: 111`
  );

  user.state = "init";
  await user.save();
};

module.exports = {
  key,
  init,
};
