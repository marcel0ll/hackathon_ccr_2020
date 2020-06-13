const User = require("./user");

const {
  TELEGRAM_BOT_API,
  MONGO_DB_NAME,
  MONGO_URL,
  MONGO_USER,
  MONGO_PASS,
  REPO_TYPE,
} = process.env;

const Repository = require(REPO_TYPE === "mongo"
  ? "../repository/mongodb/mongoRepository"
  : "../repository/memory/memoryRepository");
//const Repository = require("../repository/mongodb/mongoRepository");
const repoOptions = {
  mongoUrl: `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_URL}/${MONGO_DB_NAME}`,
  dbName: MONGO_DB_NAME,
};

const users = new Repository(User, "user", repoOptions);

module.exports = {
  users,
};
