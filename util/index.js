const { NODE_ENV } = process.env;

module.exports.isProd = NODE_ENV === "production";
module.exports.isDev = NODE_ENV !== "production";

module.exports.sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
