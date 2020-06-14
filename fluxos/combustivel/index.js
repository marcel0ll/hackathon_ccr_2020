const { sleep, requestLocation } = require("../../util");

const { users, places } = require("../../storage");
const key = "Combustivel";

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

const withLocation = async (bot, msg) => {
  let { longitude, latitude } = msg.location;

  console.log(longitude, latitude);

  let near = await places.near(longitude, latitude);

  console.log(near);

  bot.sendMessage(msg.chat.id, `Sua localização: ${longitude} / ${latitude}`);
};

module.exports = {
  key,
  init,
  withLocation,
};
