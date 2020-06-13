const { NODE_ENV, DEBUG } = process.env;

module.exports.isProd = NODE_ENV === "production";
module.exports.isDev = NODE_ENV !== "production";
module.exports.isDebugging = NODE_ENV !== "production" || DEBUG === "true";

module.exports.sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
