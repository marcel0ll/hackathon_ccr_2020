const { sleep, requestLocation } = require("../../util");
const { users } = require("../../storage");

const key = "Banheiro";

const init = (bot) => {
  bot.onText(new RegExp(`${key}`, "i"), main(bot));
};

const main = (bot) => async (msg, match) => {
  let user = await users.findOne({ chatId: msg.chat.id });
  if (!user) {
    return;
  }

  user.state = key;
  await user.save();

  requestLocation(bot, msg);
};

const withLocation = (bot, msg) => {
  bot.sendMessage(
    msg.chat.id,
    `Sua localização: ${msg.location.longitude} / ${msg.location.latitude} pro banheiro`
  );
};

module.exports = {
  key,
  init,
  withLocation,
};
