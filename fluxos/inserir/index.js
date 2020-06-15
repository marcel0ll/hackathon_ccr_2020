const { sleep } = require("../../util");

const { users } = require("../../storage");
const key = "Enviar novo local";

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
    `É só me mandar sua posição que vou procurar saber sobre esse local.`,
    {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [
          [
            { text: "Enviar localização?", request_location: true },
            "Cancelar!",
          ],
        ],
      },
    }
  );

  user.state = key;
  await user.save();
};

const withLocation = (bot, msg, user) => {
  bot.sendMessage(
    msg.chat.id,
    `Muito obrigado ${msg.from.first_name}, vou analisar e te aviso!`
  );

  bot.sendMessage(msg.chat.id, `Precisa de mais alguma coisa?`, {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [["Opa"]],
    },
  });

  return true;
};

module.exports = {
  key,
  init,
  withLocation,
};
