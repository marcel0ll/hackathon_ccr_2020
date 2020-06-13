require("dotenv").config();

const { isDebugging } = require("./util");

const { TELEGRAM_BOT_API } = process.env;

const TelegramBot = require("node-telegram-bot-api");
const fluxoConversar = require("./fluxos/conversar");

const token = TELEGRAM_BOT_API;

// TODO: polling é ótimo para prototipo e testes, mas produção precisaria ser um webhook
const bot = new TelegramBot(token, { polling: true });

const { users } = require("./storage");

// definir todos os botões principais e deixar para cada fluxo o registro de seus hooks

bot.onText(/\/start/i, (msg, match) => {
  bot.sendMessage(
    msg.chat.id,
    `Fala meu chapa ${msg.from.first_name}! Para começarmos vou precisar de seu número.`,
    {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [[{ text: "Enviar número?", request_contact: true }]],
      },
    }
  );
});

// fluxos
fluxoConversar.init(bot);

bot.on("message", async (msg) => {
  if (isDebugging) {
    console.log(`${msg.from.first_name}`, msg);
  }

  if (!(await users.has({ chatId: msg.chat.id }))) {
    let user = users.new(msg.from.first_name, msg.chat.id);

    await user.save().catch((e) => console.log("failed to save user"));

    console.log(user);
  }

  const allUsers = await users.list();
  console.log("Users count", process.env.REPO_TYPE, allUsers.length);
});
