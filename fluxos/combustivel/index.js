const { sleep, requestLocation, getRandom } = require("../../util");

const { users, places, votes } = require("../../storage");
const key = "Combustivel";

const init = (bot) => {
  bot.onText(new RegExp(`^${key}$`, "i"), main(bot));
  bot.onText(new RegExp(`^\\d+(?=\.)`, "i"), choseOption(bot));
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

const withLocation = async (bot, msg, user) => {
  let { longitude, latitude } = msg.location;

  let near = await places.near(longitude, latitude);
  let nearPartners = near.filter((p) => p.partner);

  let counter = 5;
  let options = [];

  if (nearPartners.length) {
    options.push(getRandom(nearPartners));
    counter -= 1;
  }

  for (let i = counter; i > 0; i--) {
    options.push(near[counter - i]);
  }

  user.options = options;
  await user.save();

  let keysPromises = options.map(async (o, i) => {
    let count = await votes.find({
      latitude: o.latitude,
      longitude: o.longitude,
    });

    return `${i + 1}. (${count.length}) ${o.nome_fantasia}`;
  });

  let keys = await Promise.all(keysPromises);
  keys = keys.map((k) => [k]);

  bot.sendMessage(msg.chat.id, `Estes são os postos próximos`, {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [...keys],
    },
  });
};

const choseOption = (bot) => async (msg, match) => {
  let user = await users.findOne({ chatId: msg.chat.id });
  if (!user) {
    return;
  }

  let i = parseInt(match[0]) - 1;
  let option = places.from(user.options[i]);

  bot.sendMessage(msg.chat.id, `Este é o ${option.nome_fantasia}`);
  if (option.telefone) {
    await sleep(1.5);
    bot.sendMessage(msg.chat.id, `Telefone: ${option.telefone}`);
  }
  await sleep(1.5);
  bot.sendLocation(msg.chat.id, option.latitude, option.longitude);

  await sleep(1.5);
  bot.sendMessage(msg.chat.id, `Espero que você goste!`);

  user.lastPlaceVisitedId = option.id;

  user.state = "visiting";
  await user.save();
};

module.exports = {
  key,
  init,
  withLocation,
};
