const { MongoClient } = require("mongodb");

class MongoDbClient {
  constructor(url, dbName) {
    console.info("Connecting to:", url, dbName);
    this.url = url;
    this.dbName = dbName;

    this.db = undefined;
    this.client = undefined;
  }

  async connect() {
    if (this.db) {
      return this.db;
    }

    return MongoClient.connect(this.url)
      .then((client) => {
        this.client = client;
        this.db = client.db(this.dbName);
      })
      .catch((err) => {
        throw err;
      });
  }

  async close() {
    this.client.close();
    this.client = undefined;
    this.db = undefined;
  }

  async collection(name) {
    let db = await this.connect().catch((err) => console.log(err));
    return db.collection(name);
  }
}

module.exports = MongoDbClient;
