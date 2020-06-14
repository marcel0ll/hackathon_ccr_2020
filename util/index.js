const { NODE_ENV, DEBUG } = process.env;

const isProd = NODE_ENV === "production";
const isDev = NODE_ENV !== "production";
const isDebugging = NODE_ENV !== "production" || DEBUG === "true";

module.exports.sleep = (s) => {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
};

module.exports.debug = (...msg) => {
  if (isDebugging) {
    console.log(...msg);
  }
};

module.exports.error = (...msg) => {
  console.error(...msg);
};

module.exports.requestLocation = (bot, msg) => {
  bot.sendMessage(
    msg.chat.id,
    `Meu chapa ${msg.from.first_name}! Vou precisar da sua localização.`,
    {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [[{ text: "Enviar localização?", request_location: true }]],
      },
    }
  );
};

module.exports.getRandom = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

module.exports = {
  ...module.exports,
  isProd,
  isDev,
  isDebugging,
};
