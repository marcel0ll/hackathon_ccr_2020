const { NODE_ENV, DEBUG } = process.env;

const isProd = NODE_ENV === "production";
const isDev = NODE_ENV !== "production";
const isDebugging = NODE_ENV !== "production" || DEBUG === "true";

module.exports.sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports.debug = (...msg) => {
  if (isDebugging) {
    console.log(...msg);
  }
};

module.exports.error = (...msg) => {
  console.error(...msg);
};

module.exports = {
  ...module.exports,
  isProd,
  isDev,
  isDebugging,
};
