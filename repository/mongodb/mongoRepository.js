const Repository = require("../repository");
const DB = require("./db");

class MongoRepository extends Repository {
  constructor(recordClass, recordName, options) {
    super(recordClass, recordName, options);
    const { mongoUrl, dbName } = options;

    this.db = new DB(mongoUrl, dbName);
  }

  async find(queryObject = {}) {
    let collection = await this.db.collection(this.recordName);
    let records = await collection.find(queryObject).toArray();

    return records.map((record) => {
      let instance = this.new();

      for (let key in record) {
        if (record.hasOwnProperty(key)) {
          instance[key] = record[key];
        }
      }

      return instance;
    });
  }

  async findOne(queryObject = {}) {
    let collection = await this.db.collection(this.recordName);
    let record = await collection.findOne(queryObject);

    if (!record) {
      return;
    }

    let instance = this.new();

    for (let key in record) {
      if (record.hasOwnProperty(key)) {
        instance[key] = record[key];
      }
    }

    return instance;
  }

  async list() {
    return this.find({});
  }

  async insert(record) {
    this.setCreatedAt(record);
    let collection = await this.db.collection(this.recordName);

    record = this.removeHelpers(record);
    await collection
      .updateOne(record.id, { $set: record }, { upsert: true })
      .catch((err) => console.log(err));

    this.addHelpers(record);
    return record;
  }

  async update(queryObject = {}, record) {
    let collection = await this.db.collection(this.recordName);
    this.setUpdatedAt(record);
    let response = await collection.updateMany(queryObject, { $set: record });
    return response;
  }

  async updateOne(record) {
    let collection = await this.db.collection(this.recordName);
    this.setUpdatedAt(record);
    let response = await collection.updateOne(record.id, { $set: record });
    return response;
  }

  async delete(queryObject = {}) {
    let collection = await this.db.collection(this.recordName);
    let deleted = await collection.deleteMany(queryObject);
    return deleted;
  }

  async has(queryObject = {}) {
    let record = await this.find(queryObject);
    return record.length > 0;
  }
}

module.exports = MongoRepository;
