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

    return records.map((record) => this.from(record));
  }

  async findOne(queryObject = {}) {
    let collection = await this.db.collection(this.recordName);
    let record = await collection.findOne(queryObject);

    if (!record) {
      return;
    }

    return this.from(record);
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
    let reponse = await collection.updateMany(queryObject, { $set: record });
    return this.from(reponse);
  }

  async updateOne(record) {
    let collection = await this.db.collection(this.recordName);
    this.setUpdatedAt(record);
    let response = await collection.updateOne(record.id, { $set: record });
    return this.from(response);
  }

  async delete(queryObject = {}) {
    let collection = await this.db.collection(this.recordName);
    let deleted = await collection.deleteMany(queryObject);
    return deleted;
  }

  async has(queryObject = {}) {
    let record = await this.findOne(queryObject);
    return !!record;
  }

  // default distance 10km
  async near(longitude, latitude, distance = 300000) {
    let collection = await this.db.collection(this.recordName);

    let records = await collection
      .find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: distance,
          },
        },
      })
      .sort({ score: -1 })
      .limit(10)
      .toArray();

    return records.map((record) => this.from(record));
  }
}

module.exports = MongoRepository;
